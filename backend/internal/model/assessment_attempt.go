package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AssessmentAttempt merepresentasikan SATU kali siswa mengerjakan suatu
// assessment. MaxAttempts assessment saat ini selalu 1, ditegakkan lewat
// unique index (assessment_id, student_id) di EnsureIndexes — TAPI field
// AttemptNumber tetap ada (bukan diasumsikan selalu 1 di kode) supaya
// kalau kebijakan MaxAttempts berubah jadi >1 nanti, struktur data sudah
// siap; yang perlu diubah cuma index-nya.
type AssessmentAttempt struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AssessmentID  primitive.ObjectID `bson:"assessment_id" json:"assessmentId"`
	StudentID     primitive.ObjectID `bson:"student_id" json:"studentId"`
	AttemptNumber int                `bson:"attempt_number" json:"attemptNumber"`

	StartedAt   time.Time  `bson:"started_at" json:"startedAt"`
	SubmittedAt *time.Time `bson:"submitted_at,omitempty" json:"submittedAt,omitempty"`

	// AutoScore: total skor dari soal pilihan ganda, dihitung & diisi
	// OTOMATIS oleh service layer tepat saat submit.
	AutoScore float64 `bson:"auto_score" json:"autoScore"`

	// ManualScore: total skor dari soal essay. Nil selama masih ada essay
	// yang belum dinilai guru; terisi begitu SEMUA essay di attempt ini
	// selesai dinilai.
	ManualScore *float64 `bson:"manual_score,omitempty" json:"manualScore,omitempty"`

	// FinalScore: AutoScore + ManualScore (atau langsung sama dengan
	// AutoScore kalau assessment ini tidak punya soal essay sama sekali).
	// Dihitung SEKALI oleh service layer saat kondisi grading lengkap
	// terpenuhi, lalu disimpan (bukan dihitung ulang tiap baca) — supaya
	// bisa dipakai langsung oleh collection grades tanpa hitung ulang.
	FinalScore *float64 `bson:"final_score,omitempty" json:"finalScore,omitempty"`

	// IsFullyGraded: true kalau semua soal essay di attempt ini sudah
	// dinilai guru (soal PG otomatis dianggap graded sejak submit). Kalau
	// assessment ini tidak punya soal essay sama sekali, IsFullyGraded
	// langsung true saat submit.
	IsFullyGraded bool `bson:"is_fully_graded" json:"isFullyGraded"`

	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}