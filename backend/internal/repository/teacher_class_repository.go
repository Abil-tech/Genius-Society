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

var ErrTeacherClassNotFound = errors.New("teacher_class record not found")

type TeacherClassRepository struct {
	collection *mongo.Collection
}

func NewTeacherClassRepository(db *mongo.Database) *TeacherClassRepository {
	return &TeacherClassRepository{collection: db.Collection("teacher_classes")}
}

// FindByTeacherAndYear: daftar penugasan mengajar seorang guru pada satu
// tahun ajaran (dipakai untuk "Jadwal Mengajar" / "Kelas yang Diajar" guru).
func (r *TeacherClassRepository) FindByTeacherAndYear(ctx context.Context, teacherID, academicYearID primitive.ObjectID) ([]model.TeacherClass, error) {
	cursor, err := r.collection.Find(ctx, bson.M{
		"teacher_id":       teacherID,
		"academic_year_id": academicYearID,
		"is_active":        true,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var records []model.TeacherClass
	if err := cursor.All(ctx, &records); err != nil {
		return nil, err
	}
	return records, nil
}

// FindByClassSubjectYear: siapa saja guru yang mengajar mapel tertentu di
// kelas tertentu pada tahun ajaran tertentu. Bisa lebih dari satu hasil
// kalau co-teaching/guru pengganti diizinkan (lihat catatan di model).
func (r *TeacherClassRepository) FindByClassSubjectYear(ctx context.Context, classID, subjectID, academicYearID primitive.ObjectID) ([]model.TeacherClass, error) {
	cursor, err := r.collection.Find(ctx, bson.M{
		"class_id":         classID,
		"subject_id":       subjectID,
		"academic_year_id": academicYearID,
		"is_active":        true,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var records []model.TeacherClass
	if err := cursor.All(ctx, &records); err != nil {
		return nil, err
	}
	return records, nil
}

// Create membuat penugasan mengajar baru. Pemanggil (service layer) WAJIB
// memvalidasi bahwa (TeacherID, SubjectID) sudah ada di teacher_subjects
// terlebih dulu — guru tidak boleh ditugaskan mengajar mapel yang dia tidak
// kompeten mengajarnya. Repository ini TIDAK melakukan validasi
// cross-collection tersebut.
func (r *TeacherClassRepository) Create(ctx context.Context, tc *model.TeacherClass) error {
	now := time.Now()
	tc.IsActive = true
	tc.CreatedAt = now
	tc.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, tc)
	if err != nil {
		return err
	}
	tc.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *TeacherClassRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrTeacherClassNotFound
	}
	return nil
}

// EnsureIndexes: (teacher_id, subject_id, class_id, academic_year_id)
// unique — mencegah dokumen penugasan yang benar-benar identik dobel.
// TIDAK mencegah co-teaching (guru lain mengajar mapel+kelas+tahun ajaran
// yang sama) — lihat catatan desain di model.TeacherClass kalau itu perlu
// dibatasi jadi satu guru per kombinasi.
func (r *TeacherClassRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "teacher_id", Value: 1},
				{Key: "subject_id", Value: 1},
				{Key: "class_id", Value: 1},
				{Key: "academic_year_id", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}