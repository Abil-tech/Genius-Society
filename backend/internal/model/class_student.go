package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// EnrollmentStatus adalah status BISNIS penempatan siswa di suatu kelas
// pada suatu tahun ajaran — beda dari IsActive (yang murni soft-delete
// dokumen, misal dokumen dibuat karena salah input).
type EnrollmentStatus string

const (
	EnrollmentActive       EnrollmentStatus = "active"       // aktif
	EnrollmentTransferred  EnrollmentStatus = "transferred"  // pindah (keluar dari kelas/sekolah)
	EnrollmentGraduated    EnrollmentStatus = "graduated"    // lulus
)

var ValidEnrollmentStatuses = map[EnrollmentStatus]bool{
	EnrollmentActive:      true,
	EnrollmentTransferred: true,
	EnrollmentGraduated:   true,
}

// ClassStudent adalah junction collection: satu dokumen = satu siswa
// ditempatkan di satu kelas pada satu tahun ajaran. Riwayat kelas siswa
// dari tahun ke tahun didapat dengan query berdasarkan StudentID, diurutkan
// berdasarkan AcademicYearID/CreatedAt.
type ClassStudent struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudentID      primitive.ObjectID `bson:"student_id" json:"studentId"`
	ClassID        primitive.ObjectID `bson:"class_id" json:"classId"`
	AcademicYearID primitive.ObjectID `bson:"academic_year_id" json:"academicYearId"`

	// RollNumber: nomor absen siswa DI DALAM kelas ini pada tahun ajaran ini.
	RollNumber int `bson:"roll_number" json:"rollNumber"`

	Status EnrollmentStatus `bson:"status" json:"status"`

	// IsActive: soft-delete flag untuk dokumen ini (mis. salah input
	// penempatan kelas). BUKAN representasi status siswa — itu tugas
	// field Status di atas.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}