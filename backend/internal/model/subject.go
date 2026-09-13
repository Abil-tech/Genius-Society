package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Subject merepresentasikan satu mata pelajaran.
type Subject struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`

	Name string `bson:"name" json:"name"`

	// Code: kode mapel, disimpan UPPERCASE, unique (mis. "MTK", "BIN").
	// Normalisasi ke uppercase dilakukan di service layer sebelum insert/update,
	// bukan di sini — model hanya representasi data.
	Code string `bson:"code" json:"code"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}