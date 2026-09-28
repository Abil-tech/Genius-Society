package repository

import (
	"context"
	"errors"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var ErrAssessmentNotFound = errors.New("assessment not found")

type AssessmentRepository struct {
	collection *mongo.Collection
}

func NewAssessmentRepository(db *mongo.Database) *AssessmentRepository {
	return &AssessmentRepository{collection: db.Collection("assessments")}
}

// CountActive menghitung assessment yang SEDANG BERJALAN (sekarang ada di
// antara start_date-end_date) — dipakai kartu "Assessment Aktif".
func (r *AssessmentRepository) CountActive(ctx context.Context, now time.Time) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"is_active":  true,
		"start_date": bson.M{"$lte": now},
		"end_date":   bson.M{"$gte": now},
	})
}

// CountDueWithin menghitung assessment dengan end_date di antara now dan
// until — dipakai statusRows "Mendekati Deadline".
func (r *AssessmentRepository) CountDueWithin(ctx context.Context, now, until time.Time) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"is_active": true,
		"end_date":  bson.M{"$gte": now, "$lte": until},
	})
}

// CountActiveByEndDate: jumlah assessment yang jendela pengerjaannya belum
// tutup (end_date >= now). "Aktif" di sini TIDAK mengecek StartDate — jadi
// termasuk juga assessment yang belum dibuka tapi sudah dijadwalkan.
func (r *AssessmentRepository) CountActiveByEndDate(ctx context.Context, now time.Time) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"is_active": true,
		"end_date":  bson.M{"$gte": now},
	})
}

// CountEndDateWithin: jumlah assessment dengan end_date jatuh di antara
// from dan to (dipakai untuk "Mendekati Deadline < 24 jam" di statusRows).
func (r *AssessmentRepository) CountEndDateWithin(ctx context.Context, from, to time.Time) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"is_active": true,
		"end_date":  bson.M{"$gte": from, "$lte": to},
	})
}

func (r *AssessmentRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Assessment, error) {
	var a model.Assessment
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAssessmentNotFound
	}
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *AssessmentRepository) FindByClass(ctx context.Context, classID primitive.ObjectID) ([]model.Assessment, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"class_id": classID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var assessments []model.Assessment
	if err := cursor.All(ctx, &assessments); err != nil {
		return nil, err
	}
	return assessments, nil
}

func (r *AssessmentRepository) FindByTeacher(ctx context.Context, teacherID primitive.ObjectID) ([]model.Assessment, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"teacher_id": teacherID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var assessments []model.Assessment
	if err := cursor.All(ctx, &assessments); err != nil {
		return nil, err
	}
	return assessments, nil
}

// Create membuat assessment baru. MaxAttempts di-default ke 1 di sini
// kalau pemanggil tidak set (0) — mencegah lupa set field ini menghasilkan
// assessment tanpa batas attempt.
func (r *AssessmentRepository) Create(ctx context.Context, a *model.Assessment) error {
	now := time.Now()
	if a.MaxAttempts == 0 {
		a.MaxAttempts = 1
	}
	if a.Category == "" {
		a.Category = model.CategoryHarian
	}
	a.IsActive = true
	a.CreatedAt = now
	a.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, a)
	if err != nil {
		return err
	}
	a.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *AssessmentRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentNotFound
	}
	return nil
}

func (r *AssessmentRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "class_id", Value: 1}}},
		{Keys: bson.D{{Key: "teacher_id", Value: 1}}},
	})
	return err
}