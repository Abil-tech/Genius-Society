package service

import (
	"context"
	"errors"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrAccountInactive = errors.New("account inactive")

type AuthService struct {
	userRepo *repository.UserRepository
}

func NewAuthService(userRepo *repository.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}

// Login: jalur EMAIL, khusus role NON-admin (guru/murid/kurikulum/kepala_sekolah).
// Admin/super_admin sengaja ditolak di sini walau email & password-nya benar —
// mereka wajib lewat LoginAdmin (adminId). Ini keputusan desain eksplisit,
// bukan bug: mencegah dua jalur otentikasi yang tumpang tindih untuk role
// yang sama, yang akan mempersulit audit & rate-limiting per jalur nantinya.
func (s *AuthService) Login(ctx context.Context, email, password string) (*model.User, error) {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if err == repository.ErrUserNotFound {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}
	if user.Role.IsAdminRole() {
		return nil, ErrInvalidCredentials // pesan generik, jangan bocorkan "pakai jalur admin"
	}
	if !user.IsActive {
		return nil, ErrAccountInactive
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}
	return user, nil
}

// LoginAdmin: jalur ADMIN ID, khusus role admin/super_admin.
func (s *AuthService) LoginAdmin(ctx context.Context, adminID, password string) (*model.User, error) {
	user, err := s.userRepo.FindByAdminID(ctx, adminID)
	if err != nil {
		if err == repository.ErrUserNotFound {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}
	if !user.Role.IsAdminRole() {
		return nil, ErrInvalidCredentials
	}
	if !user.IsActive {
		return nil, ErrAccountInactive
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}
	return user, nil
}

// GetUserByID mengambil user berdasarkan _id — dipakai untuk MEMULIHKAN
// sesi dari JWT (GET /api/auth/me), BUKAN untuk alur login/password.
// Kalau user sudah tidak ada/nonaktif, dianggap sesi tidak valid
// (ErrInvalidCredentials) — bukan error server, supaya handler bisa
// merespons 401 dan frontend tahu harus anggap belum login, bukan
// menampilkan pesan error teknis ke pengguna.
func (s *AuthService) GetUserByID(ctx context.Context, userID primitive.ObjectID) (*model.User, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if err == repository.ErrUserNotFound {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}
	return user, nil
}