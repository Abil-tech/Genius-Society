package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
)

type PublicLandingHandler struct {
	repo *repository.LandingContentRepository
}

func NewPublicLandingHandler(repo *repository.LandingContentRepository) *PublicLandingHandler {
	return &PublicLandingHandler{repo: repo}
}

// GetLandingContent handles GET /api/public/landing-content.
// This route must NOT sit behind AuthMiddleware — register it in a route
// group separate from authenticated routes (see routes wiring snippet).
func (h *PublicLandingHandler) GetLandingContent(c *gin.Context) {
	content, err := h.repo.Get(c.Request.Context())

	if err == mongo.ErrNoDocuments {
		// This should not happen if EnsureSeeded ran at startup, but we
		// guard it anyway: a public endpoint must never 500 just because
		// seeding hasn't happened yet in a fresh environment.
		log.Println("[landing] WARNING: landing_content has no document — was EnsureSeeded run at startup?")
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "CONTENT_NOT_SEEDED",
				"message": "Landing content is not yet available",
			},
		})
		return
	}

	if err != nil {
		log.Printf("[landing] failed to fetch landing content: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to fetch landing content",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    content,
	})
}