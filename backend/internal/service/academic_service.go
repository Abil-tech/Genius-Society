package service

import (
	"context"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
)

type AcademicService struct {
	classRepo        *repository.ClassRepository
	subjectRepo      *repository.SubjectRepository
	assignmentRepo   *repository.AssignmentRepository
	userRepo         *repository.UserRepository
	academicYearRepo *repository.AcademicYearRepository
}

func NewAcademicService(
	classRepo *repository.ClassRepository,
	subjectRepo *repository.SubjectRepository,
	assignmentRepo *repository.AssignmentRepository,
	userRepo *repository.UserRepository,
	academicYearRepo *repository.AcademicYearRepository,
) *AcademicService {
	return &AcademicService{
		classRepo:        classRepo,
		subjectRepo:      subjectRepo,
		assignmentRepo:   assignmentRepo,
		userRepo:         userRepo,
		academicYearRepo: academicYearRepo,
	}
}

func (s *AcademicService) GetClassPage(ctx context.Context) (*dto.ClassPageResponse, error) {
	classes, err := s.classRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var res dto.ClassPageResponse
	for _, c := range classes {
		status := "aktif"
		if !c.IsActive {
			status = "nonaktif"
		}

		grade := 10
		if c.GradeLevel == model.GradeXI {
			grade = 11
		} else if c.GradeLevel == model.GradeXII {
			grade = 12
		}

		ayName := "-"
		if c.AcademicYearID.Hex() != "" {
			ay, _ := s.academicYearRepo.FindByID(ctx, c.AcademicYearID)
			if ay != nil {
				ayName = ay.Name
			}
		}

		teacherName := "-"
		if c.WalasID != nil {
			teacherUser, _ := s.userRepo.FindByID(ctx, *c.WalasID)
			if teacherUser != nil {
				teacherName = teacherUser.Name
			}
		}

		res.Classes = append(res.Classes, dto.ClassResponse{
			ID:              c.ID.Hex(),
			Name:            c.Name,
			Grade:           grade,
			Major:           "-", // Disesuaikan nanti jika ada di model
			AcademicYear:    ayName,
			HomeroomTeacher: teacherName,
			Capacity:        c.Capacity,
			Status:          status,
			Students:        []dto.StudentSimple{},
			Subjects:        []dto.SubjectTeacherSimple{},
		})
	}
	if res.Classes == nil {
		res.Classes = []dto.ClassResponse{}
	}

	return &res, nil
}

func (s *AcademicService) GetSubjectPage(ctx context.Context) (*dto.SubjectPageResponse, error) {
	subjects, err := s.subjectRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var res dto.SubjectPageResponse
	for _, sub := range subjects {
		status := "aktif"
		if !sub.IsActive {
			status = "nonaktif"
		}

		res.Subjects = append(res.Subjects, dto.SubjectResponse{
			ID:          sub.ID.Hex(),
			Code:        sub.Code,
			Name:        sub.Name,
			Group:       "Wajib", // Default sementara
			Grades:      []int{10, 11, 12},
			Status:      status,
			Teachers:    []dto.TeacherSimple{},
			Classes:     []dto.ClassSimple{},
			Curriculums: []dto.CurriculumSimple{},
		})
	}
	if res.Subjects == nil {
		res.Subjects = []dto.SubjectResponse{}
	}

	return &res, nil
}

func (s *AcademicService) GetAssignmentPage(ctx context.Context) (*dto.AssignmentPageResponse, error) {
	assignments, err := s.assignmentRepo.FindAll(ctx) // Pastikan FindAll ada di repo, jika tidak buat nanti
	if err != nil {
		// Jika belum implementasi FindAll di repo
		assignments = []model.Assignment{}
	}

	var res dto.AssignmentPageResponse
	now := time.Now()
	for _, a := range assignments {
		status := "berlangsung"
		if !a.IsActive {
			status = "diarsipkan"
		} else if now.After(a.Deadline) {
			status = "selesai"
		}

		teacherName := "-"
		teacherUser, _ := s.userRepo.FindByID(ctx, a.TeacherID)
		if teacherUser != nil {
			teacherName = teacherUser.Name
		}

		subjectName := "-"
		sub, _ := s.subjectRepo.FindByID(ctx, a.SubjectID)
		if sub != nil {
			subjectName = sub.Name
		}

		var classNames []string
		for _, cid := range a.ClassIDs {
			cObj, _ := s.classRepo.FindByID(ctx, cid)
			if cObj != nil {
				classNames = append(classNames, cObj.Name)
			}
		}

		res.Assignments = append(res.Assignments, dto.AssignmentResponse{
			ID:           a.ID.Hex(),
			Title:        a.Title,
			Description:  a.Description,
			Teacher:      teacherName,
			Subject:      subjectName,
			ClassNames:   classNames,
			StartDate:    a.CreatedAt.Format(time.RFC3339),
			Deadline:     a.Deadline.Format(time.RFC3339),
			Status:       status,
			AcademicYear: "2026/2027", // Default, karena assignment tidak nyimpan academic_year langsung
		})
	}
	if res.Assignments == nil {
		res.Assignments = []dto.AssignmentResponse{}
	}

	return &res, nil
}
