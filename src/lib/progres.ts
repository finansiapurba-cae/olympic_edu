import type { Kelas, ModeSesi, PengaturanSesi, Progres, RiwayatSesi, Soal, Tingkat } from "../types";

const KUNCI = "kms-progres-v1";
export const POIN: Record<Tingkat, number> = { mudah: 10, sedang: 20, sulit: 30 };
const MAKS_RIWAYAT = 200;

export function progresBaru(nama = ""): Progres {
  return {
    versi: 1,
    nama,
    totalDijawab: 0,
    totalBenar: 0,
    totalSalah: 0,
    totalDilewati: 0,
    skor: 0,
    waktuDetik: 0,
    streak: 0,
    streakTerbaik: 0,
    benarSulit: 0,
    diperbaiki: 0,
    simulasiSelesai: 0,
    sesiSempurna: 0,
    poolTuntas: 0,
    kelasDicoba: [],
    sudahDikerjakan: {},
    salahIds: [],
    riwayat: [],
    badge: {},
    perKelas: {},
    perTingkat: { mudah: { dijawab: 0, benar: 0 }, sedang: { dijawab: 0, benar: 0 }, sulit: { dijawab: 0, benar: 0 } },
  };
}

export function muatProgres(): Progres {
  try {
    const raw = localStorage.getItem(KUNCI);
    if (!raw) return progresBaru();
    const data = JSON.parse(raw) as Partial<Progres>;
    if (data.versi !== 1) return progresBaru();
    return { ...progresBaru(), ...data };
  } catch {
    return progresBaru();
  }
}

export function simpanProgres(p: Progres) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(p));
  } catch {
    /* penyimpanan tidak tersedia (mode privat), progres hanya bertahan selama halaman terbuka */
  }
}

/** Kunci kelompok soal untuk mencatat putaran: soal tidak diulang sebelum kelompok ini habis. */
export function kunciKelompok(s: Pick<PengaturanSesi, "kelas" | "tingkat" | "mode" | "paket">) {
  if (s.mode === "paket") return `paket-${s.paket}`;
  return s.mode === "osn" ? `${s.kelas}-osn` : `${s.kelas}-${s.tingkat}`;
}

export function catatJawaban(p: Progres, soal: Soal, benar: boolean, mode: ModeSesi, kelompok: string): Progres {
  const n: Progres = structuredClone(p);
  n.totalDijawab++;
  const k = String(soal.kelas);
  n.perKelas[k] = n.perKelas[k] ?? { dijawab: 0, benar: 0 };
  n.perKelas[k].dijawab++;
  n.perTingkat[soal.tingkat].dijawab++;
  if (!n.kelasDicoba.includes(soal.kelas)) n.kelasDicoba.push(soal.kelas);

  const pernahSalah = n.salahIds.includes(soal.id);
  if (benar) {
    n.totalBenar++;
    n.perKelas[k].benar++;
    n.perTingkat[soal.tingkat].benar++;
    n.skor += POIN[soal.tingkat];
    n.streak++;
    n.streakTerbaik = Math.max(n.streakTerbaik, n.streak);
    if (soal.tingkat === "sulit") n.benarSulit++;
    if (pernahSalah) {
      n.salahIds = n.salahIds.filter((id) => id !== soal.id);
      n.diperbaiki++;
    }
  } else {
    n.totalSalah++;
    n.streak = 0;
    if (!pernahSalah) n.salahIds.push(soal.id);
  }

  if (mode !== "ulang") {
    const daftar = n.sudahDikerjakan[kelompok] ?? [];
    if (!daftar.includes(soal.id)) daftar.push(soal.id);
    n.sudahDikerjakan[kelompok] = daftar;
  }
  return n;
}

export function catatLewati(p: Progres): Progres {
  return { ...p, totalDilewati: p.totalDilewati + 1 };
}

export function mulaiPutaranBaru(p: Progres, kelompok: string, tuntas: boolean): Progres {
  return {
    ...p,
    sudahDikerjakan: { ...p.sudahDikerjakan, [kelompok]: [] },
    poolTuntas: p.poolTuntas + (tuntas ? 1 : 0),
  };
}

export function simpanSesi(p: Progres, r: RiwayatSesi): Progres {
  return {
    ...p,
    riwayat: [r, ...p.riwayat].slice(0, MAKS_RIWAYAT),
    waktuDetik: p.waktuDetik + r.durasiDetik,
    simulasiSelesai: p.simulasiSelesai + (r.mode === "simulasi" && r.dijawab >= 5 ? 1 : 0),
    sesiSempurna: p.sesiSempurna + (r.dijawab >= 10 && r.salah === 0 ? 1 : 0),
  };
}

export function salahUntukKelas(p: Progres, kelas: Kelas) {
  return p.salahIds.filter((id) => id.startsWith(`K${kelas}-`));
}

export function salahUntukPaket(p: Progres, paket: string) {
  return p.salahIds.filter((id) => id.startsWith(`${paket}-`));
}

export const akurasi = (benar: number, dijawab: number) => (dijawab ? Math.round((benar / dijawab) * 100) : 0);
