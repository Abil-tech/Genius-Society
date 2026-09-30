package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// LoginEvent mencatat SATU kali user berhasil login. Ini log immutable —
// TIDAK ada IsActive/soft-delete/UpdatedAt seperti collection lain, karena
// entry log tidak pernah diedit, cuma dibaca untuk agregasi (grafik
// aktivitas). Dicatat otomatis oleh AuthHandler setiap issueSession
// berhasil.
type LoginEvent struct {
	ID     bson.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID bson.ObjectID `bson:"user_id" json:"userId"`
	Role   Role               `bson:"role" json:"role"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
}