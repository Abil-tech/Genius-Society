package seed

import (
	"context"
	"fmt"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/repository"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// SeedSampleAdmin menyisipkan SATU akun Admin biasa (role admin, BUKAN
// super_admin). Admin login pakai AdminID (format ADM-XXXXXX), sama
// seperti Super Admin — bukan Username seperti guru/kurikulum/kepala
// sekolah.
//
// IDEMPOTENT lewat SATU gerbang: kalau user dengan Email di bawah SUDAH
// ADA, fungsi langsung return nil (pola sama seperti SeedSampleGuru &
// EnsureDevSeed).
//
// HANYA untuk development — JANGAN dipanggil di jalur production.
func SeedSampleAdmin(ctx context.Context, db *mongo.Database) error {
	userRepo := repository.NewUserRepository(db)
	counterRepo := repository.NewCounterRepository(db)

	const email = "admin@genius.sch.id"

	if _, err := userRepo.FindByEmail(ctx, email); err == nil {
		return nil // sudah pernah di-seed sebelumnya, jangan diulang
	} else if err != repository.ErrUserNotFound {
		return fmt.Errorf("cek user existing: %w", err)
	}

	// WAJIB dipanggil SEBELUM NextUsername — lihat penjelasan di
	// counter_repository.go. Dev seed Super Admin hardcode "ADM-000001"
	// tanpa lewat counter, jadi counter perlu disinkronkan dulu ke minimal
	// seq=1 supaya ID admin baru ini jadi "ADM-000002", bukan bentrok lagi
	// generate "ADM-000001".
	if err := counterRepo.EnsureMinimum(ctx, model.CounterKeyAdmin, 1); err != nil {
		return fmt.Errorf("sync counter admin: %w", err)
	}

	adminID, err := counterRepo.NextUsername(ctx, model.CounterKeyAdmin)
	if err != nil {
		return fmt.Errorf("generate admin id: %w", err)
	}

	// Password dev default "Admin123!" — HANYA untuk development, JANGAN
	// pernah dipakai sebagai default di production.
	passwordHash, err := bcrypt.GenerateFromPassword([]byte("Admin123!"), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}

	user := &model.User{
		Name:         "Admin Sekolah",
		Email:        email,
		PasswordHash: string(passwordHash),
		Role:         model.RoleAdmin,
		AdminID:      &adminID,
	}
	if err := userRepo.Create(ctx, user); err != nil {
		return fmt.Errorf("create admin user: %w", err)
	}

	return nil
}