package dto

// PersonnelHomeroom cocok dengan Personnel.homeroom di frontend
// (types/Personnel.ts).
type PersonnelHomeroom struct {
	IsHomeroom bool    `json:"isHomeroom"`
	ClassName  *string `json:"className,omitempty"`
}

// PersonnelResponse cocok PERSIS dengan interface Personnel di frontend.
// "type" hanya bernilai "guru" atau "staf" — "staf" di sini adalah
// gabungan role kurikulum + kepala_sekolah (BUKAN role baru di database,
// murni pengelompokan tampilan, sesuai keputusan Anda).
type PersonnelResponse struct {
	NIP        string            `json:"nip"`
	Name       string            `json:"name"`
	Email      string            `json:"email"`
	Initials   string            `json:"initials"`
	AvatarTone string            `json:"avatarTone"`
	Type       string            `json:"type"` // "guru" | "staf"
	Role       string            `json:"role"`
	Assignment string            `json:"assignment"`
	Homeroom   PersonnelHomeroom `json:"homeroom"`
	Status     string            `json:"status"` // "aktif" | "nonaktif"
}

// PersonnelStatsResponse dipakai untuk 4 kartu statistik di atas tabel.
type PersonnelStatsResponse struct {
	TotalGuru     int     `json:"totalGuru"`
	TotalStaf     int     `json:"totalStaf"`
	GuruAktif     int     `json:"guruAktif"`
	StafAktif     int     `json:"stafAktif"`
	GuruAktifRate float64 `json:"guruAktifRate"` // persentase, mis. 94.2
	StafAktifRate float64 `json:"stafAktifRate"`
}

// PersonnelPageResponse adalah bentuk response GABUNGAN untuk satu kali
// panggilan endpoint (stats + list sekaligus), supaya frontend tidak perlu
// dua request terpisah untuk memuat satu halaman.
type PersonnelPageResponse struct {
	Stats     PersonnelStatsResponse `json:"stats"`
	Personnel []PersonnelResponse    `json:"personnel"`
}