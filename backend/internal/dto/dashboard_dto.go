package dto

import "time"

// Icon dikirim sebagai STRING KEY (nama komponen Lucide, mis.
// "GraduationCap"), bukan komponen — konsisten dengan pola landing_content
// yang sudah dipakai sebelumnya. Frontend perlu tabel mapping
// string -> komponen Lucide untuk merender ini.

type DashboardStatCard struct {
	Code        string `json:"code"`
	Label       string `json:"label"`
	Value       string `json:"value"`
	Trend       string `json:"trend,omitempty"`
	TrendTone   string `json:"trendTone,omitempty"` // "positive" | "neutral" — HANYA dua nilai ini, sesuai types/Dashboard.ts
	Badge       string `json:"badge,omitempty"`
	Icon        string `json:"icon"`
	Highlighted bool   `json:"highlighted,omitempty"`
}

type DashboardMiniStatCard struct {
	Label       string `json:"label"`
	Value       string `json:"value"`
	Badge       string `json:"badge,omitempty"`
	Icon        string `json:"icon"`
	Highlighted bool   `json:"highlighted,omitempty"`
}

type DashboardActivityPoint struct {
	Day   string `json:"day"`
	Value int    `json:"value"`
}

type DashboardUserSummaryItem struct {
	Label      string `json:"label"`
	Value      int64  `json:"value"`
	Percentage int    `json:"percentage"`
	Tone       string `json:"tone"` // "orange" | "navy" | "muted"
}

// DashboardSystemNotification.Time: STRING SUDAH DIFORMAT (mis. "12 menit
// lalu"), dihitung di service layer saat response dibuat — BUKAN
// timestamp mentah. Konsekuensinya: kalau response ini di-cache di sisi
// mana pun, teks waktunya bisa jadi stale (tidak update sendiri kayak
// timestamp mentah akan bisa). Ini trade-off yang diterima supaya field
// cocok PERSIS dengan tipe frontend (time: string), bukan pilihan bebas.
type DashboardSystemNotification struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Time        string    `json:"time"`
	Tone        string    `json:"tone"`
	CreatedAt   time.Time `json:"-"`
}

type DashboardActivityLogItem struct {
	Actor     string    `json:"actor"`
	Action    string    `json:"action"`
	Detail    string    `json:"detail"`
	Tag       string    `json:"tag"`
	Time      string    `json:"time"`
	Tone      string    `json:"tone"` // "orange" | "navy" | "success" | "muted"
	CreatedAt time.Time `json:"-"`
}

type DashboardStatusRow struct {
	Category   string `json:"category"`
	Count      int64  `json:"count"`
	Percentage int    `json:"percentage"`
	Label      string `json:"label"`
	Tone       string `json:"tone"` // "success" | "warning" | "danger"
	Action     string `json:"action"`
}

type AdminDashboardResponse struct {
	MainStats           []DashboardStatCard           `json:"mainStats"`
	MiniStats           []DashboardMiniStatCard        `json:"miniStats"`
	ActivityChart       []DashboardActivityPoint       `json:"activityChart"`
	UserSummary         []DashboardUserSummaryItem     `json:"userSummary"`
	SystemNotifications []DashboardSystemNotification  `json:"systemNotifications"`
	ActivityLog         []DashboardActivityLogItem     `json:"activityLog"`
	StatusRows          []DashboardStatusRow           `json:"statusRows"`
}

type GuruSummaryDTO struct {
	TotalClasses   int `json:"totalClasses"`
	TotalSubjects  int `json:"totalSubjects"`
	ActiveTasks    int `json:"activeTasks"`
	PendingGrading int `json:"pendingGrading"`
}

type TodayScheduleDTO struct {
	ID        string `json:"id"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Subject   string `json:"subject"`
	ClassName string `json:"className"`
	Room      string `json:"room"`
	Status    string `json:"status"` // "akan_datang" | "berlangsung" | "selesai"
}

type GuruActiveTaskDTO struct {
	ID            string `json:"id"`
	Title         string `json:"title"`
	Subject       string `json:"subject"`
	ClassName     string `json:"className"`
	Deadline      string `json:"deadline"`
	Submitted     int    `json:"submitted"`
	TotalStudents int    `json:"totalStudents"`
	Status        string `json:"status"` // "aktif" | "mendekati_deadline" | "terlambat" | "selesai"
}

type PendingSubmissionDTO struct {
	ID             string `json:"id"`
	StudentName    string `json:"studentName"`
	StudentInitial string `json:"studentInitial"`
	ItemTitle      string `json:"itemTitle"`
	ClassName      string `json:"className"`
	SubmittedAt    string `json:"submittedAt"`
}

type GuruActiveAssessmentDTO struct {
	ID                string `json:"id"`
	Title             string `json:"title"`
	Subject           string `json:"subject"`
	ClassName         string `json:"className"`
	Period            string `json:"period"`
	TotalParticipants int    `json:"totalParticipants"`
	Completed         int    `json:"completed"`
}

type StudentActivityDTO struct {
	ID             string `json:"id"`
	StudentName    string `json:"studentName"`
	StudentInitial string `json:"studentInitial"`
	Action         string `json:"action"`
	ClassName      string `json:"className"`
	Time           string `json:"time"`
}

type GuruAnnouncementDTO struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Summary string `json:"summary"`
	Date    string `json:"date"`
	IsRead  bool   `json:"isRead"`
}

type HomeroomClassDTO struct {
	ClassName    string `json:"className"`
	StudentCount int    `json:"studentCount"`
}

type GuruDashboardResponse struct {
	Summary            GuruSummaryDTO            `json:"summary"`
	TodaySchedules     []TodayScheduleDTO        `json:"todaySchedules"`
	ActiveTasks        []GuruActiveTaskDTO       `json:"activeTasks"`
	PendingSubmissions []PendingSubmissionDTO    `json:"pendingSubmissions"`
	ActiveAssessments  []GuruActiveAssessmentDTO `json:"activeAssessments"`
	StudentActivities  []StudentActivityDTO      `json:"studentActivities"`
	Announcements      []GuruAnnouncementDTO     `json:"announcements"`
	HomeroomClass      *HomeroomClassDTO         `json:"homeroomClass"`
}