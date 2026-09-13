package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// TeacherSubject menyatakan bahwa seorang guru KOMPETEN/berwenang mengajar
// suatu mata pelajaran, TANPA terikat tahun ajaran tertentu. Ini berbeda
// dari TeacherClass, yang menyatakan penugasan mengajar AKTUAL pada suatu
// kelas di suatu tahun ajaran.
//
// Analoginya: TeacherSubject = "kualifikasi", TeacherClass = "jadwal
// mengajar konkret". Seorang guru bisa kompeten mengajar Matematika (ada
// di sini) tanpa sedang ditugaskan mengajar kelas manapun tahun ini (tidak
// ada TeacherClass untuk kombinasi itu).
type TeacherSubject struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	TeacherID primitive.ObjectID `bson:"teacher_id" json:"teacherId"`
	SubjectID primitive.ObjectID `bson:"subject_id" json:"subjectId"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}