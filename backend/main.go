package main

import (
	"context"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"github.com/Abil-tech/Genius-Society/backend/internal/config"
	"github.com/Abil-tech/Genius-Society/backend/internal/handler"
	"github.com/Abil-tech/Genius-Society/backend/internal/middleware"
	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
	"github.com/Abil-tech/Genius-Society/backend/internal/seed"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
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
	userRepo := repository.NewUserRepository(mongoClient.Database)
	classRepo := repository.NewClassRepository(mongoClient.Database)
	subjectRepo := repository.NewSubjectRepository(mongoClient.Database)
	academicYearRepo := repository.NewAcademicYearRepository(mongoClient.Database)
	teacherRepo := repository.NewTeacherRepository(mongoClient.Database)
	teacherSubjectRepo := repository.NewTeacherSubjectRepository(mongoClient.Database)
	teacherClassRepo := repository.NewTeacherClassRepository(mongoClient.Database)

	// Seed default landing content ONCE at startup if collection is empty.
	if err := landingRepo.EnsureSeeded(context.Background(), repository.DefaultLandingContent()); err != nil {
		log.Fatalf("failed to seed landing content: %v", err)
	}

	// Unique index untuk semua collection yang dipakai seed/fitur di bawah
	// — WAJIB dipanggil sebelum insert apa pun. Cuma SEKALI per repository
	// (sebelumnya userRepo.EnsureIndexes ke-panggil dobel akibat copy-paste).
	for _, ensureIdx := range []func(context.Context) error{
		userRepo.EnsureIndexes,
		classRepo.EnsureIndexes,
		subjectRepo.EnsureIndexes,
		academicYearRepo.EnsureIndexes,
		teacherRepo.EnsureIndexes,
		teacherSubjectRepo.EnsureIndexes,
		teacherClassRepo.EnsureIndexes,
	} {
		if err := ensureIdx(context.Background()); err != nil {
			log.Fatalf("failed to create indexes: %v", err)
		}
	}

	// Dev-only seed: Super Admin + 1 guru contoh + 1 admin contoh. Guard
	// dengan APP_ENV supaya tidak pernah jalan di production. HANYA SATU
	// blok (sebelumnya ada blok nested duplikat akibat copy-paste, yang
	// menyebabkan SeedSampleAdmin tidak pernah sempat ditambahkan).
	if cfg.AppEnv != "production" {
		devHash, err := bcrypt.GenerateFromPassword([]byte("ChangeMe123!"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("failed to hash dev seed password: %v", err)
		}
		if err := userRepo.EnsureDevSeed(context.Background(), string(devHash)); err != nil {
			log.Printf("dev seed warning: %v", err)
		}

		if err := seed.SeedSampleGuru(context.Background(), mongoClient.Database); err != nil {
			log.Printf("seed sample guru warning: %v", err)
		}

		if err := seed.SeedSampleAdmin(context.Background(), mongoClient.Database); err != nil {
			log.Printf("seed sample admin warning: %v", err)
		}
	}

	// --- Service layer ---
	authService := service.NewAuthService(userRepo)
	jwtService := service.NewJWTService(cfg.JWTSecret, cfg.JWTExpiryHours)

	// --- Handler layer ---
	publicLandingHandler := handler.NewPublicLandingHandler(landingRepo)
	authHandler := handler.NewAuthHandler(authService, jwtService, cfg.CookieDomain, cfg.CookieSecure)
	adminHandler := handler.NewAdminHandler()
	superAdminHandler := handler.NewSuperAdminHandler()

	// --- Router ---
	router := gin.Default()

	// CORS: hanya izinkan origin frontend dari CORS_ORIGIN (.env), bukan
	// wildcard "*" — wildcard tidak bisa dipakai bersamaan dengan
	// AllowCredentials, dan auth pakai cookie butuh credentials diizinkan.
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.CORSOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// PUBLIC routes — no auth middleware.
	public := router.Group("/api/public")
	{
		public.GET("/landing-content", publicLandingHandler.GetLandingContent)
	}

	// AUTH routes — login/logout public, /me butuh token valid.
	auth := router.Group("/api/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/admin-login", authHandler.LoginAdmin)
		auth.POST("/logout", authHandler.Logout)
		auth.GET("/me", middleware.AuthRequired(jwtService), authHandler.Me)
	}

	// ADMIN routes — proteksi token + role.
	admin := router.Group("/api/admin")
	admin.Use(
		middleware.AuthRequired(jwtService),
		middleware.RequireRole(model.RoleAdmin),
	)
	{
		admin.GET("/dashboard", adminHandler.GetDashboard)
	}

	// SUPER ADMIN routes — khusus role SuperAdmin, TIDAK termasuk Admin.
	superAdmin := router.Group("/api/super-admin")
	superAdmin.Use(
		middleware.AuthRequired(jwtService),
		middleware.RequireRole(model.RoleSuperAdmin),
	)
	{
		superAdmin.GET("/dashboard", superAdminHandler.GetDashboard)
	}

	// --- Start server ---
	log.Printf("server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}