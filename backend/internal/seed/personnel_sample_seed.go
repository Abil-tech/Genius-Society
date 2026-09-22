package seed

import (
	"context"
	"fmt"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// SeedSampleGuru menyisipkan SATU guru contoh LENGKAP dengan seluruh data
// pendukung yang dibutuhkan endpoint GET /api/admin/personnel supaya bisa
// langsung dites dengan data nyata: academic_year, subject, 2 classes,
// user+teacher, teacher_subject (primary), 2 teacher_class, dan walas.
//
// Datanya sengaja disamakan dengan entri PERTAMA di data dummy frontend
// Anda (Ahmad Fauzan, S.Kom. — NIP 198905122015012002, Informatika,
// walas 11 PPLG 1, juga mengajar 11 PPLG 2) supaya hasil dari API asli
// bisa dibandingkan langsung dengan tampilan dummy yang sudah ada.
//
// IDEMPOTENT lewat SATU gerbang: kalau user dengan Email di bawah SUDAH
// ADA, seluruh fungsi langsung return nil tanpa melakukan apa pun (meniru
// pola EnsureDevSeed di UserRepository). Ini BUKAN idempotency per
// collection — kalau user itu dihapus manual tapi academic_year/subject/
// class hasil seed sebelumnya masih ada, run berikutnya bisa gagal kena
// unique index (duplicate key) saat mencoba membuat ulang data yang sama.
// Untuk seed dev sekali pakai ini acceptable — beri tahu saya kalau perlu
// idempotency penuh per collection.
//
// HANYA untuk development — JANGAN dipanggil di jalur production.
func SeedSampleGuru(ctx context.Context, db *mongo.Database) error {
	userRepo := repository.NewUserRepository(db)
	teacherRepo := repository.NewTeacherRepository(db)
	teacherSubjectRepo := repository.NewTeacherSubjectRepository(db)
	teacherClassRepo := repository.NewTeacherClassRepository(db)
	classRepo := repository.NewClassRepository(db)
	subjectRepo := repository.NewSubjectRepository(db)
	academicYearRepo := repository.NewAcademicYearRepository(db)
	counterRepo := repository.NewCounterRepository(db)

	const email = "ahmad.fauzan@genius.sch.id"

	if _, err := userRepo.FindByEmail(ctx, email); err == nil {
		return nil // sudah pernah di-seed sebelumnya, jangan diulang
	} else if err != repository.ErrUserNotFound {
		return fmt.Errorf("cek user existing: %w", err)
	}

	// 1. Tahun ajaran "2025/2026", semester Ganjil sebagai current.
	academicYear := &model.AcademicYear{
		Name: "2025/2026",
		Semesters: []model.Semester{
			{
				Name:      model.SemesterGanjil,
				StartDate: time.Date(2025, 7, 1, 0, 0, 0, 0, time.UTC),
				EndDate:   time.Date(2025, 12, 20, 0, 0, 0, 0, time.UTC),
				IsCurrent: true,
			},
			{
				Name:      model.SemesterGenap,
				StartDate: time.Date(2026, 1, 5, 0, 0, 0, 0, time.UTC),
				EndDate:   time.Date(2026, 6, 20, 0, 0, 0, 0, time.UTC),
				IsCurrent: false,
			},
		},
	}
	if err := academicYearRepo.Create(ctx, academicYear); err != nil {
		return fmt.Errorf("create academic year: %w", err)
	}
	if err := academicYearRepo.SetCurrentAcademicYear(ctx, academicYear.ID); err != nil {
		return fmt.Errorf("set current academic year: %w", err)
	}

	// 2. Mata pelajaran "Informatika".
	subject := &model.Subject{Name: "Informatika", Code: "INF"}
	if err := subjectRepo.Create(ctx, subject); err != nil {
		return fmt.Errorf("create subject: %w", err)
	}

	// 3. Dua kelas: "11 PPLG 1" dan "11 PPLG 2".
	class1 := &model.Class{
		Name: "11 PPLG 1", GradeLevel: model.GradeXI,
		AcademicYearID: academicYear.ID, Capacity: 36,
	}
	if err := classRepo.Create(ctx, class1); err != nil {
		return fmt.Errorf("create class 11 PPLG 1: %w", err)
	}
	class2 := &model.Class{
		Name: "11 PPLG 2", GradeLevel: model.GradeXI,
		AcademicYearID: academicYear.ID, Capacity: 36,
	}
	if err := classRepo.Create(ctx, class2); err != nil {
		return fmt.Errorf("create class 11 PPLG 2: %w", err)
	}

	// 4. User guru "Ahmad Fauzan, S.Kom.".
	username, err := counterRepo.NextUsername(ctx, model.CounterKeyGuru)
	if err != nil {
		return fmt.Errorf("generate username: %w", err)
	}
	// Password dev default "password123" — HANYA untuk development,
	// JANGAN pernah dipakai sebagai default di production.
	passwordHash, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}
	user := &model.User{
		Name:         "Ahmad Fauzan, S.Kom.",
		Email:        email,
		PasswordHash: string(passwordHash),
		Role:         model.RoleGuru,
		Username:     &username,
	}
	if err := userRepo.Create(ctx, user); err != nil {
		return fmt.Errorf("create user: %w", err)
	}

	// 5. Profil Teacher, NIP sesuai referensi data dummy.
	nip := "198905122015012002"
	teacher := &model.Teacher{
		UserID:   user.ID,
		NIP:      &nip,
		JoinDate: time.Date(2015, 1, 12, 0, 0, 0, 0, time.UTC),
	}
	if err := teacherRepo.Create(ctx, teacher); err != nil {
		return fmt.Errorf("create teacher: %w", err)
	}

	// 6. Kompetensi mapel: Informatika sebagai mapel UTAMA.
	ts := &model.TeacherSubject{TeacherID: teacher.ID, SubjectID: subject.ID}
	if err := teacherSubjectRepo.Create(ctx, ts); err != nil {
		return fmt.Errorf("create teacher_subject: %w", err)
	}
	if err := teacherSubjectRepo.SetPrimarySubject(ctx, teacher.ID, subject.ID); err != nil {
		return fmt.Errorf("set primary subject: %w", err)
	}

	// 7. Penugasan mengajar Informatika di kedua kelas tahun ajaran ini.
	tc1 := &model.TeacherClass{
		TeacherID: teacher.ID, SubjectID: subject.ID,
		ClassID: class1.ID, AcademicYearID: academicYear.ID,
	}
	if err := teacherClassRepo.Create(ctx, tc1); err != nil {
		return fmt.Errorf("create teacher_class (11 PPLG 1): %w", err)
	}
	tc2 := &model.TeacherClass{
		TeacherID: teacher.ID, SubjectID: subject.ID,
		ClassID: class2.ID, AcademicYearID: academicYear.ID,
	}
	if err := teacherClassRepo.Create(ctx, tc2); err != nil {
		return fmt.Errorf("create teacher_class (11 PPLG 2): %w", err)
	}

	// 8. Jadikan wali kelas "11 PPLG 1" (sesuai referensi data dummy).
	if err := classRepo.SetWalas(ctx, class1.ID, &user.ID); err != nil {
		return fmt.Errorf("set walas: %w", err)
	}

	return nil
}