package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Assignment merepresentasikan satu tugas dari guru untuk satu kelas.
//
// CATATAN: ClassIDs ([]bson.ObjectID) — Assignment dapat ditugaskan
// ke beberapa kelas sekaligus.
//
// AllowResubmit TIDAK ada di level Assignment ini — sesuai keputusan
// Anda, opsi resubmit ditentukan per submission (lihat
// AssignmentSubmission.AllowResubmit).
type Assignment struct {
	ID bson.ObjectID `bson:"_id,omitempty" json:"id"`

	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	SubjectID   bson.ObjectID `bson:"subject_id" json:"subjectId"`
	TeacherID   bson.ObjectID   `bson:"teacher_id" json:"teacherId"`
	ClassIDs    []bson.ObjectID `bson:"class_ids" json:"classIds"`

	Deadline time.Time `bson:"deadline" json:"deadline"`

	File *FileMetadata `bson:"file,omitempty" json:"file,omitempty"`
	Link *string       `bson:"link,omitempty" json:"link,omitempty"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}