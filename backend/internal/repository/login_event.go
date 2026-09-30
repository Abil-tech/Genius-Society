package repository

import (
	"context"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type LoginEventRepository struct {
	collection *mongo.Collection
}

func NewLoginEventRepository(db *mongo.Database) *LoginEventRepository {
	return &LoginEventRepository{collection: db.Collection("login_events")}
}

// Record mencatat satu login event. Dipanggil AuthHandler setiap
// issueSession berhasil. PENTING: kegagalan method ini TIDAK BOLEH
// menggagalkan proses login — pemanggil harus treat error sebagai
// non-fatal (log warning, tetap lanjutkan response login).
func (r *LoginEventRepository) Record(ctx context.Context, userID bson.ObjectID, role model.Role) error {
	_, err := r.collection.InsertOne(ctx, model.LoginEvent{
		UserID:    userID,
		Role:      role,
		CreatedAt: time.Now(),
	})
	return err
}

// CountByDay menghitung jumlah login per hari dalam rentang [start, end).
// Key hasil map memakai format "2006-01-02" (tanggal Go) — pemanggil
// mencocokkan sendiri ke label hari (Sen/Sel/dst).
//
// CATATAN PERFORMA: ini fetch semua dokumen dalam rentang lalu hitung di
// Go, bukan aggregation $group — acceptable untuk rentang 7 hari (volume
// kecil), tapi kalau nanti dipakai untuk rentang jauh lebih panjang,
// sebaiknya diganti ke aggregation pipeline MongoDB.
func (r *LoginEventRepository) CountByDay(ctx context.Context, start, end time.Time) (map[string]int, error) {
	cursor, err := r.collection.Find(ctx, bson.M{
		"createdAt": bson.M{"$gte": start, "$lt": end},
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	counts := make(map[string]int)
	for cursor.Next(ctx) {
		var e model.LoginEvent
		if err := cursor.Decode(&e); err != nil {
			return nil, err
		}
		counts[e.CreatedAt.Format("2006-01-02")]++
	}
	return counts, cursor.Err()
}

func (r *LoginEventRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.D{{Key: "createdAt", Value: 1}},
	})
	return err
}
