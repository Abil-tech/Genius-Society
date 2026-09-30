package model

import (
	"time"

    "go.mongodb.org/mongo-driver/v2/bson"  
)

// Assessment mewakili ujian/assessment yang dibuat guru
// Mendukung soal pilihan ganda (auto-grade) dan essay (manual grade)
type Assessment struct {
	ID bson.ObjectID `bson:"_id,omitempty" json:"id"`

	// Metadata dasar
	Title       string `bson:"title" json:"title"`
	Description string `bson:"description" json:"description"`

	// Ownership & Context
	TeacherID      bson.ObjectID `bson:"teacher_id" json:"teacherId"`       // Guru pembuat
	SubjectID      bson.ObjectID `bson:"subject_id" json:"subjectId"`       // Mata pelajaran
	ClassID        bson.ObjectID `bson:"class_id" json:"classId"`           // Kelas target
	AcademicYearID bson.ObjectID `bson:"academic_year_id" json:"academicYearId"` // Tahun ajaran

	// Jadwal & Durasi
	StartDate       time.Time `bson:"start_date" json:"startDate"`             // Kapan ujian dimulai
	EndDate         time.Time `bson:"end_date" json:"endDate"`                 // Kapan ujian berakhir
	DurationMinutes int       `bson:"duration_minutes" json:"durationMinutes"` // Durasi per attempt (menit)

	// Konfigurasi Soal
	QuestionCount int     `bson:"question_count" json:"questionCount"` // Total soal
	TotalWeight   float64 `bson:"total_weight" json:"totalWeight"`     // Total bobot soal (seharusnya 100)

	// Konfigurasi Penilaian
	Category               string `bson:"category" json:"category"`                         // "harian", "uts", "uas" — untuk calculation grade
	MaxAttempts            int    `bson:"max_attempts" json:"maxAttempts"`                 // Berapa kali siswa boleh coba (biasanya 1)
	ShowResultsImmediately bool   `bson:"show_results_immediately" json:"showResultsImmediately"` // Tunjukkan hasil langsung setelah submit?

	// Status
	IsActive  bool      `bson:"is_active" json:"isActive"`
	CreatedAt time.Time `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time `bson:"updated_at" json:"updatedAt"`
}
