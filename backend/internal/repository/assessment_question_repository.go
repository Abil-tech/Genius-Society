package repository

import (
	"context"
	"errors"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var ErrAssessmentQuestionNotFound = errors.New("assessment question not found")

type AssessmentQuestionRepository struct {
	collection *mongo.Collection
}

func NewAssessmentQuestionRepository(db *mongo.Database) *AssessmentQuestionRepository {
	return &AssessmentQuestionRepository{collection: db.Collection("assessment_questions")}
}

func (r *AssessmentQuestionRepository) FindByID(ctx context.Context, id bson.ObjectID) (*model.AssessmentQuestion, error) {
	var q model.AssessmentQuestion
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&q)
	if err == mongo.ErrNoDocuments {
		return nil, ErrAssessmentQuestionNotFound
	}
	if err != nil {
		return nil, err
	}
	return &q, nil
}

// FindByAssessment: semua soal milik satu assessment, terurut sesuai Order.
// CATATAN KEAMANAN: hasil query ini MASIH MENGANDUNG CorrectOptionIndex di
// level struct Go (json:"-" cuma memblokir serialisasi JSON, bukan
// memblokir data di memory). Kalau method ini dipanggil untuk membangun
// response ke MURID, service/handler layer WAJIB memetakan hasil ini ke
// DTO yang membuang CorrectOptionIndex — jangan andalkan json:"-" saja
// sebagai satu-satunya lapisan proteksi untuk audiens murid.
func (r *AssessmentQuestionRepository) FindByAssessment(ctx context.Context, assessmentID bson.ObjectID) ([]model.AssessmentQuestion, error) {
	opts := options.Find().SetSort(bson.D{{Key: "order", Value: 1}})
	cursor, err := r.collection.Find(ctx, bson.M{"assessment_id": assessmentID, "is_active": true}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var questions []model.AssessmentQuestion
	if err := cursor.All(ctx, &questions); err != nil {
		return nil, err
	}
	return questions, nil
}

func (r *AssessmentQuestionRepository) Create(ctx context.Context, q *model.AssessmentQuestion) error {
	q.IsActive = true
	res, err := r.collection.InsertOne(ctx, q)
	if err != nil {
		return err
	}
	q.ID = res.InsertedID.(bson.ObjectID)
	return nil
}

func (r *AssessmentQuestionRepository) SoftDelete(ctx context.Context, id bson.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentQuestionNotFound
	}
	return nil
}

// Update: guru edit soal — text, weight, order, options, correct_option_index.
func (r *AssessmentQuestionRepository) Update(ctx context.Context, id bson.ObjectID, q *model.AssessmentQuestion) error {
	update := bson.M{
		"$set": bson.M{
			"text":   q.Text,
			"weight": q.Weight,
			"order":  q.Order,
		},
	}
	if len(q.Options) > 0 {
		update["$set"].(bson.M)["options"] = q.Options
		update["$set"].(bson.M)["correct_option_index"] = q.CorrectOptionIndex
	}

	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		update,
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrAssessmentQuestionNotFound
	}
	return nil
}

// EnsureIndexes: index pada assessment_id (bukan unique — satu assessment
// wajar punya banyak soal).
func (r *AssessmentQuestionRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "assessment_id", Value: 1}}},
	})
	return err
}
