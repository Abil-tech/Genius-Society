package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NotificationType string

const (
	NotificationAssignmentNew  NotificationType = "assignment_new"  // Tugas baru
	NotificationAssessmentNew  NotificationType = "assessment_new"  // Assessment baru
	NotificationDeadlineNotice NotificationType = "deadline_notice" // Deadline
	NotificationGradePublished NotificationType = "grade_published" // Nilai keluar
	NotificationMaterialNew    NotificationType = "material_new"    // Materi baru
	NotificationAnnouncement   NotificationType = "announcement"    // Pengumuman
)

var ValidNotificationTypes = map[NotificationType]bool{
	NotificationAssignmentNew:  true,
	NotificationAssessmentNew:  true,
	NotificationDeadlineNotice: true,
	NotificationGradePublished: true,
	NotificationMaterialNew:    true,
	NotificationAnnouncement:   true,
}

// Notification adalah satu notifikasi untuk SATU user penerima. Untuk
// pengumuman yang ditujukan ke banyak user sekaligus, service layer harus
// membuat satu dokumen TERPISAH per penerima (fan-out saat create) —
// bukan satu dokumen dengan banyak UserID, supaya status read/unread bisa
// berbeda per penerima.
type Notification struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"user_id" json:"userId"`

	Type    NotificationType `bson:"type" json:"type"`
	Title   string           `bson:"title" json:"title"`
	Message string           `bson:"message" json:"message"`

	// LinkPath: path relatif opsional untuk deep-link saat notifikasi
	// diklik (mis. "/student/assignments/64f...").
	LinkPath *string `bson:"link_path,omitempty" json:"linkPath,omitempty"`

	IsRead bool       `bson:"is_read" json:"isRead"`
	ReadAt *time.Time `bson:"read_at,omitempty" json:"readAt,omitempty"`

	// IsActive: soft-delete flag.
	IsActive bool `bson:"is_active" json:"isActive"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}