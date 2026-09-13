package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DayOfWeek string

const (
	DaySenin DayOfWeek = "senin"
	DaySelasa DayOfWeek = "selasa"
	DayRabu   DayOfWeek = "rabu"
	DayKamis  DayOfWeek = "kamis"
	DayJumat  DayOfWeek = "jumat"
)

var ValidDaysOfWeek = map[DayOfWeek]bool{
	DaySenin:  true,
	DaySelasa: true,
	DayRabu:   true,
	DayKamis:  true,
	DayJumat:  true,
}

// Schedule adalah satu slot jadwal mengajar mingguan (recurring, bukan
// tanggal spesifik). TeacherClassID adalah SATU-SATUNYA reference ke
// guru+mapel+kelas+tahun ajaran — subject_id/teacher_id/class_id TIDAK
// diduplikasi di sini, harus di-resolve lewat teacher_classes untuk
// menghindari data basi kalau penugasan mengajar berubah.
type Schedule struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	TeacherClassID primitive.ObjectID `bson:"teacher_class_id" json:"teacherClassId"`

	Day DayOfWeek `bson:"day" json:"day"`

	// StartTime/EndTime: format "HH:MM" 24 jam (mis. "07:30"), BUKAN
	// time.Time penuh — ini jadwal mingguan berulang, bukan tanggal
	// spesifik. Validasi StartTime < EndTime dan validasi format dilakukan
	// di service layer.
	StartTime string `bson:"start_time" json:"startTime"`
	EndTime   string `bson:"end_time" json:"endTime"`

	Room string `bson:"room" json:"room"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}