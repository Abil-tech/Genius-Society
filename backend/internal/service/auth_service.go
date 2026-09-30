package service

import (
	"context"
	"errors"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
	"go.mongodb.org/mongo-driver/v2/bson"
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

// Login: jalur USERNAME, khusus role NON-admin (guru/murid/kurikulum/kepala_sekolah).
// Admin/super_admin sengaja ditolak di sini walau username & password-nya benar —
// mereka wajib lewat LoginAdmin (adminId).
func (s *AuthService) Login(ctx context.Context, username, password string) (*model.User, error) {
	user, err := s.userRepo.FindByUsername(ctx, username)
	if err != nil {
		if err == repository.ErrUserNotFound {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}
	if user.Role.IsAdminRole() {
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
func (s *AuthService) GetUserByID(ctx context.Context, userID bson.ObjectID) (*model.User, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if err == repository.ErrUserNotFound {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}
	return user, nil
}
