package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GradeLevel merepresentasikan tingkat kelas (X, XI, XII).
type GradeLevel string

const (
	GradeX   GradeLevel = "X"
	GradeXI  GradeLevel = "XI"
	GradeXII GradeLevel = "XII"
)

var ValidGradeLevels = map[GradeLevel]bool{
	GradeX:   true,
	GradeXI:  true,
	GradeXII: true,
}

// Class merepresentasikan satu rombongan belajar (mis. "X IPA 1")
// pada satu academic_year tertentu.
type Class struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name           string             `bson:"name" json:"name"`
	GradeLevel     GradeLevel         `bson:"grade_level" json:"gradeLevel"`
	AcademicYearID primitive.ObjectID `bson:"academic_year_id" json:"academicYearId"`

	// WalasID: user_id guru yang menjadi wali kelas. Nil jika belum ditentukan
	// (penentuan walas dilakukan oleh role Kurikulum, bisa menyusul setelah
	// kelas dibuat). Validasi bahwa user tersebut ber-role Guru dilakukan di
	// service layer, bukan di sini — MongoDB tidak punya foreign key.
	WalasID *primitive.ObjectID `bson:"walas_id,omitempty" json:"walasId,omitempty"`

	Capacity int `bson:"capacity" json:"capacity"`

	// IsActive: soft-delete flag, BUKAN penanda "tahun ajaran berjalan".
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}