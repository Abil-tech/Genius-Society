package repository

import (
	"context"
	"fmt"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CounterRepository struct {
	collection *mongo.Collection
}

func NewCounterRepository(db *mongo.Database) *CounterRepository {
	return &CounterRepository{collection: db.Collection("counters")}
}

// nextSequence menaikkan seq untuk key tertentu secara ATOMIK menggunakan
// findOneAndUpdate + $inc, dengan upsert=true (dokumen counter dibuat
// otomatis dengan seq=1 kalau belum pernah ada untuk key ini).
//
// Atomicity di sini dijamin oleh MongoDB sendiri di level satu dokumen —
// TIDAK butuh transaction, TIDAK butuh lock manual di kode Go. Dua request
// bersamaan yang memanggil nextSequence(ctx, "GS-GRU") dijamin mendapat
// nilai seq yang berbeda (mis. satu dapat 5, satu dapat 6), tidak pernah
// dapat nilai yang sama.
func (r *CounterRepository) nextSequence(ctx context.Context, key string) (int64, error) {
	var result model.Counter
	after := options.After
	err := r.collection.FindOneAndUpdate(
		ctx,
		bson.M{"_id": key},
		bson.M{"$inc": bson.M{"seq": int64(1)}},
		&options.FindOneAndUpdateOptions{
			ReturnDocument: &after,
			Upsert:         boolPtr(true),
		},
	).Decode(&result)
	if err != nil {
		return 0, err
	}
	return result.Seq, nil
}

// EnsureMinimum menjamin seq untuk key ini MINIMAL sebesar minValue, TANPA
// PERNAH menurunkan nilai yang sudah ada — aman dipanggil berkali-kali
// (idempotent). Dipakai untuk menyinkronkan counter dengan ID yang sudah
// dibuat manual/hardcoded SEBELUM counter ini pernah dipakai (mis. dev
// seed Super Admin "ADM-000001" yang ditulis langsung ke database, tidak
// lewat NextUsername) — supaya panggilan NextUsername berikutnya tidak
// menghasilkan ID yang bentrok dengan yang sudah ada.
func (r *CounterRepository) EnsureMinimum(ctx context.Context, key string, minValue int64) error {
	_, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": key},
		bson.M{"$max": bson.M{"seq": minValue}},
		options.Update().SetUpsert(true),
	)
	return err
}

// NextUsername mengembalikan username berikutnya yang sudah diformat sesuai
// key-nya (padding digit berbeda per role — lihat komentar di model.Counter).
// Ini SATU-SATUNYA tempat yang boleh menentukan lebar padding, supaya tidak
// ada inkonsistensi format antara satu pemanggil dengan pemanggil lain.
//
// PENTING: fungsi ini hanya menghasilkan STRING username. Pengecekan bahwa
// username hasilnya benar-benar belum dipakai tetap dijamin oleh unique
// index pada users.username (bukan oleh fungsi ini) — kalau index itu belum
// dibuat, uniqueness TIDAK terjamin.
func (r *CounterRepository) NextUsername(ctx context.Context, key string) (string, error) {
	seq, err := r.nextSequence(ctx, key)
	if err != nil {
		return "", err
	}

	switch key {
	case model.CounterKeyAdmin:
		return fmt.Sprintf("ADM-%06d", seq), nil
	case model.CounterKeyGuru, model.CounterKeyKurikulum, model.CounterKeyKepalaSekolah:
		return fmt.Sprintf("%s-%03d", key, seq), nil
	default:
		return "", fmt.Errorf("counter: unknown key %q", key)
	}
}

func boolPtr(b bool) *bool {
	return &b
}