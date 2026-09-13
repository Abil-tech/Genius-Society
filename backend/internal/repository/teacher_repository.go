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

var ErrTeacherNotFound = errors.New("teacher not found")

type TeacherRepository struct {
	collection *mongo.Collection
}

func NewTeacherRepository(db *mongo.Database) *TeacherRepository {
	return &TeacherRepository{collection: db.Collection("teachers")}
}

func (r *TeacherRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Teacher, error) {
	var teacher model.Teacher
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&teacher)
	if err == mongo.ErrNoDocuments {
		return nil, ErrTeacherNotFound
	}
	if err != nil {
		return nil, err
	}
	return &teacher, nil
}

// FindByUserID mengambil profil teacher berdasarkan reference ke users._id.
func (r *TeacherRepository) FindByUserID(ctx context.Context, userID primitive.ObjectID) (*model.Teacher, error) {
	var teacher model.Teacher
	err := r.collection.FindOne(ctx, bson.M{"user_id": userID, "is_active": true}).Decode(&teacher)
	if err == mongo.ErrNoDocuments {
		return nil, ErrTeacherNotFound
	}
	if err != nil {
		return nil, err
	}
	return &teacher, nil
}

// Create membuat profil teacher baru. Pemanggil WAJIB memastikan UserID
// merujuk ke user dengan Role=RoleGuru — validasi ini dilakukan di service
// layer (repository tidak bisa JOIN/validasi cross-collection).
func (r *TeacherRepository) Create(ctx context.Context, teacher *model.Teacher) error {
	now := time.Now()
	teacher.IsActive = true
	teacher.CreatedAt = now
	teacher.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, teacher)
	if err != nil {
		return err
	}
	teacher.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

// UpdateNIP mengubah NIP. nip=nil untuk menghapus NIP (mis. status
// kepegawaian berubah).
func (r *TeacherRepository) UpdateNIP(ctx context.Context, id primitive.ObjectID, nip *string) error {
	var update bson.M
	if nip == nil {
		update = bson.M{"$unset": bson.M{"nip": ""}, "$set": bson.M{"updatedAt": time.Now()}}
	} else {
		update = bson.M{"$set": bson.M{"nip": nip, "updatedAt": time.Now()}}
	}
	res, err := r.collection.UpdateOne(ctx, bson.M{"_id": id, "is_active": true}, update)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrTeacherNotFound
	}
	return nil
}

func (r *TeacherRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrTeacherNotFound
	}
	return nil
}

// EnsureIndexes: user_id unique (1:1 dengan users); nip unique+sparse
// (hanya guru PNS yang punya field ini, lihat model.Teacher).
func (r *TeacherRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "user_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{Key: "nip", Value: 1}},
			Options: options.Index().SetUnique(true).SetSparse(true),
		},
	})
	return err
}