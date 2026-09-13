package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Assignment merepresentasikan satu tugas dari guru untuk satu kelas.
//
// CATATAN: ClassID (bukan ClassIDs/array) — beda dari Material yang bisa
// multi-kelas. Spec tidak menyebutkan tugas bisa diberikan ke beberapa
// kelas sekaligus (section 6), jadi saya buat single-class. Kalau
// ternyata dibutuhkan multi-kelas juga, beri tahu saya — perlu diubah ke
// []primitive.ObjectID dan disesuaikan juga index & query-nya.
//
// AllowResubmit TIDAK ada di level Assignment ini — sesuai keputusan
// Anda, opsi resubmit ditentukan per submission (lihat
// AssignmentSubmission.AllowResubmit).
type Assignment struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`

	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	SubjectID   primitive.ObjectID `bson:"subject_id" json:"subjectId"`
	TeacherID   primitive.ObjectID `bson:"teacher_id" json:"teacherId"`
	ClassID     primitive.ObjectID `bson:"class_id" json:"classId"`

	Deadline time.Time `bson:"deadline" json:"deadline"`

	File *FileMetadata `bson:"file,omitempty" json:"file,omitempty"`
	Link *string       `bson:"link,omitempty" json:"link,omitempty"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}