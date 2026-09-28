package repository

import (
	"context"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SystemEventRepository struct {
	collection *mongo.Collection
}

func NewSystemEventRepository(db *mongo.Database) *SystemEventRepository {
	return &SystemEventRepository{collection: db.Collection("system_events")}
}

// Record mencatat satu system event. Lihat catatan "BELUM DIPANGGIL DARI
// MANA PUN" di model.SystemEvent.
func (r *SystemEventRepository) Record(ctx context.Context, title, description string, tone model.SystemEventTone) error {
	_, err := r.collection.InsertOne(ctx, model.SystemEvent{
		Title:       title,
		Description: description,
		Tone:        tone,
		CreatedAt:   time.Now(),
	})
	return err
}

// FindRecent: N event terbaru untuk feed di dashboard.
func (r *SystemEventRepository) FindRecent(ctx context.Context, limit int64) ([]model.SystemEvent, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}).SetLimit(limit)
	cursor, err := r.collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var events []model.SystemEvent
	if err := cursor.All(ctx, &events); err != nil {
		return nil, err
	}
	return events, nil
}

func (r *SystemEventRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.D{{Key: "createdAt", Value: -1}},
	})
	return err
}