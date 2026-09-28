package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AcademicHandler struct {
	academicService *service.AcademicService
}

func NewAcademicHandler(academicService *service.AcademicService) *AcademicHandler {
	return &AcademicHandler{academicService: academicService}
}

func (h *AcademicHandler) GetClasses(c *gin.Context) {
	data, err := h.academicService.GetClassPage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data kelas"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}

func (h *AcademicHandler) GetSubjects(c *gin.Context) {
	data, err := h.academicService.GetSubjectPage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data mata pelajaran"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}

func (h *AcademicHandler) GetAssignments(c *gin.Context) {
	data, err := h.academicService.GetAssignmentPage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("Gagal memuat data tugas"))
		return
	}
	c.JSON(http.StatusOK, dto.Success(data))
}
