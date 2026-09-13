package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/gin-gonic/gin"
)

type SuperAdminHandler struct{}

func NewSuperAdminHandler() *SuperAdminHandler {
	return &SuperAdminHandler{}
}

// GetDashboard: khusus role SuperAdmin. Section 13 spec — statistik
// sistem, total user, status sistem, konfigurasi sistem. Super Admin
// TIDAK mendapat akses akademik (section 3) — jangan tambahkan data
// akademik apa pun di sini.
func (h *SuperAdminHandler) GetDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, dto.Success(gin.H{
		"stats": gin.H{
			"totalUsers":    0,
			"systemStatus":  "operational",
		},
	}))
}