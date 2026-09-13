package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Grade adalah SATU dokumen nilai untuk kombinasi
// (student, subject, class, academic_year, semester). Field-field
// komponennya adalah HASIL AGREGASI yang di-cache di sini, bukan dihitung
// on-the-fly setiap dibaca:
//   - TugasAssessmentAverage: rata-rata dari SEMUA
//     AssignmentSubmission.Score + ProjectSubmission.Score +
//     AssessmentAttempt.FinalScore (yang Assessment.Category==CategoryHarian)
//     untuk kombinasi ini.
//   - UTSScore/UASScore: diambil dari AssessmentAttempt.FinalScore pada
//     Assessment dengan Category==CategoryUTS / CategoryUAS untuk
//     kombinasi ini (asumsi hanya ada 1 assessment UTS dan 1 UAS per
//     subject+class+semester — kalau ada lebih dari satu, service layer
//     perlu aturan tambahan, mis. ambil yang terbaru atau rata-rata).
//   - FinalScore: dihitung pakai bobot dari GradingConfig subject terkait
//     (atau default 60/20/20 kalau subject belum punya GradingConfig).
//
// KONSEKUENSI PENTING: karena ini nilai yang di-cache, Grade WAJIB
// di-recompute ulang oleh service layer setiap kali salah satu skor
// sumber berubah (assignment dinilai ulang, assessment attempt selesai
// dinilai guru, dst). Repository ini TIDAK melakukan agregasi lintas
// collection — itu tanggung jawab service layer.
type Grade struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudentID      primitive.ObjectID `bson:"student_id" json:"studentId"`
	SubjectID      primitive.ObjectID `bson:"subject_id" json:"subjectId"`
	ClassID        primitive.ObjectID `bson:"class_id" json:"classId"`
	AcademicYearID primitive.ObjectID `bson:"academic_year_id" json:"academicYearId"`
	Semester       SemesterName       `bson:"semester" json:"semester"`
	TeacherID      primitive.ObjectID `bson:"teacher_id" json:"teacherId"`

	TugasAssessmentAverage *float64 `bson:"tugas_assessment_average,omitempty" json:"tugasAssessmentAverage,omitempty"`
	UTSScore               *float64 `bson:"uts_score,omitempty" json:"utsScore,omitempty"`
	UASScore               *float64 `bson:"uas_score,omitempty" json:"uasScore,omitempty"`
	FinalScore             *float64 `bson:"final_score,omitempty" json:"finalScore,omitempty"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}