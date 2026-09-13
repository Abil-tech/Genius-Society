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

var ErrClassStudentNotFound = errors.New("class_student record not found")

type ClassStudentRepository struct {
	collection *mongo.Collection
}

func NewClassStudentRepository(db *mongo.Database) *ClassStudentRepository {
	return &ClassStudentRepository{collection: db.Collection("class_students")}
}

// FindByStudentAndYear: dipakai untuk tahu siswa ini ada di kelas mana pada
// tahun ajaran tertentu (mis. saat murid login, tentukan kelasnya sekarang).
func (r *ClassStudentRepository) FindByStudentAndYear(ctx context.Context, studentID, academicYearID primitive.ObjectID) (*model.ClassStudent, error) {
	var cs model.ClassStudent
	err := r.collection.FindOne(ctx, bson.M{
		"student_id":       studentID,
		"academic_year_id": academicYearID,
		"is_active":        true,
	}).Decode(&cs)
	if err == mongo.ErrNoDocuments {
		return nil, ErrClassStudentNotFound
	}
	if err != nil {
		return nil, err
	}
	return &cs, nil
}

// FindByClass: daftar siswa (junction record) di satu kelas pada tahun
// ajaran tertentu, diurutkan berdasarkan roll_number.
func (r *ClassStudentRepository) FindByClass(ctx context.Context, classID, academicYearID primitive.ObjectID) ([]model.ClassStudent, error) {
	opts := options.Find().SetSort(bson.D{{Key: "roll_number", Value: 1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"class_id":         classID,
		"academic_year_id": academicYearID,
		"is_active":        true,
	}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var records []model.ClassStudent
	if err := cursor.All(ctx, &records); err != nil {
		return nil, err
	}
	return records, nil
}

// FindHistoryByStudent: seluruh riwayat penempatan kelas seorang siswa dari
// tahun ke tahun.
func (r *ClassStudentRepository) FindHistoryByStudent(ctx context.Context, studentID primitive.ObjectID) ([]model.ClassStudent, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"student_id": studentID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var records []model.ClassStudent
	if err := cursor.All(ctx, &records); err != nil {
		return nil, err
	}
	return records, nil
}

// Create menempatkan siswa ke suatu kelas pada suatu tahun ajaran.
// Pemanggil WAJIB memastikan siswa belum punya penempatan lain yang masih
// EnrollmentActive di tahun ajaran yang sama — unique index di bawah
// mencegah duplikat dokumen (student_id, academic_year_id), TAPI tidak
// mencegah kasus "siswa dipindah ke kelas lain di tahun ajaran yang sama"
// kecuali record lama di-nonaktifkan dulu (SoftDelete atau UpdateStatus ke
// EnrollmentTransferred).
func (r *ClassStudentRepository) Create(ctx context.Context, cs *model.ClassStudent) error {
	now := time.Now()
	if cs.Status == "" {
		cs.Status = model.EnrollmentActive
	}
	cs.IsActive = true
	cs.CreatedAt = now
	cs.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, cs)
	if err != nil {
		return err
	}
	cs.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *ClassStudentRepository) UpdateStatus(ctx context.Context, id primitive.ObjectID, status model.EnrollmentStatus) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"status": status, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrClassStudentNotFound
	}
	return nil
}

func (r *ClassStudentRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrClassStudentNotFound
	}
	return nil
}

// EnsureIndexes:
//   - (student_id, academic_year_id) unique: satu siswa hanya boleh punya
//     SATU dokumen penempatan kelas per tahun ajaran (kalau pindah kelas
//     di tahun ajaran yang sama, update dokumen yang ada, jangan insert baru).
//   - (class_id, academic_year_id, roll_number) unique: no. absen tidak
//     boleh dobel di kelas & tahun ajaran yang sama.
func (r *ClassStudentRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "student_id", Value: 1}, {Key: "academic_year_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{Key: "class_id", Value: 1}, {Key: "academic_year_id", Value: 1}, {Key: "roll_number", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}