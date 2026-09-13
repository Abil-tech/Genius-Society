package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AssessmentCategory membedakan assessment harian biasa dari UTS/UAS.
// Ini dipakai LANGSUNG oleh perhitungan nilai akhir (lihat model.Grade):
// CategoryHarian masuk komponen "Tugas + Assessment Harian" (60%),
// CategoryUTS dan CategoryUAS masing-masing komponen terpisah (20%+20%).
// UTS/UAS SENGAJA tidak dibuat collection terpisah — cukup Assessment
// biasa dengan Category ini, sesuai keputusan Anda.
type AssessmentCategory string

const (
	CategoryHarian AssessmentCategory = "harian"
	CategoryUTS    AssessmentCategory = "uts"
	CategoryUAS    AssessmentCategory = "uas"
)

var ValidAssessmentCategories = map[AssessmentCategory]bool{
	CategoryHarian: true,
	CategoryUTS:    true,
	CategoryUAS:    true,
}

// Assessment bisa berisi campuran soal Pilihan Ganda dan Essay sekaligus
// (sesuai keputusan Anda). Soal-soalnya ada di collection terpisah
// assessment_questions (relasi 1:N lewat AssessmentID di setiap soal).
type Assessment struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`

	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	SubjectID   primitive.ObjectID `bson:"subject_id" json:"subjectId"`
	TeacherID   primitive.ObjectID `bson:"teacher_id" json:"teacherId"`
	ClassID     primitive.ObjectID `bson:"class_id" json:"classId"`

	// Category: default CategoryHarian kalau tidak diset eksplisit — lihat
	// AssessmentRepository.Create.
	Category AssessmentCategory `bson:"category" json:"category"`

	// StartDate/EndDate: jendela waktu assessment BOLEH dikerjakan.
	StartDate time.Time `bson:"start_date" json:"startDate"`
	EndDate   time.Time `bson:"end_date" json:"endDate"`

	// DurationMinutes: timer per attempt, INDEPENDEN dari StartDate/EndDate.
	// Kalau siswa mulai mengerjakan mendekati EndDate, timer tetap
	// dihitung penuh DurationMinutes tapi pengerjaan wajib dipaksa
	// berhenti di EndDate mana yang lebih dulu tercapai — logika
	// perbandingan dua batas waktu ini WAJIB ada di service layer, model
	// hanya menyimpan datanya.
	DurationMinutes int `bson:"duration_minutes" json:"durationMinutes"`

	// MaxAttempts: SELALU 1 sesuai keputusan saat ini. Tetap disimpan
	// sebagai field (bukan konstanta hardcoded) supaya kalau kebijakan
	// berubah nanti, tidak perlu migrasi schema. Bila diubah ke >1 di masa
	// depan, unique index di AssessmentAttempt (assessment_id, student_id)
	// HARUS diganti jadi (assessment_id, student_id, attempt_number).
	MaxAttempts int `bson:"max_attempts" json:"maxAttempts"`

	// ShowResultsImmediately: guru yang atur per assessment.
	//   true  -> siswa langsung lihat skor PG begitu submit; skor essay &
	//            nilai akhir menyusul setelah guru menilai.
	//   false -> siswa tidak lihat apa pun sampai guru selesai menilai
	//            SEMUA essay, baru nilai akhir muncul sekaligus.
	ShowResultsImmediately bool `bson:"show_results_immediately" json:"showResultsImmediately"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}