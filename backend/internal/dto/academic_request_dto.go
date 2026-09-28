package dto

// Request DTOs for Class CRUD
type CreateClassRequest struct {
    Name         string `json:"name" binding:"required"`
    GradeLevel   int    `json:"gradeLevel" binding:"required"`
    Capacity     int    `json:"capacity" binding:"required"`
    AcademicYear string `json:"academicYear" binding:"required"`
    Major        string `json:"major" binding:"required"`
    HomeroomTeacher string `json:"homeroomTeacher" binding:"required"`
    Status       string `json:"status" binding:"required,oneof=aktif nonaktif"`
}

type UpdateClassRequest struct {
    Name         *string `json:"name"`
    GradeLevel   *int    `json:"gradeLevel"`
    Capacity     *int    `json:"capacity"`
    Major        *string `json:"major"`
    HomeroomTeacher *string `json:"homeroomTeacher"`
    Status       *string `json:"status"`
}

// Request DTOs for Curriculum CRUD (assuming similar fields)
type CreateCurriculumRequest struct {
    Name        string `json:"name" binding:"required"`
    Description string `json:"description"`
    AcademicYear string `json:"academicYear" binding:"required"`
    // Add other fields as needed
}

type UpdateCurriculumRequest struct {
    Name        *string `json:"name"`
    Description *string `json:"description"`
    // Add other fields as needed
}

// Request DTOs for Assignment CRUD
type CreateAssignmentRequest struct {
    Title       string   `json:"title" binding:"required"`
    Description string   `json:"description"`
    TeacherID   string   `json:"teacherId" binding:"required"`
    ClassIDs    []string `json:"classIds" binding:"required"`
    SubjectID   string   `json:"subjectId" binding:"required"`
    StartDate   string   `json:"startDate" binding:"required"`
    Deadline    string   `json:"deadline" binding:"required"`
    Status      string   `json:"status"`
}

type UpdateAssignmentRequest struct {
    Title       *string   `json:"title"`
    Description *string   `json:"description"`
    TeacherID   *string   `json:"teacherId"`
    ClassIDs    *[]string `json:"classIds"`
    SubjectID   *string   `json:"subjectId"`
    StartDate   *string   `json:"startDate"`
    Deadline    *string   `json:"deadline"`
    Status      *string   `json:"status"`
}
