package dto

type StudentSimple struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SubjectTeacherSimple struct {
	Code    string `json:"code"`
	Name    string `json:"name"`
	Teacher string `json:"teacher"`
}

type ClassResponse struct {
	ID              string                 `json:"id"`
	Name            string                 `json:"name"`
	Grade           int                    `json:"grade"`
	Major           string                 `json:"major,omitempty"`
	AcademicYear    string                 `json:"academicYear"`
	HomeroomTeacher string                 `json:"homeroomTeacher,omitempty"`
	Capacity        int                    `json:"capacity"`
	Status          string                 `json:"status"` // 'aktif' | 'nonaktif'
	Students        []StudentSimple        `json:"students"`
	Subjects        []SubjectTeacherSimple `json:"subjects"`
}

type ClassPageResponse struct {
	Classes []ClassResponse `json:"classes"`
}

type TeacherSimple struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ClassSimple struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CurriculumSimple struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SubjectResponse struct {
	ID          string             `json:"id"`
	Code        string             `json:"code"`
	Name        string             `json:"name"`
	Group       string             `json:"group"`
	Grades      []int              `json:"grades"`
	Status      string             `json:"status"`
	Teachers    []TeacherSimple    `json:"teachers"`
	Classes     []ClassSimple      `json:"classes"`
	Curriculums []CurriculumSimple `json:"curriculums"`
}

type SubjectPageResponse struct {
	Subjects []SubjectResponse `json:"subjects"`
}

type AssignmentResponse struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	Teacher      string   `json:"teacher"`
	Subject      string   `json:"subject"`
	ClassNames   []string `json:"classNames"`
	StartDate    string   `json:"startDate"`
	Deadline     string   `json:"deadline"`
	Status       string   `json:"status"` // 'berlangsung' | 'selesai' | 'diarsipkan'
	AcademicYear string   `json:"academicYear"`
}

type AssignmentPageResponse struct {
	Assignments []AssignmentResponse `json:"assignments"`
}
