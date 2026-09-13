package repository

import (
	"context"
	"errors"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrAssessmentAnswerNotFound = errors.New("assessment answer not found")

type AssessmentAnswerRepository struct {
	collection *mongo.Collection
}

func NewAssessmentAnswerRepository(db *mongo.Database) *AssessmentAnswerRepository {
	return &AssessmentAnswerRepository{collection: db.Collection("assessment_answers")}
}

// FindByAttempt: semua jawaban dalam satu attempt (dipakai untuk review
// hasil siswa maupun layar penilaian essay guru).
func (r *AssessmentAnswerRepository) FindByAttempt(ctx context.Context, attemptID primitive.ObjectID) ([]model.AssessmentAnswer, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"attempt_id": attemptID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var answers []model.AssessmentAnswer
	if err := cursor.All(ctx, &answers); err != nil {
		return nil, err
	}
	return answers, nil
}

// UpsertAnswer menyimpan/menimpa jawaban siswa untuk satu soal selama
// attempt masih berjalan (siswa bisa ganti-ganti jawaban sebelum submit).
// Dipanggil dengan salah satu dari selectedOptionIndex ATAU essayText
// terisi, sesuai tipe soalnya — validasi kecocokan tipe soal dilakukan di
// service layer (repository ini tidak tahu AssessmentQuestion.Type).
func (r *AssessmentAnswerRepository) UpsertAnswer(ctx context.Context, attemptID, questionID primitive.ObjectID, selectedOptionIndex *int, essayText *string) error {
	now := time.Now()
	setFields := bson.M{"updatedAt": now}
	if selectedOptionIndex != nil {
		setFields["selected_option_index"] = *selectedOptionIndex
	}
	if essayText != nil {
		setFields["essay_text"] = *essayText
	}

	_, err := r.collection.UpdateOne(ctx,
		bson.M{"attempt_id": attemptID, "question_id": questionID},
		bson.M{
			"$set":         setFields,
			"$setOnInsert": bson.M{"createdAt": now},
		},
		options.Update().SetUpsert(true),
	)
	return err
}

// SetAutoGrade dipanggil service layer saat submit, untuk soal
// multiple_choice: mengisi IsCorrect & ScoreAwarded hasil perbandingan
// otomatis terhadap AssessmentQuestion.CorrectOptionIndex.
func (r *AssessmentAnswerRepository) SetAutoGrade(ctx context.Context, id primitive.ObjectID, isCorrect bool, scoreAwarded float64) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"is_correct":    isCorrect,
			"score_awarded": scoreAwarded,
			"updatedAt":     time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentAnswerNotFound
	}
	return nil
}

// GradeEssayAnswer dipanggil guru untuk menilai satu jawaban essay.
func (r *AssessmentAnswerRepository) GradeEssayAnswer(ctx context.Context, id primitive.ObjectID, scoreAwarded float64, feedback string) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"score_awarded": scoreAwarded,
			"feedback":      feedback,
			"updatedAt":     time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentAnswerNotFound
	}
	return nil
}

// EnsureIndexes: (attempt_id, question_id) unique — satu jawaban per soal
// per attempt (UpsertAnswer bergantung pada kombinasi ini untuk tahu kapan
// harus insert vs update).
func (r *AssessmentAnswerRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "attempt_id", Value: 1}, {Key: "question_id", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}