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
	ErrAcademicYearNotFound = errors.New("academic year not found")
	ErrSemesterNotFound     = errors.New("semester not found in this academic year")
)

type AcademicYearRepository struct {
	collection *mongo.Collection
}

func NewAcademicYearRepository(db *mongo.Database) *AcademicYearRepository {
	return &AcademicYearRepository{collection: db.Collection("academic_years")}
}

func (r *AcademicYearRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.AcademicYear, error) {
	var ay model.AcademicYear
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&ay)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAcademicYearNotFound
	}
	if err != nil {
		return nil, err
	}
	return &ay, nil
}

// FindCurrent mengembalikan tahun ajaran yang sedang berjalan (is_current=true).
// Mengembalikan ErrAcademicYearNotFound jika belum ada satupun yang ditandai
// current (mis. sebelum admin melakukan setup awal).
func (r *AcademicYearRepository) FindCurrent(ctx context.Context) (*model.AcademicYear, error) {
	var ay model.AcademicYear
	err := r.collection.FindOne(ctx, bson.M{"is_current": true, "is_active": true}).Decode(&ay)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAcademicYearNotFound
	}
	if err != nil {
		return nil, err
	}
	return &ay, nil
}

func (r *AcademicYearRepository) FindAll(ctx context.Context) ([]model.AcademicYear, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var years []model.AcademicYear
	if err := cursor.All(ctx, &years); err != nil {
		return nil, err
	}
	return years, nil
}

// Create membuat tahun ajaran baru. IsCurrent selalu dimulai dari false —
// pemberian status "current" WAJIB lewat SetCurrentAcademicYear agar
// keunikan is_current=true di seluruh collection terjaga.
func (r *AcademicYearRepository) Create(ctx context.Context, ay *model.AcademicYear) error {
	now := time.Now()
	ay.IsCurrent = false
	ay.IsActive = true
	ay.CreatedAt = now
	ay.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, ay)
	if err != nil {
		return err
	}
	ay.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

// SetCurrentAcademicYear menandai satu tahun ajaran sebagai yang sedang
// berjalan, dan melepas status current dari semua tahun ajaran lain.
//
// CATATAN: ini 2 operasi terpisah (unset semua, lalu set satu), bukan
// transaksi atomik. Di MongoDB Atlas replica set ini bisa dibungkus
// mongo.Session/WithTransaction untuk atomicity penuh; belum dilakukan di
// sini supaya tidak menambah dependency logic transaksi sebelum benar-benar
// dibutuhkan. Risiko race condition: dua request SetCurrentAcademicYear
// yang berbarengan bisa menghasilkan 0 atau 2 tahun ajaran current. Untuk
// operasi admin yang jarang dan tidak konkuren dalam praktik, ini
// acceptable risk — tapi harus didokumentasikan, bukan diam-diam diabaikan.
func (r *AcademicYearRepository) SetCurrentAcademicYear(ctx context.Context, id primitive.ObjectID) error {
	now := time.Now()

	if _, err := r.collection.UpdateMany(ctx,
		bson.M{"is_current": true},
		bson.M{"$set": bson.M{"is_current": false, "updatedAt": now}},
	); err != nil {
		return err
	}

	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_current": true, "updatedAt": now}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAcademicYearNotFound
	}
	return nil
}

// SetCurrentSemester menandai satu semester (berdasarkan nama, mis. "Ganjil")
// di dalam academic_years[id].semesters sebagai current, dan melepas current
// dari semester lain di array yang sama. Sama seperti SetCurrentAcademicYear,
// ini bukan operasi atomik lintas semester tapi karena berada di satu
// dokumen, MongoDB menjamin masing-masing $set diterapkan pada dokumen yang
// sama secara konsisten (arrayFilters dalam satu UpdateOne call).
func (r *AcademicYearRepository) SetCurrentSemester(ctx context.Context, academicYearID primitive.ObjectID, semesterName model.SemesterName) error {
	now := time.Now()

	// Langkah 1: unset is_current di semua elemen array semesters.
	_, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": academicYearID, "is_active": true},
		bson.M{"$set": bson.M{"semesters.$[].is_current": false, "updatedAt": now}},
	)
	if err != nil {
		return err
	}

	// Langkah 2: set is_current=true pada elemen dengan name yang cocok.
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": academicYearID, "is_active": true, "semesters.name": semesterName},
		bson.M{"$set": bson.M{"semesters.$.is_current": true, "updatedAt": now}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrSemesterNotFound
	}
	return nil
}

func (r *AcademicYearRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "is_current": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAcademicYearNotFound
	}
	return nil
}

// EnsureIndexes: name unique (mis. tidak boleh ada dua "2025/2026").
func (r *AcademicYearRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "name", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}