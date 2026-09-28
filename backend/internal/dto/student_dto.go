package dto

type StudentStatsResponse struct {
	Total        int64 `json:"total"`
	Active       int64 `json:"active"`
	Inactive     int64 `json:"inactive"`
	TotalClasses int64 `json:"totalClasses"`
}

type StudentResponse struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	NIS             string `json:"nis"`
	NISN            string `json:"nisn"`
	NIK             string `json:"nik"`
	Gender          string `json:"gender"`
	BirthPlace      string `json:"birthPlace"`
	BirthDate       string `json:"birthDate"`
	Phone           string `json:"phone"`
	Address         string `json:"address"`
	ClassName       string `json:"className"`
	Major           string `json:"major"`
	Grade           int    `json:"grade"`
	AcademicYear    string `json:"academicYear"`
	HomeroomTeacher string `json:"homeroomTeacher"`
	Status          string `json:"status"` // "aktif" | "nonaktif"
	Username        string `json:"username"`
	LastLogin       string `json:"lastLogin"`
	CreatedAt       string `json:"createdAt"`
}

type StudentPageResponse struct {
	Stats    StudentStatsResponse `json:"stats"`
	Students []StudentResponse    `json:"students"`
}

type CreateStudentRequest struct {
	Name         string `json:"name" binding:"required"`
	NIS          string `json:"nis"`
	NISN         string `json:"nisn"`
	NIK          string `json:"nik"`
	Gender       string `json:"gender"`
	BirthPlace   string `json:"birthPlace"`
	BirthDate    string `json:"birthDate"`
	Email        string `json:"email" binding:"required,email"`
	Phone        string `json:"phone"`
	Address      string `json:"address"`
	ClassName    string `json:"className"`
	Major        string `json:"major"`
	Grade        int    `json:"grade"`
	AcademicYear string `json:"academicYear"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	Status       string `json:"status"`
}

type UpdateStudentRequest struct {
	Name         string `json:"name" binding:"required"`
	NIS          string `json:"nis"`
	NISN         string `json:"nisn"`
	NIK          string `json:"nik"`
	Gender       string `json:"gender"`
	BirthPlace   string `json:"birthPlace"`
	BirthDate    string `json:"birthDate"`
	Email        string `json:"email" binding:"required,email"`
	Phone        string `json:"phone"`
	Address      string `json:"address"`
	ClassName    string `json:"className"`
	Major        string `json:"major"`
	Grade        int    `json:"grade"`
	AcademicYear string `json:"academicYear"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	Status       string `json:"status"`
}
