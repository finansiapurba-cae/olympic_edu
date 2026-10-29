import type { Bahasa, RiwayatSesi } from "../types";
import { akurasi } from "./progres";

// Alamat Web App Google Apps Script yang menulis ke Google Sheet guru (lihat google-sheet/PANDUAN.md).
// Kosong = hasil tidak dikirim ke mana pun. Bisa juga diisi lewat variabel Netlify VITE_SHEET_URL.
export const SHEET_URL: string = import.meta.env.VITE_SHEET_URL ?? "";

const KUNCI_PERANGKAT = "kms-perangkat";

/** Kode acak per perangkat, agar guru bisa membedakan dua murid yang memakai nama sama. */
function kodePerangkat() {
  try {
    let k = localStorage.getItem(KUNCI_PERANGKAT);
    if (!k) {
      k = Math.random().toString(36).slice(2, 8).toUpperCase();
      localStorage.setItem(KUNCI_PERANGKAT, k);
    }
    return k;
  } catch {
    return "-";
  }
}

/** Mengirim ringkasan satu sesi latihan sebagai satu baris di Google Sheet. Gagal kirim tidak mengganggu latihan. */
export function kirimHasil(r: RiwayatSesi, nama: string, bahasa: Bahasa) {
  if (!SHEET_URL) return;
  const baris = {
    tanggal: r.tanggal,
    nama: nama.trim() || "(tanpa nama)",
    perangkat: kodePerangkat(),
    kelas: r.kelas,
    mode: r.mode,
    paket: r.paket ?? "",
    tingkat: r.tingkat,
    dijawab: r.dijawab,
    benar: r.benar,
    salah: r.salah,
    dilewati: r.dilewati,
    ketepatan: akurasi(r.benar, r.dijawab),
    skor: r.skor,
    durasiDetik: r.durasiDetik,
    bahasa,
  };
  try {
    // text/plain + no-cors: tidak perlu izin CORS dari Google; keepalive agar tetap terkirim saat halaman ditutup.
    fetch(SHEET_URL, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(baris) }).catch(() => {});
  } catch {
    /* abaikan */
  }
}
