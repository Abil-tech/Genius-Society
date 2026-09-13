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

var ErrNotificationNotFound = errors.New("notification not found")

type NotificationRepository struct {
	collection *mongo.Collection
}

func NewNotificationRepository(db *mongo.Database) *NotificationRepository {
	return &NotificationRepository{collection: db.Collection("notifications")}
}

// FindByUser: daftar notifikasi milik satu user, terbaru dulu.
func (r *NotificationRepository) FindByUser(ctx context.Context, userID primitive.ObjectID, onlyUnread bool) ([]model.Notification, error) {
	filter := bson.M{"user_id": userID, "is_active": true}
	if onlyUnread {
		filter["is_read"] = false
	}
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var notifications []model.Notification
	if err := cursor.All(ctx, &notifications); err != nil {
		return nil, err
	}
	return notifications, nil
}

// CountUnread: dipakai untuk badge jumlah notifikasi belum dibaca.
func (r *NotificationRepository) CountUnread(ctx context.Context, userID primitive.ObjectID) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{
		"user_id":   userID,
		"is_read":   false,
		"is_active": true,
	})
}

// Create membuat SATU notifikasi untuk SATU user. Untuk mengirim ke banyak
// user sekaligus (mis. pengumuman ke satu kelas), service layer memanggil
// ini berulang kali (satu dokumen per penerima) — lihat catatan di
// model.Notification.
func (r *NotificationRepository) Create(ctx context.Context, n *model.Notification) error {
	now := time.Now()
	n.IsRead = false
	n.IsActive = true
	n.CreatedAt = now
	n.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, n)
	if err != nil {
		return err
	}
	n.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

// MarkAsRead: tandai satu notifikasi sebagai sudah dibaca. Idempotent —
// memanggil ini pada notifikasi yang sudah IsRead=true tidak error, cuma
// tidak mengubah apa-apa secara efektif (ReadAt tidak diperbarui lagi).
func (r *NotificationRepository) MarkAsRead(ctx context.Context, id, userID primitive.ObjectID) error {
	now := time.Now()
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "user_id": userID, "is_active": true, "is_read": false},
		bson.M{"$set": bson.M{"is_read": true, "read_at": now, "updatedAt": now}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		// Bisa berarti: id tidak ada, bukan milik user ini, atau memang
		// sudah IsRead=true sebelumnya. Pemanggil (service layer) yang
		// perlu bedakan "sudah dibaca" vs "benar-benar tidak ditemukan"
		// kalau itu penting bagi UX (mis. tidak perlu tampilkan error ke
		// user untuk kasus "sudah dibaca").
		return ErrNotificationNotFound
	}
	return nil
}

// MarkAllAsRead: tandai SEMUA notifikasi milik user ini sebagai dibaca
// sekaligus.
func (r *NotificationRepository) MarkAllAsRead(ctx context.Context, userID primitive.ObjectID) error {
	now := time.Now()
	_, err := r.collection.UpdateMany(ctx,
		bson.M{"user_id": userID, "is_active": true, "is_read": false},
		bson.M{"$set": bson.M{"is_read": true, "read_at": now, "updatedAt": now}},
	)
	return err
}

func (r *NotificationRepository) SoftDelete(ctx context.Context, id, userID primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "user_id": userID, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrNotificationNotFound
	}
	return nil
}

// EnsureIndexes: (user_id, is_read) untuk mempercepat FindByUser(onlyUnread)
// dan CountUnread — dua query yang paling sering dipanggil (badge & list).
func (r *NotificationRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "user_id", Value: 1}, {Key: "is_read", Value: 1}}},
		{Keys: bson.D{{Key: "user_id", Value: 1}, {Key: "createdAt", Value: -1}}},
	})
	return err
}
