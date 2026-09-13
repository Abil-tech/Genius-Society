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

var ErrScheduleNotFound = errors.New("schedule not found")

type ScheduleRepository struct {
	collection *mongo.Collection
}

func NewScheduleRepository(db *mongo.Database) *ScheduleRepository {
	return &ScheduleRepository{collection: db.Collection("schedules")}
}

func (r *ScheduleRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Schedule, error) {
	var s model.Schedule
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&s)
	if err == mongo.ErrNoDocuments {
		return nil, ErrScheduleNotFound
	}
	if err != nil {
		return nil, err
	}
	return &s, nil
}

// FindByTeacherClassID: semua slot jadwal untuk satu penugasan mengajar
// (biasanya 1-2 slot per minggu).
func (r *ScheduleRepository) FindByTeacherClassID(ctx context.Context, teacherClassID primitive.ObjectID) ([]model.Schedule, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"teacher_class_id": teacherClassID, "is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var schedules []model.Schedule
	if err := cursor.All(ctx, &schedules); err != nil {
		return nil, err
	}
	return schedules, nil
}

// FindByTeacherClassIDs: batch version — dipakai service layer setelah
// resolve daftar teacher_class_id untuk satu kelas atau satu guru (lihat
// TeacherClassRepository.FindByTeacherAndYear / FindByClassSubjectYear),
// supaya bisa ambil "jadwal kelas X" atau "jadwal guru Y" dalam satu query.
func (r *ScheduleRepository) FindByTeacherClassIDs(ctx context.Context, teacherClassIDs []primitive.ObjectID) ([]model.Schedule, error) {
	opts := options.Find().SetSort(bson.D{{Key: "day", Value: 1}, {Key: "start_time", Value: 1}})
	cursor, err := r.collection.Find(ctx, bson.M{
		"teacher_class_id": bson.M{"$in": teacherClassIDs},
		"is_active":        true,
	}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var schedules []model.Schedule
	if err := cursor.All(ctx, &schedules); err != nil {
		return nil, err
	}
	return schedules, nil
}

// Create menambah satu slot jadwal. Pemanggil (service layer) WAJIB
// melakukan pengecekan bentrok (overlap) waktu untuk guru, kelas, dan
// ruangan yang sama SEBELUM memanggil ini — repository tidak melakukan
// perbandingan rentang waktu.
func (r *ScheduleRepository) Create(ctx context.Context, s *model.Schedule) error {
	now := time.Now()
	s.IsActive = true
	s.CreatedAt = now
	s.UpdatedAt = now

	res, err := r.collection.InsertOne(ctx, s)
	if err != nil {
		return err
	}
	s.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *ScheduleRepository) Update(ctx context.Context, id primitive.ObjectID, day model.DayOfWeek, startTime, endTime, room string) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{
			"day":        day,
			"start_time": startTime,
			"end_time":   endTime,
			"room":       room,
			"updatedAt":  time.Now(),
		}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrScheduleNotFound
	}
	return nil
}

func (r *ScheduleRepository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id, "is_active": true},
		bson.M{"$set": bson.M{"is_active": false, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrScheduleNotFound
	}
	return nil
}

// EnsureIndexes: (teacher_class_id, day, start_time) unique — mencegah
// entri yang benar-benar identik dobel. TIDAK mendeteksi overlap waktu
// (mis. 07:00-08:00 vs 07:30-08:30 di teacher_class_id yang sama) — itu
// wajib divalidasi di service layer sebelum Create/Update dipanggil.
func (r *ScheduleRepository) EnsureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "teacher_class_id", Value: 1}, {Key: "day", Value: 1}, {Key: "start_time", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}