package dto

// SuccessResponse: format sukses konsisten untuk seluruh endpoint.
type SuccessResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}

// ErrorResponse: HARUS dipakai untuk semua error response, supaya cocok
// dengan ApiErrorResponse di frontend (src/services/api.ts).
type ErrorResponse struct {
	Success bool                `json:"success"`
	Message string              `json:"message"`
	Errors  map[string][]string `json:"errors,omitempty"`
}

func Success(data interface{}) SuccessResponse {
	return SuccessResponse{Success: true, Data: data}
}

func Error(message string) ErrorResponse {
	return ErrorResponse{Success: false, Message: message}
}