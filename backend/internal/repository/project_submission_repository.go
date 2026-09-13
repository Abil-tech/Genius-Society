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

var (
	ErrProjectSubmissionNotFound  = errors.New("project submission not found")
	ErrProjectResubmitNotAllowed = errors.New("resubmit not allowed for this project submission")
)

type ProjectSubmissionRepository struct {
	collection *mongo.Collection
}

func NewProjectSubmissionRepository(db *mongo.Database) *ProjectSubmissionRepository {
	return &ProjectSubmissionRepository{collection: db.Collection("project_submissions")}
}

func (r *ProjectSubmissionRepository) FindByProjectAndStudent(ctx context.Context, projectID, studentID primitive.ObjectID) (*model.ProjectSubmission, error) {
	var s model.ProjectSubmission
	err := r.collection.FindOne(ctx, bson.M{
		"project_id": projectID,
		"student_id": studentID,
		"is_active":  true,
	}).Decode(&s)
	if err == mongo.ErrNoDocuments {
		return nil, ErrProjectSubmissionNotFound
	}
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *ProjectSubmissionRepository) FindByProject(ctx context.Context, projectID primitive.ObjectID) ([]model.ProjectSubmission, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"project_id": projectID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var submissions []model.ProjectSubmission
	if err := cursor.All(ctx, &submissions); err != nil {
		return nil, err
	}
	return submissions, nil
}

func (r *ProjectSubmissionRepository) FindByStudent(ctx context.Context, studentID primitive.ObjectID) ([]model.ProjectSubmission, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"student_id": studentID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var submissions []model.ProjectSubmission
	if err := cursor.All(ctx, &submissions); err != nil {
		return nil, err
	}
	return submissions, nil
}

func (r *ProjectSubmissionRepository) Create(ctx context.Context, s *model.ProjectSubmission) error {
	now := time.Now()
	s.AttemptNumber = 1
	s.AllowResubmit = false
	s.IsActive = true
	s.CreatedAt = now
	s.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, s)
	if err != nil {
		return err
	}
	s.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

// Resubmit: lihat penjelasan detail di AssignmentSubmissionRepository.Resubmit
// — perilakunya identik.
func (r *ProjectSubmissionRepository) Resubmit(ctx context.Context, id primitive.ObjectID, file model.FileMetadata, submittedAt time.Time, isLate bool) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true, "allow_resubmit": true},
		bson.M{
			"$set": bson.M{
				"file":           file,
				"submitted_at":   submittedAt,
				"is_late":        isLate,
				"allow_resubmit": false,
				"updatedAt":      time.Now(),
			},
			"$unset": bson.M{
				"score":                "",
				"feedback":             "",
				"graded_at":            "",
				"graded_by_teacher_id": "",
			},
			"$inc": bson.M{"attempt_number": 1},
		},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrProjectResubmitNotAllowed
	}
	return nil
}

func (r *ProjectSubmissionRepository) SetAllowResubmit(ctx context.Context, id primitive.ObjectID, allow bool) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"allow_resubmit": allow, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrProjectSubmissionNotFound
	}
	return nil
}

func (r *ProjectSubmissionRepository) GradeSubmission(ctx context.Context, id primitive.ObjectID, score float64, feedback string, gradedByTeacherID primitive.ObjectID) error {
	now := time.Now()
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"score":                score,
			"feedback":             feedback,
			"graded_at":            now,
			"graded_by_teacher_id": gradedByTeacherID,
			"updatedAt":            now,
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrProjectSubmissionNotFound
	}
	return nil
}

func (r *ProjectSubmissionRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrProjectSubmissionNotFound
	}
	return nil
}

func (r *ProjectSubmissionRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "project_id", Value: 1}, {Key: "student_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}