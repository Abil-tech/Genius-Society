package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
)

// avatarTones HARUS persis sama urutan/isinya dengan union type
// `avatarTone` di types/Personnel.ts frontend — kalau frontend menambah
// warna baru, tambahkan juga di sini.
var avatarTones = []string{"orange", "red", "blue", "purple", "pink"}

type PersonnelService struct {
	userRepo           *repository.UserRepository
	teacherRepo        *repository.TeacherRepository
	teacherSubjectRepo *repository.TeacherSubjectRepository
	teacherClassRepo   *repository.TeacherClassRepository
	classRepo          *repository.ClassRepository
	subjectRepo        *repository.SubjectRepository
	academicYearRepo   *repository.AcademicYearRepository
}

func NewPersonnelService(
	userRepo *repository.UserRepository,
	teacherRepo *repository.TeacherRepository,
	teacherSubjectRepo *repository.TeacherSubjectRepository,
	teacherClassRepo *repository.TeacherClassRepository,
	classRepo *repository.ClassRepository,
	subjectRepo *repository.SubjectRepository,
	academicYearRepo *repository.AcademicYearRepository,
) *PersonnelService {
	return &PersonnelService{
		userRepo:           userRepo,
		teacherRepo:        teacherRepo,
		teacherSubjectRepo: teacherSubjectRepo,
		teacherClassRepo:   teacherClassRepo,
		classRepo:          classRepo,
		subjectRepo:        subjectRepo,
		academicYearRepo:   academicYearRepo,
	}
}

// GetPersonnelPage mengembalikan stats + list sekaligus untuk halaman
// Guru & Staf. "staf" di sini adalah gabungan role kurikulum +
// kepala_sekolah — BUKAN role terpisah di database.
func (s *PersonnelService) GetPersonnelPage(ctx context.Context) (*dto.PersonnelPageResponse, error) {
	users, err := s.userRepo.FindByRoles(ctx, []model.Role{
		model.RoleGuru,
		model.RoleKurikulum,
		model.RoleKepalaSekolah,
	})
	if err != nil {
		return nil, fmt.Errorf("fetch personnel users: %w", err)
	}

	// currentYear boleh nil — kalau belum ada tahun ajaran yang diset
	// current (mis. instalasi baru belum setup), guru tetap ditampilkan
	// tapi kolom assignment/homeroom fallback ke "-"/false. Ini BUKAN
	// error yang menghentikan seluruh halaman.
	currentYear, err := s.academicYearRepo.FindCurrent(ctx)
	if err != nil && err != repository.ErrAcademicYearNotFound {
		return nil, fmt.Errorf("fetch current academic year: %w", err)
	}

	personnel := make([]dto.PersonnelResponse, 0, len(users))
	stats := dto.PersonnelStatsResponse{}

	for _, u := range users {
		var entry dto.PersonnelResponse
		switch u.Role {
		case model.RoleGuru:
			entry, err = s.buildGuruEntry(ctx, u, currentYear)
			if err != nil {
				return nil, fmt.Errorf("build guru entry (user %s): %w", u.ID.Hex(), err)
			}
			stats.TotalGuru++
			if u.IsActive {
				stats.GuruAktif++
			}
		case model.RoleKurikulum, model.RoleKepalaSekolah:
			entry = s.buildStafEntry(u)
			stats.TotalStaf++
			if u.IsActive {
				stats.StafAktif++
			}
		default:
			// Tidak mungkin tercapai karena FindByRoles hanya filter 3
			// role di atas — dijaga di sini supaya kalau suatu saat
			// FindByRoles dipanggil dengan role lain, tidak diam-diam
			// menghasilkan entry yang salah.
			continue
		}
		personnel = append(personnel, entry)
	}

	if stats.TotalGuru > 0 {
		stats.GuruAktifRate = round1(float64(stats.GuruAktif) / float64(stats.TotalGuru) * 100)
	}
	if stats.TotalStaf > 0 {
		stats.StafAktifRate = round1(float64(stats.StafAktif) / float64(stats.TotalStaf) * 100)
	}

	return &dto.PersonnelPageResponse{Stats: stats, Personnel: personnel}, nil
}

func (s *PersonnelService) buildGuruEntry(ctx context.Context, u model.User, currentYear *model.AcademicYear) (dto.PersonnelResponse, error) {
	teacher, err := s.teacherRepo.FindByUserID(ctx, u.ID)
	if err != nil {
		return dto.PersonnelResponse{}, fmt.Errorf("teacher profile not found: %w", err)
	}

	// NIP: kalau guru ini tidak punya NIP resmi (honorer/kontrak, lihat
	// model.Teacher), fallback ke Username (GS-GRU-xxx) supaya kolom NIP
	// di tabel tidak kosong — konsisten dengan pola "Username sebagai
	// pengganti NIP" yang sudah dipakai untuk Kurikulum/Kepala Sekolah.
	nip := ""
	if teacher.NIP != nil {
		nip = *teacher.NIP
	} else if u.Username != nil {
		nip = *u.Username
	}

	// Role (mapel utama): fallback ke mapel PERTAMA (urutan apa adanya
	// dari database, tidak dijamin urutan tertentu) kalau guru belum
	// punya mapel yang ditandai IsPrimary. Fallback ke "-" kalau guru ini
	// belum terdaftar mapel apa pun di teacher_subjects sama sekali.
	role := "-"
	if primary, err := s.teacherSubjectRepo.FindPrimaryByTeacher(ctx, teacher.ID); err == nil {
		if subj, err := s.subjectRepo.FindByID(ctx, primary.SubjectID); err == nil {
			role = subj.Name
		}
	} else {
		if subjects, err := s.teacherSubjectRepo.FindByTeacher(ctx, teacher.ID); err == nil && len(subjects) > 0 {
			if subj, err := s.subjectRepo.FindByID(ctx, subjects[0].SubjectID); err == nil {
				role = subj.Name
			}
		}
	}

	assignment := "-"
	homeroom := dto.PersonnelHomeroom{IsHomeroom: false}

	if currentYear != nil {
		if teacherClasses, err := s.teacherClassRepo.FindByTeacherAndYear(ctx, teacher.ID, currentYear.ID); err == nil && len(teacherClasses) > 0 {
			names := make([]string, 0, len(teacherClasses))
			seen := map[string]bool{}
			for _, tc := range teacherClasses {
				class, err := s.classRepo.FindByID(ctx, tc.ClassID)
				if err != nil {
					continue // kelas mungkin sudah di-soft-delete; skip, jangan gagalkan seluruh baris
				}
				if !seen[class.Name] {
					names = append(names, class.Name)
					seen[class.Name] = true
				}
			}
			if len(names) > 0 {
				assignment = strings.Join(names, ", ")
			}
		}

		if walasClass, err := s.classRepo.FindByWalasAndYear(ctx, u.ID, currentYear.ID); err == nil {
			className := walasClass.Name
			homeroom = dto.PersonnelHomeroom{IsHomeroom: true, ClassName: &className}
		}
	}

	return dto.PersonnelResponse{
		NIP:        nip,
		Name:       u.Name,
		Email:      u.Email,
		Initials:   buildInitials(u.Name),
		AvatarTone: pickAvatarTone(u.ID.Hex()),
		Type:       "guru",
		Role:       role,
		Assignment: assignment,
		Homeroom:   homeroom,
		Status:     statusLabel(u.IsActive),
	}, nil
}

// buildStafEntry: Kurikulum & Kepala Sekolah TIDAK punya collection
// profile (keputusan desain sebelumnya), jadi NIP diisi Username dan
// "assignment" diisi label role saja — sesuai keputusan Anda.
func (s *PersonnelService) buildStafEntry(u model.User) dto.PersonnelResponse {
	nip := ""
	if u.Username != nil {
		nip = *u.Username
	}

	roleLabel := "Kurikulum"
	if u.Role == model.RoleKepalaSekolah {
		roleLabel = "Kepala Sekolah"
	}

	return dto.PersonnelResponse{
		NIP:        nip,
		Name:       u.Name,
		Email:      u.Email,
		Initials:   buildInitials(u.Name),
		AvatarTone: pickAvatarTone(u.ID.Hex()),
		Type:       "staf",
		Role:       roleLabel,
		Assignment: roleLabel,
		Homeroom:   dto.PersonnelHomeroom{IsHomeroom: false},
		Status:     statusLabel(u.IsActive),
	}
}

func statusLabel(isActive bool) string {
	if isActive {
		return "aktif"
	}
	return "nonaktif"
}

// buildInitials mengambil huruf pertama dari maksimal 2 kata pertama nama,
// uppercase (mis. "Ahmad Fauzan, S.Kom." -> "AF").
func buildInitials(name string) string {
	fields := strings.Fields(name)
	var b strings.Builder
	count := 0
	for _, f := range fields {
		if count >= 2 {
			break
		}
		r := []rune(strings.TrimFunc(f, func(r rune) bool { return !isLetter(r) }))
		if len(r) == 0 {
			continue
		}
		b.WriteRune(toUpper(r[0]))
		count++
	}
	if b.Len() == 0 {
		return "?"
	}
	return b.String()
}

func isLetter(r rune) bool {
	return (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z')
}

func toUpper(r rune) rune {
	if r >= 'a' && r <= 'z' {
		return r - ('a' - 'A')
	}
	return r
}

// pickAvatarTone memilih warna avatar secara DETERMINISTIK dari hash
// sederhana user ID — bukan disimpan di database (warna avatar murni
// kosmetik, tidak perlu jadi source of truth di DB), tapi tetap konsisten
// setiap kali endpoint ini dipanggil untuk user yang sama (tidak berubah
// acak tiap refresh, karena dihitung dari ID yang tetap, bukan random).
func pickAvatarTone(idHex string) string {
	sum := 0
	for _, c := range idHex {
		sum += int(c)
	}
	return avatarTones[sum%len(avatarTones)]
}

func round1(v float64) float64 {
	return float64(int(v*10+0.5)) / 10
}