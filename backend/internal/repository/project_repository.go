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

var ErrProjectNotFound = errors.New("project not found")

type ProjectRepository struct {
	collection *mongo.Collection
}

func NewProjectRepository(db *mongo.Database) *ProjectRepository {
	return &ProjectRepository{collection: db.Collection("projects")}
}

func (r *ProjectRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Project, error) {
	var p model.Project
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&p)
	if err == mongo.ErrNoDocuments {
		return nil, ErrProjectNotFound
	}
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProjectRepository) FindByClass(ctx context.Context, classID primitive.ObjectID) ([]model.Project, error) {
	opts := options.Find().SetSort(bson.D{{Key: "deadline", Value: 1}})
	cursor, err := r.collection.Find(ctx, bson.M{"class_id": classID, "is_active": true}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var projects []model.Project
	if err := cursor.All(ctx, &projects); err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *ProjectRepository) FindByTeacher(ctx context.Context, teacherID primitive.ObjectID) ([]model.Project, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"teacher_id": teacherID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var projects []model.Project
	if err := cursor.All(ctx, &projects); err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *ProjectRepository) Create(ctx context.Context, p *model.Project) error {
	now := time.Now()
	p.IsActive = true
	p.CreatedAt = now
	p.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, p)
	if err != nil {
		return err
	}
	p.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *ProjectRepository) Update(ctx context.Context, id primitive.ObjectID, title, description, instructions string, deadline time.Time) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"title":        title,
			"description":  description,
			"instructions": instructions,
			"deadline":     deadline,
			"updatedAt":    time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrProjectNotFound
	}
	return nil
}

func (r *ProjectRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrProjectNotFound
	}
	return nil
}

func (r *ProjectRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "class_id", Value: 1}}},
		{Keys: bson.D{{Key: "teacher_id", Value: 1}}},
	})
	return err
}