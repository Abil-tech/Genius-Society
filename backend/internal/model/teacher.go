package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Teacher adalah profil akademik tambahan untuk user ber-role guru.
// Referensi ke User lewat UserID (1:1) — Username (GS-GRU-###) tetap di
// User, bukan di sini.
//
// Mata pelajaran yang diajar & kelas yang diajar SENGAJA TIDAK ada di sini
// — itu ditentukan lewat teacher_subjects & teacher_classes (many-to-many),
// bukan field langsung di Teacher. Status Walas juga TIDAK ada di sini —
// itu ditentukan lewat Class.WalasID (lihat model.Class), karena walas
// adalah atribut dari suatu kelas, bukan dari guru secara umum.
type Teacher struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"user_id" json:"userId"`

	// NIP: Nomor Induk Pegawai, hanya berlaku untuk guru PNS. Pointer +
	// opsional karena guru honorer/kontrak umumnya tidak punya NIP.
	NIP *string `bson:"nip,omitempty" json:"nip,omitempty"`

	JoinDate time.Time `bson:"join_date" json:"joinDate"`

	// IsActive: soft-delete flag untuk profil ini.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}