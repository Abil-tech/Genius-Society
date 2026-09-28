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

var ErrMaterialNotFound = errors.New("material not found")

type MaterialRepository struct {
	collection *mongo.Collection
}

func NewMaterialRepository(db *mongo.Database) *MaterialRepository {
	return &MaterialRepository{collection: db.Collection("materials")}
}

// CountActive: jumlah materi yang belum di-soft-delete (TIDAK difilter
// publish_date — "aktif" di sini berarti "belum dihapus", bukan "sudah
// terbit"). Dipakai untuk kartu statistik "Materi Aktif" di dashboard.
func (r *MaterialRepository) CountActive(ctx context.Context) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{"is_active": true})
}

// FindRecentCreated: N materi terbaru yang dibuat, dipakai untuk feed
// activityLog on-the-fly di dashboard Admin.
func (r *MaterialRepository) FindRecentCreated(ctx context.Context, limit int64) ([]model.Material, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}).SetLimit(limit)
	cursor, err := r.collection.Find(ctx, bson.M{"is_active": true}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var materials []model.Material
	if err := cursor.All(ctx, &materials); err != nil {
		return nil, err
	}
	return materials, nil
}

func (r *MaterialRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Material, error) {
	var m model.Material
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&m)
	if err == mongo.ErrNoDocuments {
		return nil, ErrMaterialNotFound
	}
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// FindByClassForStudent: materi yang SUDAH publish untuk suatu kelas.
// Dipakai untuk tampilan murid — filter publish_date<=now WAJIB di sini.
func (r *MaterialRepository) FindByClassForStudent(ctx context.Context, classID primitive.ObjectID) ([]model.Material, error) {
	opts := options.Find().SetSort(bson.D{{Key: "publish_date", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"class_ids":    classID,
		"is_active":    true,
		"publish_date": bson.M{"$lte": time.Now()},
	}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var materials []model.Material
	if err := cursor.All(ctx, &materials); err != nil {
		return nil, err
	}
	return materials, nil
}

// FindByTeacher: SEMUA materi milik guru ini, termasuk draft (publish_date
// di masa depan) — dipakai untuk tampilan guru mengelola materinya sendiri.
func (r *MaterialRepository) FindByTeacher(ctx context.Context, teacherID primitive.ObjectID) ([]model.Material, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"teacher_id": teacherID,
		"is_active":  true,
	}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var materials []model.Material
	if err := cursor.All(ctx, &materials); err != nil {
		return nil, err
	}
	return materials, nil
}

// Create menyimpan materi baru. Pemanggil (service layer) WAJIB memastikan
// minimal salah satu dari File atau Link terisi SEBELUM memanggil ini —
// repository tidak melakukan validasi tersebut.
func (r *MaterialRepository) Create(ctx context.Context, m *model.Material) error {
	now := time.Now()
	m.IsActive = true
	m.CreatedAt = now
	m.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, m)
	if err != nil {
		return err
	}
	m.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

// Update mengubah metadata materi (judul, deskripsi, kelas tujuan, tanggal
// publikasi). Perubahan File/Link SENGAJA tidak lewat method generik ini —
// pemanggil sebaiknya pakai method khusus (mis. UpdateFile) supaya jelas
// kapan replace file lama di R2 harus terjadi (di service layer, dengan
// urutan: upload file baru -> update DB -> hapus file lama di R2).
func (r *MaterialRepository) Update(ctx context.Context, id primitive.ObjectID, title, description string, classIDs []primitive.ObjectID, publishDate time.Time) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"title":        title,
			"description":  description,
			"class_ids":    classIDs,
			"publish_date": publishDate,
			"updatedAt":    time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrMaterialNotFound
	}
	return nil
}

func (r *MaterialRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrMaterialNotFound
	}
	return nil
}

// EnsureIndexes: index pada class_ids (multikey, otomatis karena array) dan
// teacher_id untuk mempercepat query tampilan murid & guru.
func (r *MaterialRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "class_ids", Value: 1}}},
		{Keys: bson.D{{Key: "teacher_id", Value: 1}}},
	})
	return err
}