package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	dashboardService *service.DashboardService
}

// NewAdminHandler: SIGNATURE BERUBAH — sebelumnya NewAdminHandler() tanpa
// parameter. Semua pemanggil (main.go) WAJIB di-update untuk mengoper
// *service.DashboardService.
func NewAdminHandler(dashboardService *service.DashboardService) *AdminHandler {
	return &AdminHandler{dashboardService: dashboardService}
}

// GetDashboard: khusus role Admin. Sekarang mengambil data ASLI lewat
// DashboardService (bukan placeholder hardcoded lagi).
func (h *AdminHandler) GetDashboard(c *gin.Context) {
	data, err := h.dashboardService.GetAdminDashboard(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data dashboard"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}