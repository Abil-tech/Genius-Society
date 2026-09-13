package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ProjectSubmission strukturnya identik dengan AssignmentSubmission
// (SATU dokumen per (project, student); resubmit meng-update dokumen yang
// sama, per keputusan Anda: sama seperti kebijakan assignment).
type ProjectSubmission struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProjectID primitive.ObjectID `bson:"project_id" json:"projectId"`
	StudentID primitive.ObjectID `bson:"student_id" json:"studentId"`

	File *FileMetadata `bson:"file,omitempty" json:"file,omitempty"`

	SubmittedAt time.Time `bson:"submitted_at" json:"submittedAt"`
	IsLate      bool      `bson:"is_late" json:"isLate"`

	AttemptNumber int  `bson:"attempt_number" json:"attemptNumber"`
	AllowResubmit bool `bson:"allow_resubmit" json:"allowResubmit"`

	Score             *float64            `bson:"score,omitempty" json:"score,omitempty"`
	Feedback          *string             `bson:"feedback,omitempty" json:"feedback,omitempty"`
	GradedAt          *time.Time          `bson:"graded_at,omitempty" json:"gradedAt,omitempty"`
	GradedByTeacherID *primitive.ObjectID `bson:"graded_by_teacher_id,omitempty" json:"gradedByTeacherId,omitempty"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}