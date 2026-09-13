package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestionType string

const (
	QuestionMultipleChoice QuestionType = "multiple_choice"
	QuestionEssay          QuestionType = "essay"
)

var ValidQuestionTypes = map[QuestionType]bool{
	QuestionMultipleChoice: true,
	QuestionEssay:          true,
}

// QuestionOption adalah satu opsi jawaban pilihan ganda. Tidak punya _id
// sendiri — diakses lewat posisi index-nya di dalam array Options.
type QuestionOption struct {
	Text string `bson:"text" json:"text"`
}

// AssessmentQuestion adalah satu soal di dalam suatu Assessment.
type AssessmentQuestion struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AssessmentID primitive.ObjectID `bson:"assessment_id" json:"assessmentId"`

	Type QuestionType `bson:"type" json:"type"`
	Text string       `bson:"text" json:"text"`

	// Weight: bobot soal ini terhadap skor total assessment. Validasi
	// "total Weight semua soal = 100" dilakukan di service layer saat
	// assessment mau dipublish/dikunci, bukan di sini.
	Weight float64 `bson:"weight" json:"weight"`

	// Options: HANYA diisi kalau Type == QuestionMultipleChoice.
	Options []QuestionOption `bson:"options,omitempty" json:"options,omitempty"`

	// CorrectOptionIndex: index jawaban benar di Options, HANYA diisi
	// kalau Type == QuestionMultipleChoice.
	//
	// json:"-" SENGAJA dipasang sebagai pertahanan berlapis supaya field
	// ini TIDAK PERNAH ter-serialize secara tidak sengaja lewat
	// json.Marshal(model.AssessmentQuestion{...}) — termasuk kalau nanti
	// ada handler baru yang lupa memakai DTO. Konsekuensinya: kalau guru
	// perlu melihat/mengedit kunci jawaban di frontend, service/handler
	// layer WAJIB membuat DTO terpisah yang secara eksplisit menyertakan
	// field ini — jangan marshal struct ini langsung untuk response guru.
	CorrectOptionIndex *int `bson:"correct_option_index,omitempty" json:"-"`

	// Order: urutan tampil soal di dalam assessment.
	Order int `bson:"order" json:"order"`

	IsActive bool `bson:"is_active" json:"isActive"`
}