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

var ErrTeacherSubjectNotFound = errors.New("teacher_subject record not found")

type TeacherSubjectRepository struct {
	collection *mongo.Collection
}

func NewTeacherSubjectRepository(db *mongo.Database) *TeacherSubjectRepository {
	return &TeacherSubjectRepository{collection: db.Collection("teacher_subjects")}
}

// FindByTeacher: daftar mapel yang guru ini kompeten mengajar.
func (r *TeacherSubjectRepository) FindByTeacher(ctx context.Context, teacherID primitive.ObjectID) ([]model.TeacherSubject, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"teacher_id": teacherID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var records []model.TeacherSubject
	if err := cursor.All(ctx, &records); err != nil {
		return nil, err
	}
	return records, nil
}

// FindBySubject: daftar guru yang kompeten mengajar mapel ini (berguna saat
// Kurikulum mau menugaskan guru ke suatu kelas untuk mapel tertentu —
// tampilkan hanya guru yang qualified).
func (r *TeacherSubjectRepository) FindBySubject(ctx context.Context, subjectID primitive.ObjectID) ([]model.TeacherSubject, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"subject_id": subjectID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var records []model.TeacherSubject
	if err := cursor.All(ctx, &records); err != nil {
		return nil, err
	}
	return records, nil
}

func (r *TeacherSubjectRepository) Create(ctx context.Context, ts *model.TeacherSubject) error {
	now := time.Now()
	ts.IsActive = true
	ts.CreatedAt = now
	ts.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, ts)
	if err != nil {
		return err
	}
	ts.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *TeacherSubjectRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrTeacherSubjectNotFound
	}
	return nil
}

// EnsureIndexes: (teacher_id, subject_id) unique — tidak boleh ada dua
// dokumen kompetensi yang sama untuk kombinasi guru+mapel yang sama.
func (r *TeacherSubjectRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "teacher_id", Value: 1}, {Key: "subject_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}