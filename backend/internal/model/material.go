package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// FileMetadata adalah metadata file yang disimpan di Cloudflare R2 — BUKAN
// file binary-nya sendiri (sesuai section 15 spec: file tidak boleh
// disimpan di MongoDB). Upload/delete aktual ke R2 belum diimplementasikan
// di sesi ini; struct ini hanya mendefinisikan bentuk data yang akan
// disimpan setelah proses upload berhasil dilakukan di layer storage.
type FileMetadata struct {
	Key       string `bson:"key" json:"key"`               // object key di R2, generated saat upload
	FileName  string `bson:"file_name" json:"fileName"`     // nama file asli
	SizeBytes int64  `bson:"size_bytes" json:"sizeBytes"`
	MimeType  string `bson:"mime_type" json:"mimeType"`
}

// Material merepresentasikan satu materi ajar. Bisa punya File, Link,
// keduanya, atau salah satu — validasi "minimal salah satu harus ada"
// dilakukan di service layer, bukan di model.
//
// ClassIDs adalah array karena satu materi bisa diberikan ke beberapa kelas
// sekaligus (section 5 spec). Tidak ada AcademicYearID terpisah di sini —
// itu implisit lewat kelas mana saja yang ada di ClassIDs (setiap Class
// sudah terikat ke satu academic_year_id).
type Material struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`

	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	SubjectID   primitive.ObjectID `bson:"subject_id" json:"subjectId"`
	TeacherID   primitive.ObjectID `bson:"teacher_id" json:"teacherId"`

	ClassIDs []primitive.ObjectID `bson:"class_ids" json:"classIds"`

	File *FileMetadata `bson:"file,omitempty" json:"file,omitempty"`
	Link *string       `bson:"link,omitempty" json:"link,omitempty"`

	// PublishDate: kapan materi ini terlihat oleh murid. Sengaja dipisah
	// dari CreatedAt supaya guru bisa membuat materi lebih dulu (draft)
	// dan menjadwalkan publikasinya di tanggal lain. Filter
	// "publish_date <= now" WAJIB diterapkan di query yang diakses murid,
	// TIDAK di query yang diakses guru (guru harus tetap bisa lihat draft
	// miliknya sendiri).
	PublishDate time.Time `bson:"publish_date" json:"publishDate"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}