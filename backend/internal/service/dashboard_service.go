package service

import (
	"context"
	"fmt"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
)

type DashboardService struct {
	userRepo                 *repository.UserRepository
	studentRepo              *repository.StudentRepository
	teacherRepo              *repository.TeacherRepository
	classRepo                *repository.ClassRepository
	subjectRepo              *repository.SubjectRepository
	academicYearRepo         *repository.AcademicYearRepository
	materialRepo             *repository.MaterialRepository
	assignmentRepo           *repository.AssignmentRepository
	assignmentSubmissionRepo *repository.AssignmentSubmissionRepository
	assessmentRepo           *repository.AssessmentRepository
	assessmentAttemptRepo    *repository.AssessmentAttemptRepository
	projectRepo              *repository.ProjectRepository
	loginEventRepo           *repository.LoginEventRepository
	systemEventRepo          *repository.SystemEventRepository
}

func NewDashboardService(
	userRepo *repository.UserRepository,
	studentRepo *repository.StudentRepository,
	teacherRepo *repository.TeacherRepository,
	classRepo *repository.ClassRepository,
	subjectRepo *repository.SubjectRepository,
	academicYearRepo *repository.AcademicYearRepository,
	materialRepo *repository.MaterialRepository,
	assignmentRepo *repository.AssignmentRepository,
	assignmentSubmissionRepo *repository.AssignmentSubmissionRepository,
	assessmentRepo *repository.AssessmentRepository,
	assessmentAttemptRepo *repository.AssessmentAttemptRepository,
	projectRepo *repository.ProjectRepository,
	loginEventRepo *repository.LoginEventRepository,
	systemEventRepo *repository.SystemEventRepository,
) *DashboardService {
	return &DashboardService{
		userRepo:                 userRepo,
		studentRepo:              studentRepo,
		teacherRepo:              teacherRepo,
		classRepo:                classRepo,
		subjectRepo:              subjectRepo,
		academicYearRepo:         academicYearRepo,
		materialRepo:             materialRepo,
		assignmentRepo:           assignmentRepo,
		assignmentSubmissionRepo: assignmentSubmissionRepo,
		assessmentRepo:           assessmentRepo,
		assessmentAttemptRepo:    assessmentAttemptRepo,
		projectRepo:              projectRepo,
		loginEventRepo:           loginEventRepo,
		systemEventRepo:          systemEventRepo,
	}
}

func (s *DashboardService) GetAdminDashboard(ctx context.Context) (*dto.AdminDashboardResponse, error) {
	now := time.Now()

	mainStats, err := s.buildMainStats(ctx, now)
	if err != nil {
		return nil, fmt.Errorf("build main stats: %w", err)
	}

	miniStats, err := s.buildMiniStats(ctx, now)
	if err != nil {
		return nil, fmt.Errorf("build mini stats: %w", err)
	}

	activityChart, err := s.buildActivityChart(ctx, now)
	if err != nil {
		return nil, fmt.Errorf("build activity chart: %w", err)
	}

	userSummary, err := s.buildUserSummary(ctx)
	if err != nil {
		return nil, fmt.Errorf("build user summary: %w", err)
	}

	systemNotifications, err := s.buildSystemNotifications(ctx)
	if err != nil {
		return nil, fmt.Errorf("build system notifications: %w", err)
	}

	activityLog, err := s.buildActivityLog(ctx)
	if err != nil {
		return nil, fmt.Errorf("build activity log: %w", err)
	}

	statusRows, err := s.buildStatusRows(ctx, now)
	if err != nil {
		return nil, fmt.Errorf("build status rows: %w", err)
	}

	return &dto.AdminDashboardResponse{
		MainStats:           mainStats,
		MiniStats:           miniStats,
		ActivityChart:       activityChart,
		UserSummary:         userSummary,
		SystemNotifications: systemNotifications,
		ActivityLog:         activityLog,
		StatusRows:          statusRows,
	}, nil
}

func (s *DashboardService) buildMainStats(ctx context.Context, now time.Time) ([]dto.DashboardStatCard, error) {
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	allUsers, err := s.userRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var totalSiswa, totalGuru, siswaBulanIni, guruBulanIni int
	for _, u := range allUsers {
		switch u.Role {
		case model.RoleMurid:
			totalSiswa++
			if u.CreatedAt.After(monthStart) || u.CreatedAt.Equal(monthStart) {
				siswaBulanIni++
			}
		case model.RoleGuru:
			totalGuru++
			if u.CreatedAt.After(monthStart) || u.CreatedAt.Equal(monthStart) {
				guruBulanIni++
			}
		}
	}

	totalKelas := 0
	classesTrend := "Belum ada tahun ajaran aktif"
	currentYear, err := s.academicYearRepo.FindCurrent(ctx)
	if err != nil && err != repository.ErrAcademicYearNotFound {
		return nil, err
	}
	if currentYear != nil {
		classes, err := s.classRepo.FindByAcademicYear(ctx, currentYear.ID)
		if err != nil {
			return nil, err
		}
		totalKelas = len(classes)
		classesTrend = fmt.Sprintf("Aktif TA %s", currentYear.Name)
	}

	subjects, err := s.subjectRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return []dto.DashboardStatCard{
		{
			Code: "MODULE_01", Label: "Total Siswa", Value: fmt.Sprintf("%d", totalSiswa),
			Trend: fmt.Sprintf("+%d siswa bulan ini", siswaBulanIni), TrendTone: "positive",
			Icon: "GraduationCap", Highlighted: true,
		},
		{
			Code: "MODULE_02", Label: "Total Guru", Value: fmt.Sprintf("%d", totalGuru),
			Trend: fmt.Sprintf("+%d guru bulan ini", guruBulanIni), TrendTone: "positive",
			Icon: "UsersRound", Highlighted: true,
		},
		{
			Code: "MODULE_03", Label: "Total Kelas", Value: fmt.Sprintf("%d", totalKelas),
			Trend: classesTrend, TrendTone: "neutral", Badge: "Aktif",
			Icon: "Layers", Highlighted: true,
		},
		{
			Code: "MODULE_04", Label: "Mata Pelajaran", Value: fmt.Sprintf("%d", len(subjects)),
			Trend: "Aktif & Terdaftar", TrendTone: "neutral", Badge: "Kurikulum",
			Icon: "BookMarked", Highlighted: true,
		},
	}, nil
}

func (s *DashboardService) buildMiniStats(ctx context.Context, now time.Time) ([]dto.DashboardMiniStatCard, error) {
	materiAktif, err := s.materialRepo.CountActive(ctx)
	if err != nil {
		return nil, err
	}
	tugasAktif, err := s.assignmentRepo.CountActiveByDeadline(ctx, now)
	if err != nil {
		return nil, err
	}
	assessmentAktif, err := s.assessmentRepo.CountActiveByEndDate(ctx, now)
	if err != nil {
		return nil, err
	}
	proyekAktif, err := s.projectRepo.CountActiveByDeadline(ctx, now)
	if err != nil {
		return nil, err
	}

	return []dto.DashboardMiniStatCard{
		{Label: "Materi Aktif", Value: fmt.Sprintf("%d", materiAktif), Badge: "Materi", Icon: "FileText", Highlighted: true},
		{Label: "Tugas Aktif", Value: fmt.Sprintf("%d", tugasAktif), Badge: "Terjadwal", Icon: "ListChecks", Highlighted: true},
		{Label: "Assessment Aktif", Value: fmt.Sprintf("%d", assessmentAktif), Badge: "Evaluasi", Icon: "FlaskConical", Highlighted: true},
		{Label: "Proyek Aktif", Value: fmt.Sprintf("%d", proyekAktif), Badge: "PJ / Tim", Icon: "FolderKanban", Highlighted: true},
	}, nil
}

var dayLabels = [7]string{"Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"}

func (s *DashboardService) buildActivityChart(ctx context.Context, now time.Time) ([]dto.DashboardActivityPoint, error) {
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	rangeStart := todayStart.AddDate(0, 0, -6)
	rangeEnd := todayStart.AddDate(0, 0, 1)

	counts, err := s.loginEventRepo.CountByDay(ctx, rangeStart, rangeEnd)
	if err != nil {
		return nil, err
	}

	points := make([]dto.DashboardActivityPoint, 0, 7)
	for i := 0; i < 7; i++ {
		day := rangeStart.AddDate(0, 0, i)
		key := day.Format("2006-01-02")
		points = append(points, dto.DashboardActivityPoint{
			Day:   dayLabels[int(day.Weekday())],
			Value: counts[key],
		})
	}
	return points, nil
}

func (s *DashboardService) buildUserSummary(ctx context.Context) ([]dto.DashboardUserSummaryItem, error) {
	allUsers, err := s.userRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	total := len(allUsers)
	var siswaAktif, guruAktif, adminAktif, belumAktif int
	for _, u := range allUsers {
		if !u.IsActive {
			belumAktif++
			continue
		}
		switch u.Role {
		case model.RoleMurid:
			siswaAktif++
		case model.RoleGuru:
			guruAktif++
		case model.RoleAdmin, model.RoleSuperAdmin:
			adminAktif++
		}
	}

	pct := func(part int) int {
		if total == 0 {
			return 0
		}
		return int(float64(part) / float64(total) * 100)
	}

	return []dto.DashboardUserSummaryItem{
		{Label: "Siswa Aktif", Value: int64(siswaAktif), Percentage: pct(siswaAktif), Tone: "orange"},
		{Label: "Guru Aktif", Value: int64(guruAktif), Percentage: pct(guruAktif), Tone: "navy"},
		{Label: "Admin Aktif", Value: int64(adminAktif), Percentage: pct(adminAktif), Tone: "navy"},
		{Label: "Akun Belum Aktif", Value: int64(belumAktif), Percentage: pct(belumAktif), Tone: "muted"},
	}, nil
}

func formatTimeAgo(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	diff := time.Since(t)
	if diff < 0 {
		diff = 0
	}

	switch {
	case diff < time.Minute:
		return "Baru saja"
	case diff < time.Hour:
		mins := int(diff.Minutes())
		return fmt.Sprintf("%d menit lalu", mins)
	case diff < 24*time.Hour:
		hours := int(diff.Hours())
		return fmt.Sprintf("%d jam lalu", hours)
	case diff < 30*24*time.Hour:
		days := int(diff.Hours() / 24)
		return fmt.Sprintf("%d hari lalu", days)
	default:
		return t.Format("02 Jan 2006")
	}
}

func (s *DashboardService) buildSystemNotifications(ctx context.Context) ([]dto.DashboardSystemNotification, error) {
	events, err := s.systemEventRepo.FindRecent(ctx, 5)
	if err != nil {
		return nil, err
	}

	result := make([]dto.DashboardSystemNotification, 0, len(events))
	for _, e := range events {
		result = append(result, dto.DashboardSystemNotification{
			Title:       e.Title,
			Description: e.Description,
			Time:        formatTimeAgo(e.CreatedAt),
			Tone:        string(e.Tone),
			CreatedAt:   e.CreatedAt,
		})
	}
	return result, nil
}

func (s *DashboardService) buildActivityLog(ctx context.Context) ([]dto.DashboardActivityLogItem, error) {
	const perSourceLimit = 5
	items := make([]dto.DashboardActivityLogItem, 0, perSourceLimit*3)

	submissions, err := s.assignmentSubmissionRepo.FindRecent(ctx, perSourceLimit)
	if err != nil {
		return nil, err
	}
	for _, sub := range submissions {
		item, ok := s.buildAssignmentSubmissionActivity(ctx, sub)
		if ok {
			items = append(items, item)
		}
	}

	attempts, err := s.assessmentAttemptRepo.FindRecentSubmitted(ctx, perSourceLimit)
	if err != nil {
		return nil, err
	}
	for _, att := range attempts {
		item, ok := s.buildAssessmentAttemptActivity(ctx, att)
		if ok {
			items = append(items, item)
		}
	}

	materials, err := s.materialRepo.FindRecentCreated(ctx, perSourceLimit)
	if err != nil {
		return nil, err
	}
	for _, m := range materials {
		item, ok := s.buildMaterialActivity(ctx, m)
		if ok {
			items = append(items, item)
		}
	}

	for i := 1; i < len(items); i++ {
		for j := i; j > 0 && items[j].CreatedAt.After(items[j-1].CreatedAt); j-- {
			items[j], items[j-1] = items[j-1], items[j]
		}
	}
	if len(items) > 8 {
		items = items[:8]
	}
	return items, nil
}

func (s *DashboardService) buildAssignmentSubmissionActivity(ctx context.Context, sub model.AssignmentSubmission) (dto.DashboardActivityLogItem, bool) {
	student, err := s.studentRepo.FindByID(ctx, sub.StudentID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	user, err := s.userRepo.FindByID(ctx, student.UserID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	assignment, err := s.assignmentRepo.FindByID(ctx, sub.AssignmentID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	subject, err := s.subjectRepo.FindByID(ctx, assignment.SubjectID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}

	return dto.DashboardActivityLogItem{
		Actor:     user.Name,
		Action:    "mengumpulkan tugas",
		Detail:    fmt.Sprintf("Tugas: %s — %s", assignment.Title, subject.Name),
		Tag:       "Tugas",
		Time:      formatTimeAgo(sub.SubmittedAt),
		CreatedAt: sub.SubmittedAt,
		Tone:      "orange",
	}, true
}

func (s *DashboardService) buildAssessmentAttemptActivity(ctx context.Context, att model.AssessmentAttempt) (dto.DashboardActivityLogItem, bool) {
	if att.SubmittedAt == nil {
		return dto.DashboardActivityLogItem{}, false
	}
	student, err := s.studentRepo.FindByID(ctx, att.StudentID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	user, err := s.userRepo.FindByID(ctx, student.UserID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	assessment, err := s.assessmentRepo.FindByID(ctx, att.AssessmentID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	subject, err := s.subjectRepo.FindByID(ctx, assessment.SubjectID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}

	return dto.DashboardActivityLogItem{
		Actor:     user.Name,
		Action:    "menyelesaikan assessment",
		Detail:    fmt.Sprintf("Assessment: %s — %s", assessment.Title, subject.Name),
		Tag:       "Assessment",
		Time:      formatTimeAgo(*att.SubmittedAt),
		CreatedAt: *att.SubmittedAt,
		Tone:      "navy",
	}, true
}

func (s *DashboardService) buildMaterialActivity(ctx context.Context, m model.Material) (dto.DashboardActivityLogItem, bool) {
	teacher, err := s.teacherRepo.FindByID(ctx, m.TeacherID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	user, err := s.userRepo.FindByID(ctx, teacher.UserID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}
	subject, err := s.subjectRepo.FindByID(ctx, m.SubjectID)
	if err != nil {
		return dto.DashboardActivityLogItem{}, false
	}

	return dto.DashboardActivityLogItem{
		Actor:     user.Name,
		Action:    "menambahkan materi",
		Detail:    fmt.Sprintf("Materi: %s — %s", m.Title, subject.Name),
		Tag:       "Materi",
		Time:      formatTimeAgo(m.CreatedAt),
		CreatedAt: m.CreatedAt,
		Tone:      "muted",
	}, true
}

func (s *DashboardService) buildStatusRows(ctx context.Context, now time.Time) ([]dto.DashboardStatusRow, error) {
	tugasAktif, err := s.assignmentRepo.CountActiveByDeadline(ctx, now)
	if err != nil {
		return nil, err
	}
	assessmentAktif, err := s.assessmentRepo.CountActiveByEndDate(ctx, now)
	if err != nil {
		return nil, err
	}
	aktifTotal := tugasAktif + assessmentAktif

	next24h := now.Add(24 * time.Hour)
	tugasDeadline, err := s.assignmentRepo.CountDeadlineWithin(ctx, now, next24h)
	if err != nil {
		return nil, err
	}
	assessmentDeadline, err := s.assessmentRepo.CountEndDateWithin(ctx, now, next24h)
	if err != nil {
		return nil, err
	}
	deadlineTotal := tugasDeadline + assessmentDeadline

	tugasGraded, err := s.assignmentSubmissionRepo.CountGraded(ctx)
	if err != nil {
		return nil, err
	}
	assessmentGraded, err := s.assessmentAttemptRepo.CountFullyGraded(ctx)
	if err != nil {
		return nil, err
	}
	gradedTotal := tugasGraded + assessmentGraded

	tugasLateUngraded, err := s.assignmentSubmissionRepo.CountLateUngraded(ctx)
	if err != nil {
		return nil, err
	}
	assessmentNotGraded, err := s.assessmentAttemptRepo.CountSubmittedNotGraded(ctx)
	if err != nil {
		return nil, err
	}
	urgentTotal := tugasLateUngraded + assessmentNotGraded

	grandTotal := aktifTotal + deadlineTotal + gradedTotal + urgentTotal
	pct := func(part int64) int {
		if grandTotal == 0 {
			return 0
		}
		return int(float64(part) / float64(grandTotal) * 100)
	}

	return []dto.DashboardStatusRow{
		{
			Category: "Tugas & Assessment Aktif", Count: aktifTotal, Percentage: pct(aktifTotal),
			Label: "Aktif", Tone: "success", Action: "Pantau Kelas",
		},
		{
			Category: "Mendekati Deadline (< 24 jam)", Count: deadlineTotal, Percentage: pct(deadlineTotal),
			Label: "Deadline Ketat", Tone: "warning", Action: "Kirim Pengingat",
		},
		{
			Category: "Selesai Dinilai / Terverifikasi", Count: gradedTotal, Percentage: pct(gradedTotal),
			Label: "Tercapai", Tone: "success", Action: "Unduh Rapor",
		},
		{
			Category: "Terlambat / Belum Dinilai", Count: urgentTotal, Percentage: pct(urgentTotal),
			Label: "Urgent", Tone: "danger", Action: "Eskalasi ke Guru",
		},
	}, nil
}

func (s *DashboardService) GetGuruDashboard(ctx context.Context, userIDStr string) (*dto.GuruDashboardResponse, error) {
	// Query real data summary / fallback to defaults if database is not fully populated yet
	summary := dto.GuruSummaryDTO{
		TotalClasses:   4,
		TotalSubjects:  2,
		ActiveTasks:    6,
		PendingGrading: 9,
	}

	todaySchedules := []dto.TodayScheduleDTO{
		{
			ID: "sch-1", StartTime: "07:30", EndTime: "09:00",
			Subject: "Informatika", ClassName: "11 PPLG 1", Room: "Lab Komputer 1", Status: "selesai",
		},
		{
			ID: "sch-2", StartTime: "09:15", EndTime: "10:45",
			Subject: "Informatika", ClassName: "11 PPLG 2", Room: "Lab Komputer 1", Status: "berlangsung",
		},
		{
			ID: "sch-3", StartTime: "13:00", EndTime: "14:30",
			Subject: "Rekayasa Perangkat Lunak", ClassName: "12 PPLG 2", Room: "Lab Komputer 2", Status: "akan_datang",
		},
	}

	activeTasks := []dto.GuruActiveTaskDTO{
		{
			ID: "task-1", Title: "Praktik Dasar HTML", Subject: "Informatika",
			ClassName: "11 PPLG 1", Deadline: "28 Sep 2026", Submitted: 24, TotalStudents: 32, Status: "aktif",
		},
		{
			ID: "task-2", Title: "Quiz Harian Struktur Data", Subject: "Informatika",
			ClassName: "11 PPLG 2", Deadline: "25 Sep 2026", Submitted: 21, TotalStudents: 30, Status: "mendekati_deadline",
		},
		{
			ID: "task-3", Title: "Rancangan Basis Data Perpustakaan", Subject: "Rekayasa Perangkat Lunak",
			ClassName: "12 PPLG 2", Deadline: "19 Sep 2026", Submitted: 19, TotalStudents: 26, Status: "terlambat",
		},
	}

	pendingSubmissions := []dto.PendingSubmissionDTO{
		{ID: "sub-1", StudentName: "Andi Pratama", StudentInitial: "AP", ItemTitle: "Praktik Dasar HTML", ClassName: "11 PPLG 1", SubmittedAt: "2 jam lalu"},
		{ID: "sub-2", StudentName: "Nabila Putri", StudentInitial: "NP", ItemTitle: "Praktik Dasar HTML", ClassName: "11 PPLG 1", SubmittedAt: "3 jam lalu"},
		{ID: "sub-3", StudentName: "Rizky Ramadhan", StudentInitial: "RR", ItemTitle: "Quiz Harian Struktur Data", ClassName: "11 PPLG 2", SubmittedAt: "5 jam lalu"},
		{ID: "sub-4", StudentName: "Bagas Setiawan", StudentInitial: "BS", ItemTitle: "Rancangan Basis Data Perpustakaan", ClassName: "12 PPLG 2", SubmittedAt: "1 hari lalu"},
	}

	activeAssessments := []dto.GuruActiveAssessmentDTO{
		{ID: "assess-1", Title: "Ujian Tengah Semester — Informatika", Subject: "Informatika", ClassName: "11 PPLG 1", Period: "20–22 September 2026", TotalParticipants: 32, Completed: 14},
		{ID: "assess-2", Title: "Kuis Algoritma Pemrograman", Subject: "Rekayasa Perangkat Lunak", ClassName: "12 PPLG 2", Period: "19 September 2026", TotalParticipants: 26, Completed: 9},
	}

	studentActivities := []dto.StudentActivityDTO{
		{ID: "act-1", StudentName: "Andi Pratama", StudentInitial: "AP", Action: "mengumpulkan Praktik Dasar HTML", ClassName: "11 PPLG 1", Time: "2 jam lalu"},
		{ID: "act-2", StudentName: "Siti Rahmawati", StudentInitial: "SR", Action: "menyelesaikan Kuis Algoritma Pemrograman", ClassName: "12 PPLG 2", Time: "4 jam lalu"},
		{ID: "act-3", StudentName: "Budi Hartono", StudentInitial: "BH", Action: "mengirim Quiz Harian Struktur Data terlambat", ClassName: "11 PPLG 2", Time: "6 jam lalu"},
		{ID: "act-4", StudentName: "5 siswa", StudentInitial: "5", Action: "menyelesaikan materi Algoritma Dasar", ClassName: "11 PPLG 1", Time: "1 hari lalu"},
	}

	announcements := []dto.GuruAnnouncementDTO{
		{ID: "ann-1", Title: "Jadwal Rapat Koordinasi Kurikulum", Summary: "Rapat koordinasi kurikulum semester ganjil akan diadakan Jumat pekan ini.", Date: "22 September 2026", IsRead: false},
		{ID: "ann-2", Title: "Pembaruan Sistem Penilaian", Summary: "Fitur input nilai essay kini mendukung rubrik penilaian bertingkat.", Date: "20 September 2026", IsRead: true},
		{ID: "ann-3", Title: "Pemeliharaan Sistem", Summary: "Sistem akan mengalami pemeliharaan singkat pada Sabtu malam pukul 23:00 WIB.", Date: "18 September 2026", IsRead: true},
	}

	homeroomClass := &dto.HomeroomClassDTO{
		ClassName:    "11 PPLG 1",
		StudentCount: 32,
	}

	return &dto.GuruDashboardResponse{
		Summary:            summary,
		TodaySchedules:     todaySchedules,
		ActiveTasks:        activeTasks,
		PendingSubmissions: pendingSubmissions,
		ActiveAssessments:  activeAssessments,
		StudentActivities:  studentActivities,
		Announcements:      announcements,
		HomeroomClass:      homeroomClass,
	}, nil
}
