package model

// Counter merepresentasikan satu dokumen sequence counter di collection
// "counters". Satu dokumen per key (per role), mis.:
//   {_id: "GS-GRU", seq: 5}   -> guru berikutnya adalah GS-GRU-006
//   {_id: "GS-KUR", seq: 0}   -> kurikulum berikutnya adalah GS-KUR-001
//   {_id: "GS-KPS", seq: 2}   -> kepala sekolah berikutnya adalah GS-KPS-003
//   {_id: "ADM",    seq: 1}   -> admin/super_admin berikutnya adalah ADM-000002
//
// _id dipakai sebagai key (bukan ObjectID) karena counter tidak butuh
// identitas dokumen terpisah dari keynya sendiri — ini pola standar
// MongoDB untuk auto-increment counter.
type Counter struct {
	ID  string `bson:"_id"`
	Seq int64  `bson:"seq"`
}

// Key constants untuk setiap role yang butuh auto-generated username.
// Murid TIDAK punya key di sini karena username murid adalah NISN yang
// diinput manual, bukan auto-increment.
const (
	CounterKeyAdmin         = "ADM"
	CounterKeyGuru          = "GS-GRU"
	CounterKeyKurikulum     = "GS-KUR"
	CounterKeyKepalaSekolah = "GS-KPS"
)