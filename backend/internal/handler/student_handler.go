package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type StudentHandler struct {
	service *service.StudentService
}

func NewStudentHandler(service *service.StudentService) *StudentHandler {
	return &StudentHandler{service: service}
}

func (h *StudentHandler) GetStudents(c *gin.Context) {
	data, err := h.service.GetStudentPage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data siswa"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}

func (h *StudentHandler) CreateStudent(c *gin.Context) {
	var req dto.CreateStudentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("Data tidak valid: "+err.Error()))
		return
	}

	res, err := h.service.CreateStudent(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal menambahkan siswa: "+err.Error()))
		return
	}
	c.JSON(http.StatusCreated, dto.Success(res))
}

func (h *StudentHandler) UpdateStudent(c *gin.Context) {
	id := c.Param("id")
	var req dto.UpdateStudentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("Data tidak valid: "+err.Error()))
		return
	}

	res, err := h.service.UpdateStudent(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memperbarui siswa: "+err.Error()))
		return
	}
	c.JSON(http.StatusOK, dto.Success(res))
}

func (h *StudentHandler) DeleteStudent(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.DeleteStudent(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal menghapus siswa: "+err.Error()))
		return
	}
	c.JSON(http.StatusOK, dto.Success(gin.H{"message": "Berhasil menghapus siswa"}))
}
