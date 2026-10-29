export type Kelas = 1 | 2 | 3 | 4 | 5 | 6;
export type Tingkat = "mudah" | "sedang" | "sulit";
export type PilihanTingkat = Tingkat | "campuran";
export type Huruf = "A" | "B" | "C" | "D";
export type ModeSesi = "latihan" | "simulasi" | "ulang" | "osn" | "paket";

export type Bahasa = "id" | "en" | "zh";
export type Teks3 = Record<Bahasa, string>;

export interface TeksSoal {
  pertanyaan: string;
  pilihan: Record<Huruf, string>;
  pembahasan: string[];
  /** gambar bantu khusus bahasa ini (bila labelnya berbeda) */
  visual?: SpesVisual;
}

/** Spesifikasi gambar bantu: { j: jenis, ...data }. Lihat components/Visualisasi.tsx */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SpesVisual = { j: string; [k: string]: any };

/** Satu soal di bank soal. Teks boleh memuat rumus KaTeX di antara tanda $...$ */
export interface Soal {
  id: string;
  kelas: Kelas;
  kategori: string;
  topik: Teks3;
  tingkat: Tingkat;
  kunci: Huruf;
  teks: Record<Bahasa, TeksSoal>;
  /** id paket olimpiade, jika soal berasal dari paket */
  paket?: string;
  /** catatan bila pilihan di dokumen asli diperbaiki */
  koreksi?: Teks3;
  /** gambar bantu soal */
  visual?: SpesVisual;
}

export interface MetaPaket {
  id: string;
  judul: Teks3;
  deskripsi: Teks3;
  total: number;
  kelas: Kelas[];
}

export interface Paket {
  id: string;
  judul: Teks3;
  deskripsi: Teks3;
  soal: Soal[];
}

export interface MetaKelas {
  total: number;
  tingkat: Partial<Record<Tingkat, number>>;
  kategori: Record<string, number>;
  topik: { nama: Teks3; jumlah: number }[];
}
export interface MetaBank {
  dibuat: string;
  kelas: Record<string, MetaKelas>;
  paket: MetaPaket[];
}

export interface PengaturanSesi {
  kelas: Kelas;
  tingkat: PilihanTingkat;
  mode: ModeSesi;
  durasiMenit: number;
  paket?: string;
}

export interface RiwayatSesi {
  id: string;
  tanggal: string;
  kelas: Kelas;
  tingkat: PilihanTingkat;
  mode: ModeSesi;
  paket?: string;
  dijawab: number;
  benar: number;
  salah: number;
  dilewati: number;
  skor: number;
  durasiDetik: number;
}

export interface Hitungan {
  dijawab: number;
  benar: number;
}

export interface Progres {
  versi: 1;
  nama: string;
  totalDijawab: number;
  totalBenar: number;
  totalSalah: number;
  totalDilewati: number;
  skor: number;
  waktuDetik: number;
  streak: number;
  streakTerbaik: number;
  benarSulit: number;
  diperbaiki: number;
  simulasiSelesai: number;
  sesiSempurna: number;
  poolTuntas: number;
  kelasDicoba: Kelas[];
  /** id soal yang sudah dikerjakan pada putaran berjalan, per kelompok soal */
  sudahDikerjakan: Record<string, string[]>;
  salahIds: string[];
  riwayat: RiwayatSesi[];
  badge: Record<string, string>;
  perKelas: Record<string, Hitungan>;
  perTingkat: Record<Tingkat, Hitungan>;
}
