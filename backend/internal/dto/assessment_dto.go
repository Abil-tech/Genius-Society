package dto

import (
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// ==================== CREATE ASSESSMENT ====================

type CreateAssessmentRequest struct {
	Title                  string    `json:"title" binding:"required,min=3,max=255"`
	Description            string    `json:"description" binding:"max=2000"`
	SubjectID              bson.ObjectID `json:"subjectId" binding:"required"`
	ClassID                bson.ObjectID `json:"classId" binding:"required"`
	AcademicYearID         bson.ObjectID `json:"academicYearId" binding:"required"`
	StartDate              time.Time `json:"startDate" binding:"required"`
	EndDate                time.Time `json:"endDate" binding:"required"`
	DurationMinutes        int       `json:"durationMinutes" binding:"required,min=5,max=480"` // 5 menit - 8 jam
	Category               string    `json:"category" binding:"required,oneof=harian uts uas"`
	ShowResultsImmediately bool      `json:"showResultsImmediately"`
}

// ==================== UPDATE ASSESSMENT ====================

type UpdateAssessmentRequest struct {
	Title                  string    `json:"title" binding:"required,min=3,max=255"`
	Description            string    `json:"description" binding:"max=2000"`
	StartDate              time.Time `json:"startDate" binding:"required"`
	EndDate                time.Time `json:"endDate" binding:"required"`
	DurationMinutes        int       `json:"durationMinutes" binding:"required,min=5,max=480"`
	MaxAttempts            int       `json:"maxAttempts" binding:"required,min=1,max=5"`
	ShowResultsImmediately bool      `json:"showResultsImmediately"`
}

// ==================== QUESTIONS ====================

type AddQuestionRequest struct {
	QuestionText       string                      `json:"questionText" binding:"required,min=10"`
	QuestionType       string                      `json:"questionType" binding:"required,oneof=multiple_choice essay"`
	Weight             float64                     `json:"weight" binding:"required,gt=0,lte=100"`
	Order              int                         `json:"order" binding:"required,min=1"`
	Options            []model.AssessmentOption    `json:"options,omitempty"`          // Untuk PG saja
	CorrectOptionIndex int                         `json:"correctOptionIndex,omitempty"` // Untuk PG saja
}

type UpdateQuestionRequest struct {
	QuestionText       string                      `json:"questionText" binding:"required,min=10"`
	Weight             float64                     `json:"weight" binding:"required,gt=0,lte=100"`
	Order              int                         `json:"order" binding:"required,min=1"`
	Options            []model.AssessmentOption    `json:"options,omitempty"`
	CorrectOptionIndex int                         `json:"correctOptionIndex,omitempty"`
}

// ==================== GRADING ====================

type GradeEssayAnswerRequest struct {
	Score    float64 `json:"score" binding:"required,min=0,max=100"`
	Feedback string  `json:"feedback" binding:"max=1000"`
}

type CompleteGradingRequest struct {
	// Empty — hanya perlu attemptId dari URL
}

// ==================== RESPONSES ====================

type AssessmentResponse struct {
	ID                     bson.ObjectID `json:"id"`
	Title                  string             `json:"title"`
	Description            string             `json:"description"`
	TeacherID              bson.ObjectID `json:"teacherId"`
	SubjectID              bson.ObjectID `json:"subjectId"`
	ClassID                bson.ObjectID `json:"classId"`
	AcademicYearID         bson.ObjectID `json:"academicYearId"`
	StartDate              time.Time          `json:"startDate"`
	EndDate                time.Time          `json:"endDate"`
	DurationMinutes        int                `json:"durationMinutes"`
	QuestionCount          int                `json:"questionCount"`
	TotalWeight            float64            `json:"totalWeight"`
	Category               string             `json:"category"`
	MaxAttempts            int                `json:"maxAttempts"`
	ShowResultsImmediately bool               `json:"showResultsImmediately"`
	CreatedAt              time.Time          `json:"createdAt"`
	UpdatedAt              time.Time          `json:"updatedAt"`
}

type AssessmentDetailResponse struct {
	Assessment *AssessmentResponse            `json:"assessment"`
	Questions  []AssessmentQuestionResponse   `json:"questions"`
}

type AssessmentQuestionResponse struct {
	ID                 bson.ObjectID        `json:"id"`
	AssessmentID       bson.ObjectID        `json:"assessmentId"`
	QuestionText       string                    `json:"questionText"`
	QuestionType       string                    `json:"questionType"`
	Options            []model.AssessmentOption  `json:"options,omitempty"`
	CorrectOptionIndex int                       `json:"correctOptionIndex,omitempty"`
	Weight             float64                   `json:"weight"`
	Order              int                       `json:"order"`
	CreatedAt          time.Time                 `json:"createdAt"`
}

type AssessmentAttemptResponse struct {
	ID               bson.ObjectID `json:"id"`
	AssessmentID     bson.ObjectID `json:"assessmentId"`
	StudentID        bson.ObjectID `json:"studentId"`
	StudentName      string             `json:"studentName"` // Enriched dari student profile
	AttemptNumber    int                `json:"attemptNumber"`
	StartedAt        time.Time          `json:"startedAt"`
	SubmittedAt      *time.Time         `json:"submittedAt,omitempty"`
	AutoScore        float64            `json:"autoScore"`
	ManualScore      *float64           `json:"manualScore,omitempty"`
	FinalScore       *float64           `json:"finalScore,omitempty"`
	IsFullyGraded    bool               `json:"isFullyGraded"`
	GradedByTeacherID *bson.ObjectID `json:"gradedByTeacherId,omitempty"`
	GradedAt         *time.Time         `json:"gradedAt,omitempty"`
}

type EssayAnswerToGradeResponse struct {
	AnswerID          bson.ObjectID `json:"answerId"`
	QuestionID        bson.ObjectID `json:"questionId"`
	QuestionText      string             `json:"questionText"`
	StudentID         bson.ObjectID `json:"studentId"`
	StudentName       string             `json:"studentName"`
	EssayAnswer       string             `json:"essayAnswer"`
	SubmittedAt       time.Time          `json:"submittedAt"`
	Score             *float64           `json:"score,omitempty"`
	Feedback          string             `json:"feedback,omitempty"`
	EssayGradedBy     *bson.ObjectID `json:"essayGradedBy,omitempty"`
}

// ==================== LIST RESPONSES ====================

type AssessmentListResponse struct {
	Data  []AssessmentResponse `json:"data"`
	Total int64                `json:"total"`
}

type EssayToGradeListResponse struct {
	Data  []EssayAnswerToGradeResponse `json:"data"`
	Total int64                        `json:"total"`
}