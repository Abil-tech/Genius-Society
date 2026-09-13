package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all environment-driven configuration for the backend.
// Fields are grouped by concern.
type Config struct {
	AppEnv string
	Port   string

	MongoURI      string
	MongoDatabase string

	// Auth / cookie — validated below, required as of auth implementation.
	JWTSecret      string
	JWTExpiryHours int
	CookieDomain   string
	CookieSecure   bool
	CORSOrigin     string
}

// LoadConfig reads environment variables (loading a local .env file first
// if present — safe to call in production where no .env file exists,
// godotenv.Load simply no-ops with an ignorable error in that case).
func LoadConfig() (*Config, error) {
	_ = godotenv.Load() // ignored: absent .env is expected in production

	appEnv := getEnv("APP_ENV", "development")

	jwtExpiryHours, err := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	if err != nil || jwtExpiryHours <= 0 {
		return nil, fmt.Errorf("JWT_EXPIRY_HOURS must be a positive integer")
	}

	cfg := &Config{
		AppEnv: appEnv,
		Port:   getEnv("PORT", "8080"),

		MongoURI:      os.Getenv("MONGODB_URI"),
		MongoDatabase: os.Getenv("MONGODB_DATABASE"),

		JWTSecret:      os.Getenv("JWT_SECRET"),
		JWTExpiryHours: jwtExpiryHours,
		CookieDomain:   os.Getenv("COOKIE_DOMAIN"),
		CookieSecure:   appEnv == "production",
		CORSOrigin:     os.Getenv("CORS_ORIGIN"),
	}

	if cfg.MongoURI == "" {
		return nil, fmt.Errorf("MONGODB_URI is required")
	}
	if cfg.MongoDatabase == "" {
		return nil, fmt.Errorf("MONGODB_DATABASE is required")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}
	if cfg.CORSOrigin == "" {
		return nil, fmt.Errorf("CORS_ORIGIN is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}