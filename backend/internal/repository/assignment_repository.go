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

var ErrAssignmentNotFound = errors.New("assignment not found")

type AssignmentRepository struct {
	collection *mongo.Collection
}

func NewAssignmentRepository(db *mongo.Database) *AssignmentRepository {
	return &AssignmentRepository{collection: db.Collection("assignments")}
}

func (r *AssignmentRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Assignment, error) {
	var a model.Assignment
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAssignmentNotFound
	}
	if err != nil {
		return nil, err
	}
	return &a, nil
}

// FindByClass: semua tugas untuk satu kelas (dipakai tampilan murid).
func (r *AssignmentRepository) FindByClass(ctx context.Context, classID primitive.ObjectID) ([]model.Assignment, error) {
	opts := options.Find().SetSort(bson.D{{Key: "deadline", Value: 1}})
	cursor, err := r.collection.Find(ctx, bson.M{"class_id": classID, "is_active": true}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var assignments []model.Assignment
	if err := cursor.All(ctx, &assignments); err != nil {
		return nil, err
	}
	return assignments, nil
}

// FindByTeacher: semua tugas yang dibuat guru ini (dipakai tampilan guru).
func (r *AssignmentRepository) FindByTeacher(ctx context.Context, teacherID primitive.ObjectID) ([]model.Assignment, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{"teacher_id": teacherID, "is_active": true}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var assignments []model.Assignment
	if err := cursor.All(ctx, &assignments); err != nil {
		return nil, err
	}
	return assignments, nil
}

func (r *AssignmentRepository) Create(ctx context.Context, a *model.Assignment) error {
	now := time.Now()
	a.IsActive = true
	a.CreatedAt = now
	a.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, a)
	if err != nil {
		return err
	}
	a.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *AssignmentRepository) Update(ctx context.Context, id primitive.ObjectID, title, description string, deadline time.Time) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"title":       title,
			"description": description,
			"deadline":    deadline,
			"updatedAt":   time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssignmentNotFound
	}
	return nil
}

func (r *AssignmentRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssignmentNotFound
	}
	return nil
}

// EnsureIndexes: index pada class_id dan teacher_id untuk mempercepat query
// tampilan murid & guru.
func (r *AssignmentRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "class_id", Value: 1}}},
		{Keys: bson.D{{Key: "teacher_id", Value: 1}}},
	})
	return err
}