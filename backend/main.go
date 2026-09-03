package main

import (
	"context"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/Abil-tech/Genius-Society/backend/internal/config"
	"github.com/Abil-tech/Genius-Society/backend/internal/handler"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
)

func main() {
	// --- Config ---
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	// --- MongoDB connection ---
	mongoClient, err := config.ConnectMongo(cfg)
	if err != nil {
		log.Fatalf("mongodb connection error: %v", err)
	}
	defer mongoClient.Disconnect(context.Background())

	// --- Repository layer ---
	landingRepo := repository.NewLandingContentRepository(mongoClient.Database)

	// Seed default landing content ONCE at startup if collection is empty.
	if err := landingRepo.EnsureSeeded(context.Background(), repository.DefaultLandingContent()); err != nil {
		log.Fatalf("failed to seed landing content: %v", err)
	}

	// --- Handler layer ---
	publicLandingHandler := handler.NewPublicLandingHandler(landingRepo)

	// --- Router ---
	router := gin.Default()

	// CORS: hanya izinkan origin frontend yang ditentukan di CORS_ORIGIN
	// (.env), bukan wildcard "*" — wildcard tidak bisa dipakai bersamaan
	// dengan AllowCredentials, dan nanti auth pakai cookie butuh
	// credentials diizinkan.
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.CORSOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// PUBLIC routes — no auth middleware. Keep this group strictly for
	// endpoints genuinely meant to be unauthenticated.
	public := router.Group("/api/public")
	{
		public.GET("/landing-content", publicLandingHandler.GetLandingContent)
	}

	// AUTHENTICATED routes (login, super-admin, dst) akan ditambahkan di
	// sini setelah auth middleware dibuat — belum diimplementasikan.

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}