package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// MongoClient wraps the mongo client and the resolved database handle.
// Kept as a struct (not global vars) so it can be passed via dependency
// injection into repositories, instead of every repository importing
// a package-level singleton directly.
type MongoClient struct {
	Client   *mongo.Client
	Database *mongo.Database
}

// ConnectMongo establishes a connection to MongoDB using MONGODB_URI and
// MONGODB_DATABASE from the loaded Config. It verifies connectivity with
// a Ping before returning, so callers fail fast at startup instead of
// discovering a bad URI on the first request.
func ConnectMongo(cfg *Config) (*MongoClient, error) {
	if cfg.MongoURI == "" {
		return nil, fmt.Errorf("MONGODB_URI is not set")
	}
	if cfg.MongoDatabase == "" {
		return nil, fmt.Errorf("MONGODB_DATABASE is not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOpts := options.Client().ApplyURI(cfg.MongoURI)

	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to mongodb: %w", err)
	}

	pingCtx, pingCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer pingCancel()

	if err := client.Ping(pingCtx, readpref.Primary()); err != nil {
		return nil, fmt.Errorf("failed to ping mongodb: %w", err)
	}

	log.Printf("[mongodb] connected to database %q", cfg.MongoDatabase)

	return &MongoClient{
		Client:   client,
		Database: client.Database(cfg.MongoDatabase),
	}, nil
}

// Disconnect closes the underlying connection. Call this from main.go on
// graceful shutdown (e.g. inside a deferred func or on SIGTERM), not from
// individual request handlers.
func (m *MongoClient) Disconnect(ctx context.Context) error {
	if m == nil || m.Client == nil {
		return nil
	}
	return m.Client.Disconnect(ctx)
}