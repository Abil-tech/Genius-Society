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

var ErrGradeNotFound = errors.New("grade not found")

type GradeRepository struct {
	collection *mongo.Collection
}

func NewGradeRepository(db *mongo.Database) *GradeRepository {
	return &GradeRepository{collection: db.Collection("grades")}
}

func (r *GradeRepository) FindOne(ctx context.Context, studentID, subjectID, classID, academicYearID primitive.ObjectID, semester model.SemesterName) (*model.Grade, error) {
	var g model.Grade
	err := r.collection.FindOne(ctx, bson.M{
		"student_id":       studentID,
		"subject_id":       subjectID,
		"class_id":         classID,
		"academic_year_id": academicYearID,
		"semester":         semester,
		"is_active":        true,
	}).Decode(&g)
	if err == mongo.ErrNoDocuments {
		return nil, ErrGradeNotFound
	}
	if err != nil {
		return nil, err
	}
	return &g, nil
}

// FindByStudentAndYear: seluruh nilai (semua mapel) satu siswa pada satu
// tahun ajaran — dipakai untuk rapor/dashboard murid.
func (r *GradeRepository) FindByStudentAndYear(ctx context.Context, studentID, academicYearID primitive.ObjectID) ([]model.Grade, error) {
	cursor, err := r.collection.Find(ctx, bson.M{
		"student_id":       studentID,
		"academic_year_id": academicYearID,
		"is_active":        true,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var grades []model.Grade
	if err := cursor.All(ctx, &grades); err != nil {
		return nil, err
	}
	return grades, nil
}

// FindByClassSubjectSemester: nilai SEMUA siswa di satu kelas untuk satu
// mapel+semester — dasar untuk fitur Ranking (section 12).
func (r *GradeRepository) FindByClassSubjectSemester(ctx context.Context, classID, subjectID, academicYearID primitive.ObjectID, semester model.SemesterName) ([]model.Grade, error) {
	opts := options.Find().SetSort(bson.D{{Key: "final_score", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"class_id":         classID,
		"subject_id":       subjectID,
		"academic_year_id": academicYearID,
		"semester":         semester,
		"is_active":        true,
	}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var grades []model.Grade
	if err := cursor.All(ctx, &grades); err != nil {
		return nil, err
	}
	return grades, nil
}

// upsertField adalah helper INTERNAL (unexported) — bukan API publik yang
// bisa dipanggil dengan nama field sembarangan dari luar package. Semua
// pemanggil dari luar WAJIB lewat method eksplisit di bawah
// (UpsertTugasAssessmentAverage / UpsertUTSScore / UpsertUASScore) supaya
// nama field bson terjamin benar oleh compiler, bukan oleh disiplin
// pemanggil mengetik string dengan benar.
func (r *GradeRepository) upsertField(ctx context.Context, studentID, subjectID, classID, academicYearID primitive.ObjectID, semester model.SemesterName, teacherID primitive.ObjectID, bsonField string, value float64) error {
	now := time.Now()
	filter := bson.M{
		"student_id":       studentID,
		"subject_id":       subjectID,
		"class_id":         classID,
		"academic_year_id": academicYearID,
		"semester":         semester,
	}
	_, err := r.collection.UpdateOne(ctx, filter,
		bson.M{
			"$set": bson.M{
				bsonField:    value,
				"teacher_id": teacherID,
				"is_active":  true,
				"updatedAt":  now,
			},
			"$setOnInsert": bson.M{"createdAt": now},
		},
		options.Update().SetUpsert(true),
	)
	return err
}

// UpsertTugasAssessmentAverage/UpsertUTSScore/UpsertUASScore meng-update
// SATU komponen nilai tanpa menimpa komponen lain yang belum berubah, dan
// membuat dokumen baru kalau belum ada. FinalScore SENGAJA tidak diisi di
// sini — itu tugas RecomputeFinalScore, dipanggil terpisah setelah
// komponen yang relevan selesai di-update.
func (r *GradeRepository) UpsertTugasAssessmentAverage(ctx context.Context, studentID, subjectID, classID, academicYearID primitive.ObjectID, semester model.SemesterName, teacherID primitive.ObjectID, value float64) error {
	return r.upsertField(ctx, studentID, subjectID, classID, academicYearID, semester, teacherID, "tugas_assessment_average", value)
}

func (r *GradeRepository) UpsertUTSScore(ctx context.Context, studentID, subjectID, classID, academicYearID primitive.ObjectID, semester model.SemesterName, teacherID primitive.ObjectID, value float64) error {
	return r.upsertField(ctx, studentID, subjectID, classID, academicYearID, semester, teacherID, "uts_score", value)
}

func (r *GradeRepository) UpsertUASScore(ctx context.Context, studentID, subjectID, classID, academicYearID primitive.ObjectID, semester model.SemesterName, teacherID primitive.ObjectID, value float64) error {
	return r.upsertField(ctx, studentID, subjectID, classID, academicYearID, semester, teacherID, "uas_score", value)
}

// RecomputeFinalScore menghitung ulang FinalScore dari komponen yang ada
// SEKARANG di dokumen (mengasumsikan komponen sudah lengkap sesuai
// kebutuhan bobot) dan menyimpannya. Perhitungan bobot aktualnya dilakukan
// di service layer (perlu tahu GradingConfig subject terkait) — method ini
// hanya menyimpan hasil akhirnya.
func (r *GradeRepository) RecomputeFinalScore(ctx context.Context, id primitive.ObjectID, finalScore float64) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"final_score": finalScore, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrGradeNotFound
	}
	return nil
}

func (r *GradeRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrGradeNotFound
	}
	return nil
}

// EnsureIndexes: (student_id, subject_id, class_id, academic_year_id,
// semester) unique — satu dokumen nilai per kombinasi ini, ditegakkan
// lewat upsert di UpsertComponent.
func (r *GradeRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "student_id", Value: 1},
				{Key: "subject_id", Value: 1},
				{Key: "class_id", Value: 1},
				{Key: "academic_year_id", Value: 1},
				{Key: "semester", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		},
		{Keys: bson.D{{Key: "class_id", Value: 1}, {Key: "subject_id", Value: 1}, {Key: "final_score", Value: -1}}},
	})
	return err
}