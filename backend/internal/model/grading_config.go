package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GradingConfig menyimpan bobot komponen nilai untuk SATU mata pelajaran
// (sesuai keputusan Anda: bobot bisa beda per mata pelajaran, bukan
// global atau per tahun ajaran). Kalau suatu SubjectID tidak punya
// GradingConfig, service layer harus fallback ke default spec: 60/20/20.
//
// TugasAssessmentWeight + UTSWeight + UASWeight WAJIB = 100 — validasi ini
// di service layer, model hanya menyimpan datanya.
type GradingConfig struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	SubjectID primitive.ObjectID `bson:"subject_id" json:"subjectId"`

	TugasAssessmentWeight float64 `bson:"tugas_assessment_weight" json:"tugasAssessmentWeight"` // default 60
	UTSWeight             float64 `bson:"uts_weight" json:"utsWeight"`                           // default 20
	UASWeight             float64 `bson:"uas_weight" json:"uasWeight"`                           // default 20

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}