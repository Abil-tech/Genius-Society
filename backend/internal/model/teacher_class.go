package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// TeacherClass adalah penugasan mengajar AKTUAL: guru X mengajar mapel Y
// di kelas Z pada tahun ajaran W. Ini yang dipakai untuk generate jadwal
// (schedules) dan menentukan siapa yang berhak input nilai/materi/tugas
// untuk kombinasi kelas+mapel tertentu.
//
// CATATAN DESAIN: unique index di bawah mengizinkan lebih dari satu guru
// mengajar mapel+kelas+tahun ajaran yang sama (co-teaching/guru pengganti),
// selama kombinasi keempat field-nya tidak identik. Kalau aturan sekolah
// Anda mewajibkan HANYA SATU guru per (subject, class, academic_year),
// beri tahu saya — index-nya perlu diganti jadi unique pada tiga field itu
// saja (tanpa teacher_id).
type TeacherClass struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	TeacherID      primitive.ObjectID `bson:"teacher_id" json:"teacherId"`
	SubjectID      primitive.ObjectID `bson:"subject_id" json:"subjectId"`
	ClassID        primitive.ObjectID `bson:"class_id" json:"classId"`
	AcademicYearID primitive.ObjectID `bson:"academic_year_id" json:"academicYearId"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}