package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/middleware"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type GuruHandler struct {
	dashboardService *service.DashboardService
}

func NewGuruHandler(dashboardService *service.DashboardService) *GuruHandler {
	return &GuruHandler{dashboardService: dashboardService}
}

func (h *GuruHandler) GetDashboard(c *gin.Context) {
	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}
	claims := claimsVal.(*service.Claims)

	data, err := h.dashboardService.GetGuruDashboard(c.Request.Context(), claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data dashboard guru"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}

func (h *GuruHandler) GetAssignments(c *gin.Context) {
	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}
	claims := claimsVal.(*service.Claims)

	classID := c.Query("classId")
	data, err := h.dashboardService.GetGuruAssignments(c.Request.Context(), claims.UserID, classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data tugas guru"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}
