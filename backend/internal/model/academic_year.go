package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// SemesterName membatasi nilai yang valid untuk Semester.Name.
type SemesterName string

const (
	SemesterGanjil SemesterName = "Ganjil"
	SemesterGenap  SemesterName = "Genap"
)

var ValidSemesterNames = map[SemesterName]bool{
	SemesterGanjil: true,
	SemesterGenap:  true,
}

// Semester adalah sub-document di dalam AcademicYear.Semesters.
// Tidak punya _id sendiri karena selalu diakses lewat parent AcademicYear.
type Semester struct {
	Name      SemesterName `bson:"name" json:"name"`
	StartDate time.Time    `bson:"start_date" json:"startDate"`
	EndDate   time.Time    `bson:"end_date" json:"endDate"`

	// IsCurrent: menandai semester yang sedang berjalan SEKARANG di dalam
	// tahun ajaran ini. Hanya boleh ada maksimal satu semester dengan
	// IsCurrent=true per AcademicYear — ini TIDAK bisa dijamin oleh index
	// MongoDB (karena ada di dalam array), jadi wajib divalidasi di service
	// layer / repository method SetCurrentSemester.
	IsCurrent bool `bson:"is_current" json:"isCurrent"`
}

// AcademicYear merepresentasikan satu tahun ajaran (mis. "2025/2026").
type AcademicYear struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`

	// Name: label tahun ajaran, unique (mis. "2025/2026").
	Name string `bson:"name" json:"name"`

	Semesters []Semester `bson:"semesters" json:"semesters"`

	// IsCurrent: menandai tahun ajaran yang sedang berjalan SEKARANG.
	// Hanya boleh ada maksimal satu AcademicYear dengan IsCurrent=true di
	// seluruh collection — dijamin lewat repository method
	// SetCurrentAcademicYear (unset semua dulu, baru set satu), BUKAN lewat
	// unique index (MongoDB tidak bisa membuat unique index parsial pada
	// nilai boolean true secara langsung tanpa partial filter expression;
	// kalaupun dipakai, tetap butuh operasi 2 langkah yang sama).
	IsCurrent bool `bson:"is_current" json:"isCurrent"`

	// IsActive: soft-delete flag, BUKAN penanda "tahun ajaran berjalan".
	// Sengaja dipisah dari IsCurrent untuk menghindari ambiguitas makna.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}