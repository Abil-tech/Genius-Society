package handler

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/middleware"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type AssessmentHandlerGuru struct {
	assessmentService *service.AssessmentServiceGuru
}

func NewAssessmentHandlerGuru(assessmentService *service.AssessmentServiceGuru) *AssessmentHandlerGuru {
	return &AssessmentHandlerGuru{assessmentService: assessmentService}
}

// ==================== GET ASSESSMENTS ====================

// GetMyAssessments: guru lihat semua assessment yang dibuat
// GET /api/guru/assessments
func (h *AssessmentHandlerGuru) GetMyAssessments(c *gin.Context) {
	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}

	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}

	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	assessments, err := h.assessmentService.GetTeacherAssessments(c.Request.Context(), tid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error(err.Error()))
		return
	}

	// Transform ke response
	responses := make([]dto.AssessmentResponse, len(assessments))
	for i, a := range assessments {
		responses[i] = dto.AssessmentResponse{
			ID:                     a.ID,
			Title:                  a.Title,
			Description:            a.Description,
			TeacherID:              a.TeacherID,
			SubjectID:              a.SubjectID,
			ClassID:                a.ClassID,
			AcademicYearID:         a.AcademicYearID,
			StartDate:              a.StartDate,
			EndDate:                a.EndDate,
			DurationMinutes:        a.DurationMinutes,
			QuestionCount:          a.QuestionCount,
			TotalWeight:            a.TotalWeight,
			Category:               a.Category,
			MaxAttempts:            a.MaxAttempts,
			ShowResultsImmediately: a.ShowResultsImmediately,
			CreatedAt:              a.CreatedAt,
			UpdatedAt:              a.UpdatedAt,
		}
	}

	c.JSON(http.StatusOK, dto.Success(gin.H{
		"data":  responses,
		"total": len(responses),
	}))
}

// ==================== QUESTION MANAGEMENT ====================

// AddQuestion: guru tambah soal ke assessment
// POST /api/guru/assessments/:id/questions
func (h *AssessmentHandlerGuru) AddQuestion(c *gin.Context) {
	assessmentID, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid assessment id"))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}
	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}
	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	var req dto.AddQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		return
	}

	question, err := h.assessmentService.AddQuestion(c.Request.Context(), assessmentID, &req, tid)
	if err != nil {
		if err.Error() == "unauthorized to modify this assessment" {
			c.JSON(http.StatusForbidden, dto.Error("you don't have access to this assessment"))
		} else {
			c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		}
		return
	}

	var correctIndex int
	if question.CorrectOptionIndex != nil {
		correctIndex = *question.CorrectOptionIndex
	}
	c.JSON(http.StatusCreated, dto.Success(dto.AssessmentQuestionResponse{
		ID:                 question.ID,
		AssessmentID:       question.AssessmentID,
		QuestionText:       question.Text,
		QuestionType:       string(question.Type),
		Options:            question.Options,
		CorrectOptionIndex: correctIndex,
		Weight:             question.Weight,
		Order:              question.Order,
	}))
}

// UpdateQuestion: guru edit soal
// PUT /api/guru/assessments/:id/questions/:qid
func (h *AssessmentHandlerGuru) UpdateQuestion(c *gin.Context) {
	assessmentID, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid assessment id"))
		return
	}
	questionID, err := bson.ObjectIDFromHex(c.Param("qid"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid question id"))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}
	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}
	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	var req dto.UpdateQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		return
	}

	if err := h.assessmentService.UpdateQuestion(c.Request.Context(), assessmentID, questionID, &req, tid); err != nil {
		if err.Error() == "unauthorized to modify this assessment" {
			c.JSON(http.StatusForbidden, dto.Error("you don't have access to this assessment"))
		} else {
			c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		}
		return
	}

	c.JSON(http.StatusOK, dto.Success(gin.H{"message": "question updated"}))
}

// DeleteQuestion: guru hapus soal
// DELETE /api/guru/assessments/:id/questions/:qid
func (h *AssessmentHandlerGuru) DeleteQuestion(c *gin.Context) {
	assessmentID, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid assessment id"))
		return
	}
	questionID, err := bson.ObjectIDFromHex(c.Param("qid"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid question id"))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}
	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}
	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	if err := h.assessmentService.DeleteQuestion(c.Request.Context(), assessmentID, questionID, tid); err != nil {
		if err.Error() == "unauthorized to modify this assessment" {
			c.JSON(http.StatusForbidden, dto.Error("you don't have access to this assessment"))
		} else {
			c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		}
		return
	}

	c.JSON(http.StatusOK, dto.Success(gin.H{"message": "question deleted"}))
}

// GetAssessmentDetail: guru lihat detail assessment + soal
// GET /api/teacher/assessments/:id
func (h *AssessmentHandlerGuru) GetAssessmentDetail(c *gin.Context) {
	assessmentID, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid assessment id"))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}

	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}

	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	assessment, questions, err := h.assessmentService.GetAssessmentDetail(c.Request.Context(), assessmentID, tid)
	if err != nil {
		if err.Error() == "unauthorized to modify this assessment" {
			c.JSON(http.StatusForbidden, dto.Error("you don't have access to this assessment"))
		} else {
			c.JSON(http.StatusInternalServerError, dto.Error(err.Error()))
		}
		return
	}

	// Transform questions
	questionResponses := make([]dto.AssessmentQuestionResponse, len(questions))
	for i, q := range questions {
		var correctIndex int
		if q.CorrectOptionIndex != nil {
			correctIndex = *q.CorrectOptionIndex
		}
		questionResponses[i] = dto.AssessmentQuestionResponse{
			ID:                 q.ID,
			AssessmentID:       q.AssessmentID,
			QuestionText:       q.Text,
			QuestionType:       string(q.Type),
			Options:            q.Options,
			CorrectOptionIndex: correctIndex,
			Weight:             q.Weight,
			Order:              q.Order,
		}
	}

	assessmentResp := dto.AssessmentResponse{
		ID:                     assessment.ID,
		Title:                  assessment.Title,
		Description:            assessment.Description,
		TeacherID:              assessment.TeacherID,
		SubjectID:              assessment.SubjectID,
		ClassID:                assessment.ClassID,
		AcademicYearID:         assessment.AcademicYearID,
		StartDate:              assessment.StartDate,
		EndDate:                assessment.EndDate,
		DurationMinutes:        assessment.DurationMinutes,
		QuestionCount:          assessment.QuestionCount,
		TotalWeight:            assessment.TotalWeight,
		Category:               assessment.Category,
		MaxAttempts:            assessment.MaxAttempts,
		ShowResultsImmediately: assessment.ShowResultsImmediately,
		CreatedAt:              assessment.CreatedAt,
		UpdatedAt:              assessment.UpdatedAt,
	}

	c.JSON(http.StatusOK, dto.Success(dto.AssessmentDetailResponse{
		Assessment: &assessmentResp,
		Questions:  questionResponses,
	}))
}

// ==================== CREATE ASSESSMENT ====================

// CreateAssessment: guru buat assessment baru
// POST /api/teacher/assessments
func (h *AssessmentHandlerGuru) CreateAssessment(c *gin.Context) {
	var req dto.CreateAssessmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}

	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}

	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	assessment, err := h.assessmentService.CreateAssessment(c.Request.Context(), &req, tid)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.Success(dto.AssessmentResponse{
		ID:                     assessment.ID,
		Title:                  assessment.Title,
		Description:            assessment.Description,
		TeacherID:              assessment.TeacherID,
		SubjectID:              assessment.SubjectID,
		ClassID:                assessment.ClassID,
		AcademicYearID:         assessment.AcademicYearID,
		StartDate:              assessment.StartDate,
		EndDate:                assessment.EndDate,
		DurationMinutes:        assessment.DurationMinutes,
		QuestionCount:          assessment.QuestionCount,
		TotalWeight:            assessment.TotalWeight,
		Category:               assessment.Category,
		MaxAttempts:            assessment.MaxAttempts,
		ShowResultsImmediately: assessment.ShowResultsImmediately,
		CreatedAt:              assessment.CreatedAt,
		UpdatedAt:              assessment.UpdatedAt,
	}))
}

// ==================== UPDATE ASSESSMENT ====================

// UpdateAssessment: guru edit metadata assessment
// PUT /api/teacher/assessments/:id
func (h *AssessmentHandlerGuru) UpdateAssessment(c *gin.Context) {
	assessmentID, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid assessment id"))
		return
	}

	var req dto.UpdateAssessmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}

	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}

	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	if err := h.assessmentService.UpdateAssessment(c.Request.Context(), assessmentID, &req, tid); err != nil {
		if err.Error() == "unauthorized to modify this assessment" {
			c.JSON(http.StatusForbidden, dto.Error("you don't have access to this assessment"))
		} else {
			c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		}
		return
	}

	c.JSON(http.StatusOK, dto.Success(gin.H{"message": "assessment updated"}))
}

// ==================== DELETE ASSESSMENT ====================

// DeleteAssessment: guru hapus assessment
// DELETE /api/teacher/assessments/:id
func (h *AssessmentHandlerGuru) DeleteAssessment(c *gin.Context) {
	assessmentID, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid assessment id"))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}

	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}

	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	if err := h.assessmentService.DeleteAssessment(c.Request.Context(), assessmentID, tid); err != nil {
		if err.Error() == "unauthorized to modify this assessment" {
			c.JSON(http.StatusForbidden, dto.Error("you don't have access to this assessment"))
		} else {
			c.JSON(http.StatusBadRequest, dto.Error(err.Error()))
		}
		return
	}

	c.JSON(http.StatusOK, dto.Success(gin.H{"message": "assessment deleted"}))
}

// ==================== GRADING ====================

// GetAttemptsToGrade: guru lihat attempt siswa yang perlu dinilai essay
// GET /api/teacher/assessments/:id/attempts-to-grade
func (h *AssessmentHandlerGuru) GetAttemptsToGrade(c *gin.Context) {
	assessmentID, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid assessment id"))
		return
	}

	claimsVal, exists := c.Get(middleware.UserContextKey)
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.Error("unauthorized"))
		return
	}

	claims, ok := claimsVal.(*service.Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid claims type"))
		return
	}

	tid, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("invalid user_id format"))
		return
	}

	attempts, err := h.assessmentService.GetAssessmentAttemptsToGrade(c.Request.Context(), assessmentID, tid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error(err.Error()))
		return
	}

	// Transform responses
	responses := make([]dto.AssessmentAttemptResponse, len(attempts))
	for i, a := range attempts {
		responses[i] = dto.AssessmentAttemptResponse{
			ID:               a.ID,
			AssessmentID:     a.AssessmentID,
			StudentID:        a.StudentID,
			AttemptNumber:    a.AttemptNumber,
			StartedAt:        a.StartedAt,
			SubmittedAt:      a.SubmittedAt,
			AutoScore:        a.AutoScore,
			ManualScore:      a.ManualScore,
			FinalScore:       a.FinalScore,
			IsFullyGraded:    a.IsFullyGraded,
		}
	}

	c.JSON(http.StatusOK, dto.Success(gin.H{
		"data":  responses,
		"total": len(responses),
	}))
}