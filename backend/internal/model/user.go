package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Role string

const (
	RoleSuperAdmin    Role = "super_admin"
	RoleAdmin         Role = "admin"
	RoleGuru          Role = "guru"
	RoleMurid         Role = "murid"
	RoleKurikulum     Role = "kurikulum"
	RoleKepalaSekolah Role = "kepala_sekolah"
)

var ValidRoles = map[Role]bool{
	RoleSuperAdmin:    true,
	RoleAdmin:         true,
	RoleGuru:          true,
	RoleMurid:         true,
	RoleKurikulum:     true,
	RoleKepalaSekolah: true,
}

// IsAdminRole: role yang login lewat jalur adminId (ADM-000000), bukan Username.
func (r Role) IsAdminRole() bool {
	return r == RoleAdmin || r == RoleSuperAdmin
}

type User struct {
	ID   primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name string             `bson:"name" json:"name"`

	// Email: WAJIB diisi untuk SEMUA role (termasuk murid), tapi TIDAK
	// dipakai untuk login non-admin lagi — sekarang murni untuk kontak/
	// notifikasi. Unique tetap dijaga supaya satu email tidak dipakai lebih
	// dari satu akun.
	Email string `bson:"email" json:"email"`

	PasswordHash string `bson:"password_hash" json:"-"`
	Role         Role   `bson:"role" json:"role"`
	IsActive     bool   `bson:"is_active" json:"isActive"`

	// AdminID: HANYA diisi untuk role admin/super_admin, format "ADM-000000".
	// Pointer supaya field ini benar-benar absen di dokumen untuk user
	// non-admin (dibutuhkan agar sparse unique index bekerja).
	AdminID *string `bson:"admin_id,omitempty" json:"adminId,omitempty"`

	// Username: identifier LOGIN untuk role NON-ADMIN (guru, kurikulum,
	// kepala_sekolah, murid). Format:
	//   - guru            -> "GS-GRU-001" (auto-generated via counters)
	//   - kurikulum       -> "GS-KUR-001" (auto-generated via counters)
	//   - kepala_sekolah  -> "GS-KPS-001" (auto-generated via counters)
	//   - murid           -> NISN 10 digit (input manual saat pembuatan akun,
	//                        BUKAN dari counters)
	// Kosong (nil) untuk admin/super_admin — mereka pakai AdminID, bukan ini.
	// Pointer dengan alasan yang sama seperti AdminID: field harus absen
	// (bukan string kosong) di dokumen admin/super_admin agar sparse unique
	// index tidak salah anggap banyak dokumen "sama-sama kosong" sebagai
	// duplikat.
	//
	// EDITABILITY: khusus untuk role murid (NISN), field ini boleh diubah
	// SETELAH akun dibuat, tapi HANYA oleh admin/super_admin — validasi role
	// pelaku perubahan dilakukan di service/handler layer, bukan di model.
	Username *string `bson:"username,omitempty" json:"username,omitempty"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}