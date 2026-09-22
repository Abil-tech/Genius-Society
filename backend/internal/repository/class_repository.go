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

var ErrClassNotFound = errors.New("class not found")

type ClassRepository struct {
	collection *mongo.Collection
}

func NewClassRepository(db *mongo.Database) *ClassRepository {
	return &ClassRepository{collection: db.Collection("classes")}
}

func (r *ClassRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Class, error) {
	var class model.Class
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&class)
	if err == mongo.ErrNoDocuments {
		return nil, ErrClassNotFound
	}
	if err != nil {
		return nil, err
	}
	return &class, nil
}

// FindByAcademicYear mengembalikan semua kelas aktif pada satu tahun ajaran.
func (r *ClassRepository) FindByAcademicYear(ctx context.Context, academicYearID primitive.ObjectID) ([]model.Class, error) {
	cursor, err := r.collection.Find(ctx, bson.M{
		"academic_year_id": academicYearID,
		"is_active":        true,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var classes []model.Class
	if err := cursor.All(ctx, &classes); err != nil {
		return nil, err
	}
	return classes, nil
}

// FindByWalasAndYear mencari kelas yang wali kelasnya adalah teacherUserID
// pada tahun ajaran tertentu. Mengembalikan ErrClassNotFound kalau guru
// ini bukan wali kelas manapun tahun ini — itu kondisi NORMAL (kebanyakan
// guru bukan walas), bukan error yang perlu ditampilkan ke pengguna.
func (r *ClassRepository) FindByWalasAndYear(ctx context.Context, teacherUserID, academicYearID primitive.ObjectID) (*model.Class, error) {
	var class model.Class
	err := r.collection.FindOne(ctx, bson.M{
		"walas_id":         teacherUserID,
		"academic_year_id": academicYearID,
		"is_active":        true,
	}).Decode(&class)
	if err == mongo.ErrNoDocuments {
		return nil, ErrClassNotFound
	}
	if err != nil {
		return nil, err
	}
	return &class, nil
}

func (r *ClassRepository) Create(ctx context.Context, class *model.Class) error {
	now := time.Now()
	class.IsActive = true
	class.CreatedAt = now
	class.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, class)
	if err != nil {
		return err
	}
	class.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

// Update mengubah field yang boleh diubah setelah kelas dibuat: nama,
// tingkat, dan kapasitas. Tidak termasuk academic_year_id (kelas tidak
// dipindah antar tahun ajaran — buat kelas baru untuk tahun ajaran baru).
func (r *ClassRepository) Update(ctx context.Context, id primitive.ObjectID, name string, gradeLevel model.GradeLevel, capacity int) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"name":        name,
			"grade_level": gradeLevel,
			"capacity":    capacity,
			"updatedAt":   time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrClassNotFound
	}
	return nil
}

// SetWalas menetapkan atau mengganti wali kelas. teacherUserID bisa nil
// untuk melepas walas dari kelas ini. Validasi bahwa teacherUserID memang
// ber-role Guru WAJIB dilakukan di service layer sebelum memanggil ini.
func (r *ClassRepository) SetWalas(ctx context.Context, classID primitive.ObjectID, teacherUserID *primitive.ObjectID) error {
	var update bson.M
	if teacherUserID == nil {
		update = bson.M{"$unset": bson.M{"walas_id": ""}, "$set": bson.M{"updatedAt": time.Now()}}
	} else {
		update = bson.M{"$set": bson.M{"walas_id": teacherUserID, "updatedAt": time.Now()}}
	}
	res, err := r.collection.UpdateOne(ctx, bson.M{"_id": classID, "is_active": true}, update)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrClassNotFound
	}
	return nil
}

// SoftDelete menonaktifkan kelas (is_active=false). Tidak menghapus dokumen.
func (r *ClassRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrClassNotFound
	}
	return nil
}

// EnsureIndexes: kombinasi (academic_year_id, name) harus unique agar tidak
// ada dua kelas dengan nama sama pada tahun ajaran yang sama.
func (r *ClassRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "academic_year_id", Value: 1}, {Key: "name", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: bson.D{{Key: "walas_id", Value: 1}, {Key: "academic_year_id", Value: 1}},
		},
	})
	return err
}