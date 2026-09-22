import type { Role } from '../types/auth'

// roleLabel: label tampilan Bahasa Indonesia untuk setiap Role. Dipakai di
// mana pun role user perlu ditampilkan ke pengguna (AdminSidebar, badge
// role, dsb.) — satu sumber kebenaran supaya labelnya konsisten di semua
// tempat, tidak ada yang menulis ulang string "Kepala Sekolah" secara
// terpisah-pisah.
export const roleLabel: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  guru: 'Guru',
  murid: 'Murid',
  kurikulum: 'Kurikulum',
  kepala_sekolah: 'Kepala Sekolah',
}