// Memilih "Soal Hari Ini" dari bank soal website, berganti setiap hari dengan urutan tetap.
import k3 from "../../src/data/bank/kelas-3.json" with { type: "json" };
import k4 from "../../src/data/bank/kelas-4.json" with { type: "json" };
import k5 from "../../src/data/bank/kelas-5.json" with { type: "json" };
import k6 from "../../src/data/bank/kelas-6.json" with { type: "json" };
import paket from "../../src/data/bank/paket.json" with { type: "json" };
import { polos } from "./teks.mjs";

const HURUF = ["A", "B", "C", "D"];
const MULAI = Date.UTC(2026, 10, 1); // hari pertama urutan soal

function acak(xs, benih) {
  const a = [...xs];
  let s = benih >>> 0;
  const rnd = () => ((s = (s + 0x6d2b79f5) >>> 0), (((s ^ (s >>> 15)) * (s | 1)) >>> 0) / 4294967296);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Soal yang cocok untuk Threads: teks dan pilihan pendek, tetap jelas tanpa gambar. */
function cocok(s) {
  const t = s.teks.id;
  if (polos(t.pertanyaan).length > 260) return false;
  if (HURUF.some((h) => polos(t.pilihan[h]).length > 28)) return false;
  return !/gambar|perhatikan pola gambar|di bawah ini/i.test(t.pertanyaan);
}

export const KUMPULAN = acak(
  [...k3, ...k4, ...k5, ...k6, ...paket.filter((p) => /latihan/.test(p.id)).flatMap((p) => p.soal)].filter(cocok),
  2026,
);

/** Soal untuk tanggal "YYYY-MM-DD" (zona WIB). */
export function soalUntuk(tanggal) {
  const hari = Math.floor((Date.parse(tanggal + "T00:00:00Z") - MULAI) / 86_400_000);
  return KUMPULAN[((hari % KUMPULAN.length) + KUMPULAN.length) % KUMPULAN.length];
}

export const pilihanPolos = (s) => Object.fromEntries(HURUF.map((h) => [h, polos(s.teks.id.pilihan[h])]));
