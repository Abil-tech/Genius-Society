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

var ErrStudentNotFound = errors.New("student not found")

type StudentRepository struct {
	collection *mongo.Collection
}

func NewStudentRepository(db *mongo.Database) *StudentRepository {
	return &StudentRepository{collection: db.Collection("students")}
}

func (r *StudentRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Student, error) {
	var student model.Student
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&student)
	if err == mongo.ErrNoDocuments {
		return nil, ErrStudentNotFound
	}
	if err != nil {
		return nil, err
	}
	return &student, nil
}

// FindByUserID mengambil profil student berdasarkan reference ke users._id.
func (r *StudentRepository) FindByUserID(ctx context.Context, userID primitive.ObjectID) (*model.Student, error) {
	var student model.Student
	err := r.collection.FindOne(ctx, bson.M{"user_id": userID, "is_active": true}).Decode(&student)
	if err == mongo.ErrNoDocuments {
		return nil, ErrStudentNotFound
	}
	if err != nil {
		return nil, err
	}
	return &student, nil
}

// Create membuat profil student baru. Pemanggil WAJIB memastikan
// UserID merujuk ke user dengan Role=RoleMurid — validasi ini dilakukan di
// service layer (repository tidak bisa JOIN/validasi cross-collection).
func (r *StudentRepository) Create(ctx context.Context, student *model.Student) error {
	now := time.Now()
	student.IsActive = true
	student.CreatedAt = now
	student.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, student)
	if err != nil {
		return err
	}
	student.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *StudentRepository) Update(ctx context.Context, id primitive.ObjectID, dateOfBirth time.Time, gender model.Gender) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"date_of_birth": dateOfBirth,
			"gender":        gender,
			"updatedAt":     time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrStudentNotFound
	}
	return nil
}

func (r *StudentRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrStudentNotFound
	}
	return nil
}

// EnsureIndexes: user_id unique — satu user hanya boleh punya SATU profil
// student (relasi 1:1 dengan users).
func (r *StudentRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "user_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}