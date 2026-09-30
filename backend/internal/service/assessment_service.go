package service

import (
	"context"
	"errors"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
	"go.mongodb.org/mongo-driver/v2/bson"
)

var (
	ErrUnauthorized = errors.New("unauthorized to modify this assessment")
	ErrInvalidDates = errors.New("start_date must be before end_date")
	ErrInvalidWeight = errors.New("total weight must equal 100")
)

// AssessmentServiceGuru handles business logic untuk guru manage assessment
type AssessmentServiceGuru struct {
	assessmentRepo         *repository.AssessmentRepository
	assessmentQuestionRepo *repository.AssessmentQuestionRepository
	assessmentAnswerRepo   *repository.AssessmentAnswerRepository
	assessmentAttemptRepo  *repository.AssessmentAttemptRepository
	classRepo              *repository.ClassRepository
	subjectRepo            *repository.SubjectRepository
	teacherRepo            *repository.TeacherRepository
}

func NewAssessmentServiceGuru(
	assessmentRepo *repository.AssessmentRepository,
	assessmentQuestionRepo *repository.AssessmentQuestionRepository,
	assessmentAnswerRepo *repository.AssessmentAnswerRepository,
	assessmentAttemptRepo *repository.AssessmentAttemptRepository,
	classRepo *repository.ClassRepository,
	subjectRepo *repository.SubjectRepository,
	teacherRepo *repository.TeacherRepository,
) *AssessmentServiceGuru {
	return &AssessmentServiceGuru{
		assessmentRepo:         assessmentRepo,
		assessmentQuestionRepo: assessmentQuestionRepo,
		assessmentAnswerRepo:   assessmentAnswerRepo,
		assessmentAttemptRepo:  assessmentAttemptRepo,
		classRepo:              classRepo,
		subjectRepo:            subjectRepo,
		teacherRepo:            teacherRepo,
	}
}

// ==================== GURU VIEW ASSESSMENTS ====================

// GetTeacherAssessments: guru lihat semua assessment yang dibuat
func (s *AssessmentServiceGuru) GetTeacherAssessments(ctx context.Context, teacherID bson.ObjectID) ([]model.Assessment, error) {
	return s.assessmentRepo.FindByTeacher(ctx, teacherID)
}

// GetTeacherAssessmentsForClass: guru lihat assessment untuk kelas spesifik
func (s *AssessmentServiceGuru) GetTeacherAssessmentsForClass(ctx context.Context, teacherID, classID bson.ObjectID) ([]model.Assessment, error) {
	// Validasi teacher authorized untuk kelas ini
	// TODO: implement logic checking teacher class authorization
	return s.assessmentRepo.FindByTeacherAndClass(ctx, teacherID, classID)
}

// GetAssessmentDetail: guru lihat detail assessment + soal-soal
func (s *AssessmentServiceGuru) GetAssessmentDetail(ctx context.Context, assessmentID bson.ObjectID, teacherID bson.ObjectID) (*model.Assessment, []model.AssessmentQuestion, error) {
	assessment, err := s.assessmentRepo.FindByID(ctx, assessmentID)
	if err != nil {
		return nil, nil, err
	}

	// Validasi ownership
	if assessment.TeacherID != teacherID {
		return nil, nil, ErrUnauthorized
	}

	questions, err := s.assessmentQuestionRepo.FindByAssessment(ctx, assessmentID)
	if err != nil {
		return nil, nil, err
	}

	return assessment, questions, nil
}

// ==================== GURU CREATE ASSESSMENT ====================

// CreateAssessment: guru membuat assessment baru
func (s *AssessmentServiceGuru) CreateAssessment(ctx context.Context, req *dto.CreateAssessmentRequest, teacherID bson.ObjectID) (*model.Assessment, error) {
	// Validasi
	if req.StartDate.After(req.EndDate) {
		return nil, ErrInvalidDates
	}

	// Validasi teacher authorized untuk subject & class
	// TODO: implement logic checking teacher class authorization
	classAuthorized := true
	if !classAuthorized {
		return nil, ErrUnauthorized
	}

	assessment := &model.Assessment{
		Title:                  req.Title,
		Description:            req.Description,
		TeacherID:              teacherID,
		SubjectID:              req.SubjectID,
		ClassID:                req.ClassID,
		AcademicYearID:         req.AcademicYearID,
		StartDate:              req.StartDate,
		EndDate:                req.EndDate,
		DurationMinutes:        req.DurationMinutes,
		QuestionCount:          0, // Akan diupdate saat soal ditambah
		TotalWeight:            0, // Akan diupdate saat soal ditambah
		Category:               req.Category, // "harian", "uts", "uas"
		MaxAttempts:            1,            // Default 1 attempt
		ShowResultsImmediately: req.ShowResultsImmediately,
	}

	if err := s.assessmentRepo.Create(ctx, assessment); err != nil {
		return nil, err
	}

	return assessment, nil
}

// ==================== GURU EDIT ASSESSMENT ====================

// UpdateAssessment: guru edit metadata assessment (bukan soal)
func (s *AssessmentServiceGuru) UpdateAssessment(ctx context.Context, assessmentID bson.ObjectID, req *dto.UpdateAssessmentRequest, teacherID bson.ObjectID) error {
	// Cek ownership
	assessment, err := s.assessmentRepo.FindByID(ctx, assessmentID)
	if err != nil {
		return err
	}
	if assessment.TeacherID != teacherID {
		return ErrUnauthorized
	}

	// Validasi dates
	if req.StartDate.After(req.EndDate) {
		return ErrInvalidDates
	}

	return s.assessmentRepo.Update(ctx, assessmentID, req.Title, req.Description, req.StartDate, req.EndDate, req.DurationMinutes, req.MaxAttempts, req.ShowResultsImmediately)
}

// DeleteAssessment: guru hapus assessment
// HANYA bisa hapus jika belum ada student yang submit
func (s *AssessmentServiceGuru) DeleteAssessment(ctx context.Context, assessmentID bson.ObjectID, teacherID bson.ObjectID) error {
	// Cek ownership
	assessment, err := s.assessmentRepo.FindByID(ctx, assessmentID)
	if err != nil {
		return err
	}
	if assessment.TeacherID != teacherID {
		return ErrUnauthorized
	}

	// TODO: Check if ada submission sudah exist
	// Kalau ada, return error "Cannot delete assessment yang sudah ada submission"

	return s.assessmentRepo.SoftDelete(ctx, assessmentID)
}

// ==================== GURU ADD SOAL ====================

// AddQuestion: guru tambah soal baru ke assessment
func (s *AssessmentServiceGuru) AddQuestion(ctx context.Context, assessmentID bson.ObjectID, req *dto.AddQuestionRequest, teacherID bson.ObjectID) (*model.AssessmentQuestion, error) {
	// Cek ownership
	assessment, err := s.assessmentRepo.FindByID(ctx, assessmentID)
	if err != nil {
		return nil, err
	}
	if assessment.TeacherID != teacherID {
		return nil, ErrUnauthorized
	}

	// Validasi weight
	// TODO: Fetch existing questions, sum their weight, check total <= 100

	question := &model.AssessmentQuestion{
		AssessmentID: assessmentID,
		Text:         req.QuestionText,
		Type:         model.QuestionType(req.QuestionType), // "multiple_choice" atau "essay"
		Weight:       req.Weight,
		Order:        req.Order,
	}

	if req.QuestionType == "multiple_choice" {
		question.Options = req.Options
		question.CorrectOptionIndex = &req.CorrectOptionIndex
	}

	if err := s.assessmentQuestionRepo.Create(ctx, question); err != nil {
		return nil, err
	}

	// Update assessment question count & total weight
	// TODO: Recalculate dan update assessment.question_count & total_weight

	return question, nil
}

// UpdateQuestion: guru edit soal yang sudah ada
func (s *AssessmentServiceGuru) UpdateQuestion(ctx context.Context, assessmentID, questionID bson.ObjectID, req *dto.UpdateQuestionRequest, teacherID bson.ObjectID) error {
	// Cek ownership assessment
	assessment, err := s.assessmentRepo.FindByID(ctx, assessmentID)
	if err != nil {
		return err
	}
	if assessment.TeacherID != teacherID {
		return ErrUnauthorized
	}

	question := &model.AssessmentQuestion{
		ID:     questionID,
		Text:   req.QuestionText,
		Weight: req.Weight,
		Order:  req.Order,
	}
	if len(req.Options) > 0 {
		question.Options = req.Options
		question.CorrectOptionIndex = &req.CorrectOptionIndex
	}

	return s.assessmentQuestionRepo.Update(ctx, questionID, question)
}

// DeleteQuestion: guru hapus soal
func (s *AssessmentServiceGuru) DeleteQuestion(ctx context.Context, assessmentID, questionID bson.ObjectID, teacherID bson.ObjectID) error {
	// Cek ownership assessment
	assessment, err := s.assessmentRepo.FindByID(ctx, assessmentID)
	if err != nil {
		return err
	}
	if assessment.TeacherID != teacherID {
		return ErrUnauthorized
	}

	return s.assessmentQuestionRepo.SoftDelete(ctx, questionID)
}

// ==================== GURU GRADE ESSAY ====================

// GetAssignmentAttemptToGrade: guru lihat attempt siswa yang perlu dinilai essay
func (s *AssessmentServiceGuru) GetAssessmentAttemptsToGrade(ctx context.Context, assessmentID bson.ObjectID, teacherID bson.ObjectID) ([]model.AssessmentAttempt, error) {
	// Cek ownership
	assessment, err := s.assessmentRepo.FindByID(ctx, assessmentID)
	if err != nil {
		return nil, err
	}
	if assessment.TeacherID != teacherID {
		return nil, ErrUnauthorized
	}

	// Cari attempt yang belum fully graded & sudah submit
	attempts, err := s.assessmentAttemptRepo.FindByAssessment(ctx, assessmentID)
	if err != nil {
		return nil, err
	}

	// Filter: hanya yang belum fully graded & sudah submit
	var toGrade []model.AssessmentAttempt
	for _, a := range attempts {
		if !a.IsFullyGraded && a.SubmittedAt != nil {
			toGrade = append(toGrade, a)
		}
	}

	return toGrade, nil
}

// GradeEssayAnswer: guru input nilai untuk satu jawaban essay
func (s *AssessmentServiceGuru) GradeEssayAnswer(ctx context.Context, answerID bson.ObjectID, score float64, feedback string, teacherID bson.ObjectID) error {
	// Update answer
	return s.assessmentAnswerRepo.GradeEssayAnswer(ctx, answerID, score, feedback)
}

// CompleteGradingAttempt: guru selesai menilai semua essay untuk satu attempt
// Calculate: manual_score = sum of essay_scores, final_score = auto_score + manual_score
func (s *AssessmentServiceGuru) CompleteGradingAttempt(ctx context.Context, attemptID bson.ObjectID, teacherID bson.ObjectID) error {
	attempt, err := s.assessmentAttemptRepo.FindByID(ctx, attemptID)
	if err != nil {
		return err
	}

	// TODO: Validasi teacher ownership via assessment_id

	// Fetch semua essay answers untuk attempt ini
	answers, err := s.assessmentAnswerRepo.FindByAttempt(ctx, attemptID)
	if err != nil {
		return err
	}

	// Calculate manual score (sum essay grades yang sudah input)
	var manualScore float64
	for _, ans := range answers {
		if ans.IsCorrect == nil && ans.ScoreAwarded != nil {
			manualScore += *ans.ScoreAwarded
		}
	}

	// Final score = auto_score + manual_score
	finalScore := attempt.AutoScore + manualScore

	// Update attempt: is_fully_graded=true, graded_by_teacher_id=teacherID, manual_score, final_score
	return s.assessmentAttemptRepo.CompleteManualGrading(ctx, attemptID, manualScore, finalScore)
}
