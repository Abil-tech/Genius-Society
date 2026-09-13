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

var ErrAssessmentAttemptNotFound = errors.New("assessment attempt not found")

type AssessmentAttemptRepository struct {
	collection *mongo.Collection
}

func NewAssessmentAttemptRepository(db *mongo.Database) *AssessmentAttemptRepository {
	return &AssessmentAttemptRepository{collection: db.Collection("assessment_attempts")}
}

func (r *AssessmentAttemptRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.AssessmentAttempt, error) {
	var a model.AssessmentAttempt
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAssessmentAttemptNotFound
	}
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *AssessmentAttemptRepository) FindByAssessmentAndStudent(ctx context.Context, assessmentID, studentID primitive.ObjectID) (*model.AssessmentAttempt, error) {
	var a model.AssessmentAttempt
	err := r.collection.FindOne(ctx, bson.M{
		"assessment_id": assessmentID,
		"student_id":    studentID,
		"is_active":     true,
	}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAssessmentAttemptNotFound
	}
	if err != nil {
		return nil, err
	}
	return &a, nil
}

// FindByAssessment: semua attempt untuk satu assessment (dipakai guru
// untuk melihat siapa saja yang sudah mengerjakan & menilai essay).
func (r *AssessmentAttemptRepository) FindByAssessment(ctx context.Context, assessmentID primitive.ObjectID) ([]model.AssessmentAttempt, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"assessment_id": assessmentID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var attempts []model.AssessmentAttempt
	if err := cursor.All(ctx, &attempts); err != nil {
		return nil, err
	}
	return attempts, nil
}

// StartAttempt membuat dokumen attempt baru saat siswa MULAI mengerjakan.
// Pemanggil (service layer) WAJIB validasi dulu: (1) sekarang ada di
// antara Assessment.StartDate-EndDate, (2) belum ada attempt lain untuk
// kombinasi ini (unique index di bawah jadi jaring pengaman terakhir kalau
// validasi service layer lolos karena race condition).
func (r *AssessmentAttemptRepository) StartAttempt(ctx context.Context, a *model.AssessmentAttempt) error {
	now := time.Now()
	if a.AttemptNumber == 0 {
		a.AttemptNumber = 1
	}
	a.StartedAt = now
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

// SubmitAttempt dipanggil SEKALI saat siswa submit. autoScore dihitung di
// service layer (jumlah Weight semua soal PG yang dijawab benar).
// isFullyGraded=true kalau assessment ini TIDAK punya soal essay sama
// sekali (langsung final), false kalau masih ada essay yang menunggu
// dinilai guru.
func (r *AssessmentAttemptRepository) SubmitAttempt(ctx context.Context, id primitive.ObjectID, autoScore float64, isFullyGraded bool, finalScore *float64) error {
	now := time.Now()
	update := bson.M{
		"submitted_at":    now,
		"auto_score":      autoScore,
		"is_fully_graded": isFullyGraded,
		"updatedAt":       now,
	}
	if finalScore != nil {
		update["final_score"] = *finalScore
	}
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": update},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentAttemptNotFound
	}
	return nil
}

// CompleteManualGrading dipanggil service layer SETELAH semua soal essay
// di attempt ini selesai dinilai guru — mengisi ManualScore, FinalScore
// (=AutoScore+ManualScore), dan menandai IsFullyGraded=true.
func (r *AssessmentAttemptRepository) CompleteManualGrading(ctx context.Context, id primitive.ObjectID, manualScore, finalScore float64) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"manual_score":    manualScore,
			"final_score":     finalScore,
			"is_fully_graded": true,
			"updatedAt":       time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentAttemptNotFound
	}
	return nil
}

func (r *AssessmentAttemptRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentAttemptNotFound
	}
	return nil
}

// EnsureIndexes: (assessment_id, student_id) unique — menegakkan
// MaxAttempts=1 di level database. KALAU MaxAttempts pernah diubah jadi
// >1, index ini WAJIB diganti ke (assessment_id, student_id,
// attempt_number) supaya beberapa attempt per siswa bisa disimpan.
func (r *AssessmentAttemptRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "assessment_id", Value: 1}, {Key: "student_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}