package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// SystemEventTone menentukan warna badge saat ditampilkan di frontend.
type SystemEventTone string

const (
	SystemEventToneNavy   SystemEventTone = "navy"
	SystemEventToneOrange SystemEventTone = "orange"
	SystemEventToneMuted  SystemEventTone = "muted"
)

// SystemEvent adalah SATU kejadian sistem umum (bukan notifikasi pribadi
// satu user) — mis. "Jadwal 11 IPS 3 diperbarui", "Assessment baru
// dibuat". Immutable log, sama seperti LoginEvent.
//
// BELUM DIPANGGIL DARI MANA PUN saat ini — handler untuk jadwal/
// assessment/materi/dll belum ditulis. Begitu handler-handler itu dibuat,
// sisipkan pemanggilan Record() di titik yang relevan (mis. setelah
// ScheduleRepository.Create berhasil). Sampai saat itu, feed di dashboard
// akan tampil kosong — itu bukan bug.
type SystemEvent struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Tone        SystemEventTone    `bson:"tone" json:"tone"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
}