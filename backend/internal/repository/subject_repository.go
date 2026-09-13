package repository

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrSubjectNotFound = errors.New("subject not found")

type SubjectRepository struct {
	collection *mongo.Collection
}

func NewSubjectRepository(db *mongo.Database) *SubjectRepository {
	return &SubjectRepository{collection: db.Collection("subjects")}
}

func (r *SubjectRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Subject, error) {
	var subject model.Subject
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&subject)
	if err == mongo.ErrNoDocuments {
		return nil, ErrSubjectNotFound
	}
	if err != nil {
		return nil, err
	}
	return &subject, nil
}

func (r *SubjectRepository) FindByCode(ctx context.Context, code string) (*model.Subject, error) {
	var subject model.Subject
	err := r.collection.FindOne(ctx, bson.M{"code": strings.ToUpper(code), "is_active": true}).Decode(&subject)
	if err == mongo.ErrNoDocuments {
		return nil, ErrSubjectNotFound
	}
	if err != nil {
		return nil, err
	}
	return &subject, nil
}

func (r *SubjectRepository) FindAll(ctx context.Context) ([]model.Subject, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var subjects []model.Subject
	if err := cursor.All(ctx, &subjects); err != nil {
		return nil, err
	}
	return subjects, nil
}

// Create menormalisasi Code ke uppercase sebelum insert.
func (r *SubjectRepository) Create(ctx context.Context, subject *model.Subject) error {
	now := time.Now()
	subject.Code = strings.ToUpper(subject.Code)
	subject.IsActive = true
	subject.CreatedAt = now
	subject.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, subject)
	if err != nil {
		return err
	}
	subject.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *SubjectRepository) Update(ctx context.Context, id primitive.ObjectID, name string, code string) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"name":      name,
			"code":      strings.ToUpper(code),
			"updatedAt": time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrSubjectNotFound
	}
	return nil
}

func (r *SubjectRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrSubjectNotFound
	}
	return nil
}

// EnsureIndexes: code unique (selalu disimpan uppercase, lihat Create/Update).
func (r *SubjectRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "code", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}