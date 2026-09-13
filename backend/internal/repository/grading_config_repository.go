package repository

import (
	"context"
	"errors"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrGradingConfigNotFound = errors.New("grading config not found")

// DefaultTugasAssessmentWeight/DefaultUTSWeight/DefaultUASWeight adalah
// fallback sesuai spec (60/20/20) untuk subject yang BELUM punya
// GradingConfig sendiri. Dipakai oleh service layer, bukan repository ini
// — repository hanya query apa yang ada di database.
const (
	DefaultTugasAssessmentWeight = 60.0
	DefaultUTSWeight             = 20.0
	DefaultUASWeight             = 20.0
)

type GradingConfigRepository struct {
	collection *mongo.Collection
}

func NewGradingConfigRepository(db *mongo.Database) *GradingConfigRepository {
	return &GradingConfigRepository{collection: db.Collection("grading_configs")}
}

// FindBySubject mengembalikan ErrGradingConfigNotFound kalau subject ini
// belum punya konfigurasi kustom — pemanggil (service layer) WAJIB
// menangani error ini dengan fallback ke Default*Weight di atas, BUKAN
// meneruskan error tersebut sebagai kegagalan ke pengguna.
func (r *GradingConfigRepository) FindBySubject(ctx context.Context, subjectID primitive.ObjectID) (*model.GradingConfig, error) {
	var gc model.GradingConfig
	err := r.collection.FindOne(ctx, bson.M{"subject_id": subjectID, "is_active": true}).Decode(&gc)
	if err == mongo.ErrNoDocuments {
		return nil, ErrGradingConfigNotFound
	}
	if err != nil {
		return nil, err
	}
	return &gc, nil
}

// Upsert membuat atau mengganti total konfigurasi bobot untuk satu subject.
// Pemanggil WAJIB memvalidasi tugasWeight+utsWeight+uasWeight == 100
// SEBELUM memanggil ini — repository tidak melakukan validasi tersebut.
func (r *GradingConfigRepository) Upsert(ctx context.Context, subjectID primitive.ObjectID, tugasWeight, utsWeight, uasWeight float64) error {
	now := time.Now()
	_, err := r.collection.UpdateOne(ctx,
		bson.M{"subject_id": subjectID},
		bson.M{
			"$set": bson.M{
				"tugas_assessment_weight": tugasWeight,
				"uts_weight":              utsWeight,
				"uas_weight":              uasWeight,
				"is_active":               true,
				"updatedAt":               now,
			},
			"$setOnInsert": bson.M{"createdAt": now},
		},
		options.Update().SetUpsert(true),
	)
	return err
}

func (r *GradingConfigRepository) SoftDelete(ctx context.Context, subjectID primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"subject_id": subjectID, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrGradingConfigNotFound
	}
	return nil
}

// EnsureIndexes: subject_id unique — satu subject cuma boleh punya satu
// konfigurasi bobot aktif.
func (r *GradingConfigRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "subject_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}