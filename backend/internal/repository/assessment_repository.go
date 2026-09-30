package repository

import (
	"context"
	"errors"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	 "go.mongodb.org/mongo-driver/v2/bson"
    "go.mongodb.org/mongo-driver/v2/mongo"
    "go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	ErrAssessmentNotFound           = errors.New("assessment not found")
)

// ==================== ASSESSMENT REPOSITORY ====================

type AssessmentRepository struct {
	collection *mongo.Collection
}

func NewAssessmentRepository(db *mongo.Database) *AssessmentRepository {
	return &AssessmentRepository{collection: db.Collection("assessments")}
}

// FindByID: cari assessment berdasarkan ID
func (r *AssessmentRepository) FindByID(ctx context.Context, id bson.ObjectID) (*model.Assessment, error) {
	var assessment model.Assessment
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&assessment)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAssessmentNotFound
	}
	if err != nil {
		return nil, err
	}
	return &assessment, nil
}

// FindByTeacher: semua assessment yang dibuat guru ini
func (r *AssessmentRepository) FindByTeacher(ctx context.Context, teacherID bson.ObjectID) ([]model.Assessment, error) {
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"teacher_id": teacherID,
		"is_active":  true,
	}, opts)
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

// FindByTeacherAndClass: assessment guru untuk kelas spesifik
func (r *AssessmentRepository) FindByTeacherAndClass(ctx context.Context, teacherID, classID bson.ObjectID) ([]model.Assessment, error) {
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"teacher_id": teacherID,
		"class_id":   classID,
		"is_active":  true,
	}, opts)
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

// FindByTeacherAndSubject: assessment guru untuk mata pelajaran spesifik
func (r *AssessmentRepository) FindByTeacherAndSubject(ctx context.Context, teacherID, subjectID bson.ObjectID) ([]model.Assessment, error) {
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"teacher_id": teacherID,
		"subject_id": subjectID,
		"is_active":  true,
	}, opts)
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

// CountByTeacher: jumlah assessment yang dibuat guru ini
func (r *AssessmentRepository) CountByTeacher(ctx context.Context, teacherID bson.ObjectID) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"teacher_id": teacherID,
		"is_active":  true,
	})
}

// CountActiveByTeacher: assessment guru yang sedang berlangsung
func (r *AssessmentRepository) CountActiveByTeacher(ctx context.Context, teacherID bson.ObjectID, now time.Time) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"teacher_id": teacherID,
		"is_active":  true,
		"start_date": bson.M{"$lte": now},
		"end_date":   bson.M{"$gte": now},
	})
}

// CountDeadlineSoonByTeacher: assessment dengan deadline dalam X jam ke depan
func (r *AssessmentRepository) CountDeadlineSoonByTeacher(ctx context.Context, teacherID bson.ObjectID, now time.Time, hoursFromNow int) (int64, error) {
	futureTime := now.Add(time.Duration(hoursFromNow) * time.Hour)
	return r.collection.CountDocuments(ctx, bson.M{
		"teacher_id": teacherID,
		"is_active":  true,
		"end_date": bson.M{
			"$gte": now,
			"$lte": futureTime,
		},
	})
}

// Create: guru membuat assessment baru
func (r *AssessmentRepository) Create(ctx context.Context, a *model.Assessment) error {
	now := time.Now()
	a.IsActive = true
	a.CreatedAt = now
	a.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, a)
	if err != nil {
		return err
	}
	a.ID = res.InsertedID.(bson.ObjectID)
	return nil
}

// Update: guru edit metadata assessment
func (r *AssessmentRepository) Update(ctx context.Context, id bson.ObjectID, title, description string, startDate, endDate time.Time, durationMinutes int, maxAttempts int, showResultsImmediately bool) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"title":                    title,
			"description":              description,
			"start_date":               startDate,
			"end_date":                 endDate,
			"duration_minutes":         durationMinutes,
			"max_attempts":             maxAttempts,
			"show_results_immediately": showResultsImmediately,
			"updated_at":               time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentNotFound
	}
	return nil
}

// SoftDelete: guru hapus assessment
func (r *AssessmentRepository) SoftDelete(ctx context.Context, id bson.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updated_at": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentNotFound
	}
	return nil
}

// EnsureIndexes: index untuk query assessment
func (r *AssessmentRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "teacher_id", Value: 1}}},
		{Keys: bson.D{{Key: "teacher_id", Value: 1}, {Key: "class_id", Value: 1}}},
		{Keys: bson.D{{Key: "teacher_id", Value: 1}, {Key: "subject_id", Value: 1}}},
		{Keys: bson.D{{Key: "class_id", Value: 1}}},
		{Keys: bson.D{{Key: "subject_id", Value: 1}}},
		{Keys: bson.D{{Key: "start_date", Value: 1}}},
		{Keys: bson.D{{Key: "end_date", Value: 1}}},
	})
	return err
}

// CountActiveByEndDate: jumlah assessment yang belum lewat deadline
func (r *AssessmentRepository) CountActiveByEndDate(ctx context.Context, now time.Time) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"is_active": true,
		"end_date":  bson.M{"$gte": now},
	})
}

// CountEndDateWithin: jumlah assessment dengan deadline di antara from dan to
func (r *AssessmentRepository) CountEndDateWithin(ctx context.Context, from, to time.Time) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"is_active": true,
		"end_date":  bson.M{"$gte": from, "$lte": to},
	})
}

