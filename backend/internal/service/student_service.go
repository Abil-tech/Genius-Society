package service

import (
	"context"
	"fmt"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"

	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
)

type StudentService struct {
	userRepo         *repository.UserRepository
	studentRepo      *repository.StudentRepository
	classStudentRepo *repository.ClassStudentRepository
	classRepo        *repository.ClassRepository
	academicYearRepo *repository.AcademicYearRepository
}

func NewStudentService(
	userRepo *repository.UserRepository,
	studentRepo *repository.StudentRepository,
	classStudentRepo *repository.ClassStudentRepository,
	classRepo *repository.ClassRepository,
	academicYearRepo *repository.AcademicYearRepository,
) *StudentService {
	return &StudentService{
		userRepo:         userRepo,
		studentRepo:      studentRepo,
		classStudentRepo: classStudentRepo,
		classRepo:        classRepo,
		academicYearRepo: academicYearRepo,
	}
}

func (s *StudentService) GetStudentPage(ctx context.Context) (*dto.StudentPageResponse, error) {
	users, err := s.userRepo.FindByRoles(ctx, []model.Role{model.RoleMurid})
	if err != nil {
		return nil, fmt.Errorf("fetch student users: %w", err)
	}

	currentYear, err := s.academicYearRepo.FindCurrent(ctx)
	if err != nil && err != repository.ErrAcademicYearNotFound {
		return nil, fmt.Errorf("fetch current academic year: %w", err)
	}

	var stats dto.StudentStatsResponse
	stats.Total = int64(len(users))

	allClasses, err := s.classRepo.FindAll(ctx)
	if err == nil {
		stats.TotalClasses = int64(len(allClasses))
	}

	students := make([]dto.StudentResponse, 0, len(users))
	for _, u := range users {
		if u.IsActive {
			stats.Active++
		} else {
			stats.Inactive++
		}

		studentProfile, _ := s.studentRepo.FindByUserID(ctx, u.ID)

		nis := "-"
		nisn := "-"
		if u.Username != nil {
			nisn = *u.Username
			nis = *u.Username
		}

		gender := "L"
		birthPlace := "-"
		birthDate := "-"
		phone := "-"
		address := "-"

		if studentProfile != nil {
			gender = string(studentProfile.Gender)
			if !studentProfile.DateOfBirth.IsZero() {
				birthDate = studentProfile.DateOfBirth.Format("02 January 2006")
			}
		}

		className := "-"
		major := "-"
		grade := 10
		academicYear := "-"
		homeroomTeacher := "-"

		if currentYear != nil {
			academicYear = currentYear.Name
			if studentProfile != nil {
				cs, err := s.classStudentRepo.FindByStudentAndYear(ctx, studentProfile.ID, currentYear.ID)
				if err == nil && cs != nil {
					classObj, err := s.classRepo.FindByID(ctx, cs.ClassID)
					if err == nil && classObj != nil {
						className = classObj.Name
						major = "-"
						switch classObj.GradeLevel {
						case model.GradeX:
							grade = 10
						case model.GradeXI:
							grade = 11
						case model.GradeXII:
							grade = 12
						default:
							grade = 10
						}
						if classObj.WalasID != nil {
							teacherUser, err := s.userRepo.FindByID(ctx, *classObj.WalasID)
							if err == nil && teacherUser != nil {
								homeroomTeacher = teacherUser.Name
							}
						}
					}
				}
			}
		}

		username := "-"
		if u.Username != nil {
			username = *u.Username
		}

		statusStr := "aktif"
		if !u.IsActive {
			statusStr = "nonaktif"
		}

		students = append(students, dto.StudentResponse{
			ID:              u.ID.Hex(),
			Name:            u.Name,
			Email:           u.Email,
			NIS:             nis,
			NISN:            nisn,
			NIK:             "-",
			Gender:          gender,
			BirthPlace:      birthPlace,
			BirthDate:       birthDate,
			Phone:           phone,
			Address:         address,
			ClassName:       className,
			Major:           major,
			Grade:           grade,
			AcademicYear:    academicYear,
			HomeroomTeacher: homeroomTeacher,
			Status:          statusStr,
			Username:        username,
			LastLogin:       "-",
			CreatedAt:       u.CreatedAt.Format("02 January 2006"),
		})
	}

	return &dto.StudentPageResponse{
		Stats:    stats,
		Students: students,
	}, nil
}

func (s *StudentService) CreateStudent(ctx context.Context, req dto.CreateStudentRequest) (*dto.StudentResponse, error) {
	username := req.Username
	if username == "" {
		username = req.NISN
	}
	if username == "" {
		username = req.NIS
	}
	if username == "" {
		username = fmt.Sprintf("STD-%d", time.Now().Unix())
	}

	password := req.Password
	if password == "" {
		password = "password123"
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	user := &model.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(passwordHash),
		Role:         model.RoleMurid,
		Username:     &username,
		IsActive:     req.Status != "nonaktif",
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("create student user: %w", err)
	}

	gender := model.GenderMale
	if req.Gender == "P" {
		gender = model.GenderFemale
	}

	studentProfile := &model.Student{
		UserID:   user.ID,
		Gender:   gender,
		IsActive: req.Status != "nonaktif",
	}
	if err := s.studentRepo.Create(ctx, studentProfile); err != nil {
		return nil, fmt.Errorf("create student profile: %w", err)
	}

	return &dto.StudentResponse{
		ID:              user.ID.Hex(),
		Name:            user.Name,
		Email:           user.Email,
		NIS:             req.NIS,
		NISN:            req.NISN,
		NIK:             req.NIK,
		Gender:          req.Gender,
		BirthPlace:      req.BirthPlace,
		BirthDate:       req.BirthDate,
		Phone:           req.Phone,
		Address:         req.Address,
		ClassName:       req.ClassName,
		Major:           req.Major,
		Grade:           req.Grade,
		AcademicYear:    req.AcademicYear,
		HomeroomTeacher: "-",
		Status:          req.Status,
		Username:        username,
		LastLogin:       "-",
		CreatedAt:       user.CreatedAt.Format("02 January 2006"),
	}, nil
}

func (s *StudentService) UpdateStudent(ctx context.Context, idHex string, req dto.UpdateStudentRequest) (*dto.StudentResponse, error) {
	id, err := bson.ObjectIDFromHex(idHex)
	if err != nil {
		return nil, fmt.Errorf("invalid id: %w", err)
	}

	user, err := s.userRepo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("student not found: %w", err)
	}

	user.Name = req.Name
	user.Email = req.Email
	user.IsActive = req.Status != "nonaktif"
	user.UpdatedAt = time.Now()

	db := s.userRepo.Collection().Database()
	_, err = db.Collection("users").UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"name":      user.Name,
			"email":     user.Email,
			"is_active": user.IsActive,
			"updatedAt": user.UpdatedAt,
		}},
	)
	if err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	return &dto.StudentResponse{
		ID:              user.ID.Hex(),
		Name:            user.Name,
		Email:           user.Email,
		NIS:             req.NIS,
		NISN:            req.NISN,
		NIK:             req.NIK,
		Gender:          req.Gender,
		BirthPlace:      req.BirthPlace,
		BirthDate:       req.BirthDate,
		Phone:           req.Phone,
		Address:         req.Address,
		ClassName:       req.ClassName,
		Major:           req.Major,
		Grade:           req.Grade,
		AcademicYear:    req.AcademicYear,
		HomeroomTeacher: "-",
		Status:          req.Status,
		Username:        req.Username,
		LastLogin:       "-",
		CreatedAt:       user.CreatedAt.Format("02 January 2006"),
	}, nil
}

func (s *StudentService) DeleteStudent(ctx context.Context, idHex string) error {
	id, err := bson.ObjectIDFromHex(idHex)
	if err != nil {
		return fmt.Errorf("invalid id: %w", err)
	}

	db := s.userRepo.Collection().Database()
	res, err := db.Collection("users").UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return repository.ErrUserNotFound
	}

	if studentProfile, err := s.studentRepo.FindByUserID(ctx, id); err == nil {
		_ = s.studentRepo.SoftDelete(ctx, studentProfile.ID)
	}

	return nil
}
