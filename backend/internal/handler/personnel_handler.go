package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type PersonnelHandler struct {
	service *service.PersonnelService
}

func NewPersonnelHandler(service *service.PersonnelService) *PersonnelHandler {
	return &PersonnelHandler{service: service}
}

// GetPersonnel menangani GET /api/admin/personnel.
//
// ASUMSI: saya belum melihat definisi dto.ErrorResponse Anda yang
// sebenarnya (cuma tahu dari catatan sebelumnya field-nya "message").
// Kalau struct aslinya beda (nama field lain, ada field tambahan seperti
// "code"), sesuaikan baris c.JSON error di bawah.
//
// BELUM DIPASANG ke router manapun — tambahkan ke grup route admin Anda,
// mis.:
//   adminGroup.GET("/personnel", personnelHandler.GetPersonnel)
// di dalam grup yang sudah dilindungi middleware auth + RequireRole
// (admin/super_admin), konsisten dengan route admin lain yang sudah ada.
func (h *PersonnelHandler) GetPersonnel(c *gin.Context) {
	data, err := h.service.GetPersonnelPage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data guru & staf"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}