package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/gin-gonic/gin"
)

type AdminHandler struct{}

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{}
}

// GetDashboard: khusus role Admin. Section 13 spec — Admin dashboard
// menampilkan total siswa/guru/kelas/akun + statistik akademik yang
// diizinkan. Angka masih placeholder sampai collection students/
// teachers/classes selesai.
func (h *AdminHandler) GetDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, dto.Success(gin.H{
		"stats": gin.H{
			"totalStudents": 0,
			"totalTeachers": 0,
			"totalClasses":  0,
			"totalAccounts": 0,
		},
	}))
}