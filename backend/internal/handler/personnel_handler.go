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

func (h *PersonnelHandler) CreatePersonnel(c *gin.Context) {
	var req dto.CreatePersonnelRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("Data tidak valid: "+err.Error()))
		return
	}

	res, err := h.service.CreatePersonnel(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal menambahkan guru/staf: "+err.Error()))
		return
	}
	c.JSON(http.StatusCreated, dto.Success(res))
}

func (h *PersonnelHandler) UpdatePersonnel(c *gin.Context) {
	id := c.Param("id")
	var req dto.UpdatePersonnelRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("Data tidak valid: "+err.Error()))
		return
	}

	res, err := h.service.UpdatePersonnel(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memperbarui guru/staf: "+err.Error()))
		return
	}
	c.JSON(http.StatusOK, dto.Success(res))
}

func (h *PersonnelHandler) DeletePersonnel(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.DeletePersonnel(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal menghapus guru/staf: "+err.Error()))
		return
	}
	c.JSON(http.StatusOK, dto.Success(gin.H{"message": "Berhasil menghapus guru/staf"}))
}