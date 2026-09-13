package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Gender string

const (
	GenderMale   Gender = "L" // Laki-laki
	GenderFemale Gender = "P" // Perempuan
)

var ValidGenders = map[Gender]bool{
	GenderMale:   true,
	GenderFemale: true,
}

// Student adalah profil akademik tambahan untuk user ber-role murid.
// Referensi ke User lewat UserID (1:1) — NISN TIDAK disimpan di sini,
// NISN adalah User.Username milik user yang bersangkutan.
//
// Kelas siswa saat ini SENGAJA TIDAK ada di sini — itu ditentukan lewat
// collection class_students (riwayat penempatan kelas per tahun ajaran),
// bukan field langsung di Student, supaya riwayat kelas per tahun ajaran
// tidak hilang begitu siswa naik/pindah kelas.
type Student struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"user_id" json:"userId"`

	DateOfBirth   time.Time `bson:"date_of_birth" json:"dateOfBirth"`
	Gender        Gender    `bson:"gender" json:"gender"`
	AdmissionDate time.Time `bson:"admission_date" json:"admissionDate"`

	// IsActive: soft-delete flag untuk profil ini.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}