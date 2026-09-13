package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AssessmentAnswer adalah jawaban siswa untuk SATU soal di dalam SATU
// attempt. Satu dokumen per (attempt_id, question_id).
type AssessmentAnswer struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AttemptID  primitive.ObjectID `bson:"attempt_id" json:"attemptId"`
	QuestionID primitive.ObjectID `bson:"question_id" json:"questionId"`

	// SelectedOptionIndex: HANYA diisi kalau soal ini multiple_choice.
	SelectedOptionIndex *int `bson:"selected_option_index,omitempty" json:"selectedOptionIndex,omitempty"`

	// EssayText: HANYA diisi kalau soal ini essay.
	EssayText *string `bson:"essay_text,omitempty" json:"essayText,omitempty"`

	// IsCorrect: HANYA berlaku untuk multiple_choice, dihitung otomatis
	// saat submit dengan membandingkan SelectedOptionIndex terhadap
	// AssessmentQuestion.CorrectOptionIndex. Nil untuk essay — essay tidak
	// punya konsep benar/salah biner, hanya skor.
	IsCorrect *bool `bson:"is_correct,omitempty" json:"isCorrect,omitempty"`

	// ScoreAwarded:
	//   - multiple_choice: terisi OTOMATIS saat submit (=Weight soal kalau
	//     benar, =0 kalau salah).
	//   - essay: nil sampai guru menilai manual; setelah dinilai, bisa
	//     berapa saja dari 0 sampai Weight soal (skor parsial diizinkan).
	ScoreAwarded *float64 `bson:"score_awarded,omitempty" json:"scoreAwarded,omitempty"`

	// Feedback: HANYA relevan untuk essay.
	Feedback *string `bson:"feedback,omitempty" json:"feedback,omitempty"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}