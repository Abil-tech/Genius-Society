package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AssignmentSubmission adalah SATU dokumen per (assignment, student) —
// bukan satu dokumen per kali submit. Kalau siswa resubmit, dokumen yang
// SAMA di-update (file diganti, AttemptNumber bertambah, Score/Feedback
// direset ke nil karena nilai lama sudah tidak relevan untuk jawaban baru).
// Ini konsekuensi dari keputusan "resubmit diizinkan per-submission" —
// histori attempt sebelumnya TIDAK disimpan kecuali Anda minta audit trail
// terpisah nanti.
//
// "Sudah dinilai atau belum" ditentukan dari Score != nil — TIDAK ada
// field Status terpisah, supaya tidak ada dua sumber kebenaran yang bisa
// tidak sinkron.
type AssignmentSubmission struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AssignmentID primitive.ObjectID `bson:"assignment_id" json:"assignmentId"`
	StudentID    primitive.ObjectID `bson:"student_id" json:"studentId"`

	File *FileMetadata `bson:"file,omitempty" json:"file,omitempty"`

	SubmittedAt time.Time `bson:"submitted_at" json:"submittedAt"`

	// IsLate: dihitung SEKALI saat submit (SubmittedAt > Assignment.Deadline
	// pada waktu itu), disimpan sebagai snapshot — bukan dihitung ulang tiap
	// baca, supaya kalau Deadline assignment diubah belakangan, histori
	// keterlambatan submission yang sudah ada tidak berubah retroaktif.
	IsLate bool `bson:"is_late" json:"isLate"`

	// AttemptNumber: dimulai dari 1, bertambah setiap resubmit disetujui.
	AttemptNumber int `bson:"attempt_number" json:"attemptNumber"`

	// AllowResubmit: guru mengizinkan siswa ini submit ulang. Direset ke
	// false setiap kali resubmit terjadi — guru harus mengizinkan lagi
	// untuk resubmit berikutnya (bukan izin permanen).
	AllowResubmit bool `bson:"allow_resubmit" json:"allowResubmit"`

	// Score/Feedback/GradedAt/GradedByTeacherID: nil selama belum dinilai.
	Score             *float64            `bson:"score,omitempty" json:"score,omitempty"`
	Feedback          *string             `bson:"feedback,omitempty" json:"feedback,omitempty"`
	GradedAt          *time.Time          `bson:"graded_at,omitempty" json:"gradedAt,omitempty"`
	GradedByTeacherID *primitive.ObjectID `bson:"graded_by_teacher_id,omitempty" json:"gradedByTeacherId,omitempty"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}