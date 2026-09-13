package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Project mirip Assignment, tapi punya field Instructions terpisah dari
// Description (sesuai section 8 spec: Judul, Deskripsi, Instruksi, Deadline,
// Kelas, Mata Pelajaran, File pendukung). TIDAK ada Link di sini — spec
// asli hanya sebut "File pendukung" untuk projek, beda dari materi. Kalau
// ternyata Anda butuh Link juga di projek, beri tahu saya.
type Project struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`

	Title        string             `bson:"title" json:"title"`
	Description  string             `bson:"description" json:"description"`
	Instructions string             `bson:"instructions" json:"instructions"`
	SubjectID    primitive.ObjectID `bson:"subject_id" json:"subjectId"`
	TeacherID    primitive.ObjectID `bson:"teacher_id" json:"teacherId"`
	ClassID      primitive.ObjectID `bson:"class_id" json:"classId"`

	Deadline time.Time `bson:"deadline" json:"deadline"`

	File *FileMetadata `bson:"file,omitempty" json:"file,omitempty"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}