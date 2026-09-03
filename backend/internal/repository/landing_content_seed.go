package repository

import (
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
)

// DefaultLandingContent returns the seed document matching the Figma
// design confirmed for the initial launch. This is only ever inserted
// once (see EnsureSeeded) — after that, content lives in MongoDB and is
// edited via the Super Admin endpoint, not by changing this file.
func DefaultLandingContent() *model.LandingContent {
	return &model.LandingContent{
		Navbar: model.LandingNavbar{
			BrandName: "Genius Society",
		},
		Hero: model.LandingHero{
			BadgeText:        "Sistem Manajemen Pembelajaran Masa Depan",
			HeadingLine1:     "Revolusi Pembelajaran",
			HeadingLine2:     "Digital",
			HeadingHighlight: "GENIUS SOCIETY",
			Subtext:          "Tingkatkan pengalaman belajar dengan platform terintegrasi. Akses materi, kelola tugas, dan pantau perkembangan akademik secara real-time dalam lingkungan belajar yang aman dan interaktif.",
			CtaText:          "Mulai Belajar",
			CtaLink:          "/login",
		},
		Stats: []model.LandingStat{
			{Icon: "users", Value: "3000+", Label: "Siswa Aktif"},
			{Icon: "graduation-cap", Value: "150+", Label: "Guru Ahli"},
		},
		Features: model.LandingFeatures{
			Heading:    "Keunggulan Platform LMS Kami",
			Subheading: "Dirancang khusus untuk mendukung kegiatan belajar mengajar yang efektif, interaktif, dan terukur.",
			Items: []model.LandingFeatureItem{
				{Icon: "monitor-play", Title: "Interactive Learning", Description: "Materi interaktif dengan integrasi multimedia untuk meningkatkan pemahaman siswa."},
				{Icon: "clipboard-list", Title: "Assignment Management", Description: "Pengelolaan tugas terstruktur dengan tenggat waktu dan notifikasi otomatis."},
				{Icon: "file-check", Title: "Online Assessment", Description: "Sistem ujian online terintegrasi dengan berbagai tipe soal dan anti-kecurangan."},
				{Icon: "bar-chart", Title: "Learning Analytics", Description: "Pantau perkembangan akademik siswa dengan laporan komprehensif dan visual."},
				{Icon: "message-square", Title: "Discussion Forum", Description: "Ruang kolaborasi siswa dan guru untuk tanya jawab dan diskusi materi."},
				{Icon: "award", Title: "Digital Certificate", Description: "Sertifikat digital otomatis bagi siswa yang menyelesaikan modul kompeten."},
			},
		},
		Footer: model.LandingFooter{
			BrandName: "Genius Society",
			Tagline:   "Platform pembelajaran digital untuk generasi profesional masa depan.",
		},
		UpdatedAt: time.Now(),
	}
}