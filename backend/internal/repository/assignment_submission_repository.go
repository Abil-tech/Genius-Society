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
	ErrAssignmentSubmissionNotFound = errors.New("assignment submission not found")
	ErrResubmitNotAllowed           = errors.New("resubmit not allowed for this submission")
)

type AssignmentSubmissionRepository struct {
	collection *mongo.Collection
}

func NewAssignmentSubmissionRepository(db *mongo.Database) *AssignmentSubmissionRepository {
	return &AssignmentSubmissionRepository{collection: db.Collection("assignment_submissions")}
}

func (r *AssignmentSubmissionRepository) FindByAssignmentAndStudent(ctx context.Context, assignmentID, studentID primitive.ObjectID) (*model.AssignmentSubmission, error) {
	var s model.AssignmentSubmission
	err := r.collection.FindOne(ctx, bson.M{
		"assignment_id": assignmentID,
		"student_id":    studentID,
		"is_active":     true,
	}).Decode(&s)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAssignmentSubmissionNotFound
	}
	if err != nil {
		return nil, err
	}
	return &s, nil
}

// FindByAssignment: semua submission untuk satu tugas (dipakai guru untuk
// melihat & menilai pengumpulan siswa).
func (r *AssignmentSubmissionRepository) FindByAssignment(ctx context.Context, assignmentID primitive.ObjectID) ([]model.AssignmentSubmission, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"assignment_id": assignmentID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var submissions []model.AssignmentSubmission
	if err := cursor.All(ctx, &submissions); err != nil {
		return nil, err
	}
	return submissions, nil
}

// FindByStudent: semua submission milik satu siswa (dipakai dashboard murid).
func (r *AssignmentSubmissionRepository) FindByStudent(ctx context.Context, studentID primitive.ObjectID) ([]model.AssignmentSubmission, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"student_id": studentID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var submissions []model.AssignmentSubmission
	if err := cursor.All(ctx, &submissions); err != nil {
		return nil, err
	}
	return submissions, nil
}

// Create: submission PERTAMA kali untuk kombinasi assignment+student ini.
// Pemanggil (service layer) WAJIB sudah menghitung IsLate (bandingkan
// SubmittedAt dengan Assignment.Deadline) SEBELUM memanggil ini.
func (r *AssignmentSubmissionRepository) Create(ctx context.Context, s *model.AssignmentSubmission) error {
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

// Resubmit menimpa submission yang SUDAH ADA dengan file baru: menambah
// AttemptNumber, mereset Score/Feedback/GradedAt/GradedByTeacherID ke nil
// (nilai lama tidak relevan untuk jawaban baru), dan mereset AllowResubmit
// ke false (guru harus izinkan lagi untuk resubmit berikutnya).
//
// Method ini HANYA berhasil kalau AllowResubmit sedang true pada dokumen
// tersebut — kalau tidak, mengembalikan ErrResubmitNotAllowed. Ini
// pengecekan di level database (filter query), bukan cuma di service
// layer, supaya tidak ada race condition antara "cek izin" dan "resubmit".
func (r *AssignmentSubmissionRepository) Resubmit(ctx context.Context, id primitive.ObjectID, file model.FileMetadata, submittedAt time.Time, isLate bool) error {
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
		return ErrResubmitNotAllowed
	}
	return nil
}

// SetAllowResubmit: guru mengizinkan/mencabut izin resubmit untuk satu
// submission tertentu.
func (r *AssignmentSubmissionRepository) SetAllowResubmit(ctx context.Context, id primitive.ObjectID, allow bool) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"allow_resubmit": allow, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssignmentSubmissionNotFound
	}
	return nil
}

// GradeSubmission mengisi nilai & feedback dari guru.
func (r *AssignmentSubmissionRepository) GradeSubmission(ctx context.Context, id primitive.ObjectID, score float64, feedback string, gradedByTeacherID primitive.ObjectID) error {
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
		return ErrAssignmentSubmissionNotFound
	}
	return nil
}

func (r *AssignmentSubmissionRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssignmentSubmissionNotFound
	}
	return nil
}

// EnsureIndexes: (assignment_id, student_id) unique — satu siswa hanya
// boleh punya SATU dokumen submission per tugas (resubmit meng-update
// dokumen yang sama, lihat Resubmit).
func (r *AssignmentSubmissionRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "assignment_id", Value: 1}, {Key: "student_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}