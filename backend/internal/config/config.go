package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all environment-driven configuration for the backend.
// Fields are grouped by concern. Only Mongo-related fields are validated
// today; JWT/Cookie/R2 fields are declared now (matching .env.example)
// so later steps (auth, R2) don't require touching this struct again,
// but they are NOT validated here yet — validate them when that
// feature is actually implemented, not before.
type Config struct {
	AppEnv string
	Port   string

	MongoURI      string
	MongoDatabase string

	// Not yet implemented — populated for forward compatibility only.
	JWTSecret    string
	CookieDomain string
	CORSOrigin   string
}

// LoadConfig reads environment variables (loading a local .env file first
// if present — safe to call in production where no .env file exists,
// godotenv.Load simply no-ops with an ignorable error in that case).
func LoadConfig() (*Config, error) {
	_ = godotenv.Load() // ignored: absent .env is expected in production

	cfg := &Config{
		AppEnv: getEnv("APP_ENV", "development"),
		Port:   getEnv("PORT", "8080"),

		MongoURI:      os.Getenv("MONGODB_URI"),
		MongoDatabase: os.Getenv("MONGODB_DATABASE"),

		JWTSecret:    os.Getenv("JWT_SECRET"),
		CookieDomain: os.Getenv("COOKIE_DOMAIN"),
		CORSOrigin:   os.Getenv("CORS_ORIGIN"),
	}

	if cfg.MongoURI == "" {
		return nil, fmt.Errorf("MONGODB_URI is required")
	}
	if cfg.MongoDatabase == "" {
		return nil, fmt.Errorf("MONGODB_DATABASE is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}