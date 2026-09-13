package repository

import (
	"context"
	"errors"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrUserNotFound = errors.New("user not found")

type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) *UserRepository {
	return &UserRepository{collection: db.Collection("users")}
}

// FindByEmail dipakai untuk pencarian umum (mis. cek duplikat saat create),
// BUKAN untuk login non-admin lagi (login non-admin sekarang pakai
// FindByUsername). Difilter is_active=true — user yang sudah dinonaktifkan
// tidak boleh ketemu lewat pencarian normal.
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	err := r.collection.FindOne(ctx, bson.M{"email": email, "is_active": true}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByAdminID dipakai untuk login admin/super_admin.
// FIX: sebelumnya tidak filter is_active — admin yang sudah dinonaktifkan
// tetap bisa lolos lookup ini dan berpotensi login. Sekarang difilter.
func (r *UserRepository) FindByAdminID(ctx context.Context, adminID string) (*model.User, error) {
	var user model.User
	err := r.collection.FindOne(ctx, bson.M{"admin_id": adminID, "is_active": true}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByUsername dipakai untuk login non-admin (guru, kurikulum,
// kepala_sekolah via GS-XXX-###; murid via NISN).
func (r *UserRepository) FindByUsername(ctx context.Context, username string) (*model.User, error) {
	var user model.User
	err := r.collection.FindOne(ctx, bson.M{"username": username, "is_active": true}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateUsername mengubah Username user (dipakai khusus untuk edit NISN
// murid). Pemanggil WAJIB memvalidasi bahwa role pelaku perubahan adalah
// admin/super_admin SEBELUM memanggil method ini — repository tidak tahu
// dan tidak mengecek siapa yang memanggil.
func (r *UserRepository) UpdateUsername(ctx context.Context, userID interface{}, newUsername string) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": userID, "is_active": true},
		bson.M{"$set": bson.M{"username": newUsername, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrUserNotFound
	}
	return nil
}

// EnsureIndexes: email unique untuk semua user; admin_id unique+sparse
// (hanya berlaku pada dokumen yang punya field admin_id); username
// unique+sparse dengan alasan yang sama (hanya user non-admin yang punya
// field ini).
func (r *UserRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{Key: "admin_id", Value: 1}},
			Options: options.Index().SetUnique(true).SetSparse(true),
		},
		{
			Keys:    bson.D{{Key: "username", Value: 1}},
			Options: options.Index().SetUnique(true).SetSparse(true),
		},
	})
	return err
}

// EnsureDevSeed membuat satu Super Admin dev jika collection users kosong.
// HANYA untuk development.
func (r *UserRepository) EnsureDevSeed(ctx context.Context, passwordHash string) error {
	count, err := r.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	now := time.Now()
	adminID := "ADM-000001"
	_, err = r.collection.InsertOne(ctx, model.User{
		Name:         "Super Admin Dev",
		Email:        "superadmin@dev.local",
		PasswordHash: passwordHash,
		Role:         model.RoleSuperAdmin,
		IsActive:     true,
		AdminID:      &adminID,
		CreatedAt:    now,
		UpdatedAt:    now,
	})
	return err
}