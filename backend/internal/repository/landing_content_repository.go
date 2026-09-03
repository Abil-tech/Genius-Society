package repository

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
)

const landingContentCollection = "landing_content"

// LandingContentRepository handles all MongoDB access for the singleton
// landing_content document. There is intentionally only ever one document
// in this collection (queried with an empty filter), since the landing
// page has no concept of "multiple landing pages" today.
type LandingContentRepository struct {
	collection *mongo.Collection
}

func NewLandingContentRepository(db *mongo.Database) *LandingContentRepository {
	return &LandingContentRepository{
		collection: db.Collection(landingContentCollection),
	}
}

// Get fetches the singleton landing content document. Returns
// mongo.ErrNoDocuments if it hasn't been seeded yet — callers must handle
// that case explicitly (see handler), never let it bubble up as a raw 500
// to the public endpoint.
func (r *LandingContentRepository) Get(ctx context.Context) (*model.LandingContent, error) {
	var content model.LandingContent
	err := r.collection.FindOne(ctx, bson.M{}).Decode(&content)
	if err != nil {
		return nil, err
	}
	return &content, nil
}

// EnsureSeeded inserts a default document if none exists yet. Call this
// once at application startup (after ConnectMongo), NOT from the request
// handler — the public GET endpoint should never have side effects.
func (r *LandingContentRepository) EnsureSeeded(ctx context.Context, defaultContent *model.LandingContent) error {
	count, err := r.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return fmt.Errorf("failed to check landing_content existence: %w", err)
	}
	if count > 0 {
		return nil // already seeded, nothing to do
	}

	_, err = r.collection.InsertOne(ctx, defaultContent)
	if err != nil {
		return fmt.Errorf("failed to seed landing_content: %w", err)
	}
	return nil
}