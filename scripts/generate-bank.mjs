// Membuat bank soal JSON (3 bahasa) di src/data/bank dan memeriksa setiap soal.
// Jalankan: npm run gen
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { buildKelas, LANGS, rapikanRumus, PENUTUP } from "./soal/lib.mjs";
import DAFTAR_PAKET from "./paket/paket-2025.mjs";

const OUT = path.resolve("src/data/bank");
const MIN_PER_KELAS = 50;
const errors = [];
const meta = { dibuat: new Date().toISOString().slice(0, 10), kelas: {} };

function cekTeks(id, s) {
  if (typeof s !== "string" || !s.trim()) return errors.push(`${id}: teks kosong`);
  if (/[\t\f\v\b\r\n]/.test(s)) errors.push(`${id}: karakter kontrol (backslash LaTeX tidak di-escape?) dalam "${s}"`);
  const parts = s.split("$");
  if (parts.length % 2 === 0) errors.push(`${id}: jumlah tanda $ ganjil dalam "${s}"`);
  parts.forEach((p, i) => {
    if (i % 2 === 0) {
      if (/\\(times|frac|div|sqrt|circ)/.test(p)) errors.push(`${id}: perintah LaTeX di luar rumus dalam "${s}"`);
      return;
    }
    if (/(^|[^\\a-zA-Z])(times|frac|square|circ|sqrt|cdots|ldots|div|pi)\b/.test(p)) errors.push(`${id}: perintah LaTeX tanpa backslash dalam "${p}"`);
    try { katex.renderToString(p, { throwOnError: true }); } catch (e) { errors.push(`${id}: KaTeX gagal "${p}": ${e.message}`); }
  });
  if (/undefined|NaN|Infinity|\[object/.test(s)) errors.push(`${id}: nilai rusak dalam "${s}"`);
}

const all = [];
for (let k = 1; k <= 6; k++) {
  const { default: templates } = await import(`./soal/kelas${k}.mjs`);
  const qs = buildKelas(k, templates, 20260 + k * 7919);
  for (const L of LANGS) {
    const seen = new Set();
    for (const q of qs) {
      const x = q.teks[L];
      const tag = `${q.id}/${L}`;
      if (seen.has(x.pertanyaan)) errors.push(`${tag}: pertanyaan ganda`);
      seen.add(x.pertanyaan);
      const opts = Object.values(x.pilihan);
      if (opts.length !== 4 || new Set(opts).size !== 4) errors.push(`${tag}: pilihan tidak 4 atau ada yang sama: ${opts.join(" | ")}`);
      if (!x.pembahasan.length) errors.push(`${tag}: tanpa pembahasan`);
      [x.pertanyaan, ...opts, ...x.pembahasan].forEach((s) => cekTeks(tag, s));
      if (L !== "id" && /\b(dan|yang|adalah|berapa|jadi)\b/i.test(x.pertanyaan + x.pembahasan.join(" "))) errors.push(`${tag}: masih ada kata bahasa Indonesia: "${x.pertanyaan}"`);
      if (L === "zh" && !/[一-鿿]/.test(x.pertanyaan)) errors.push(`${tag}: pertanyaan tanpa huruf Mandarin`);
    }
  }
  for (const q of qs) {
    if (!["A", "B", "C", "D"].includes(q.kunci)) errors.push(`${q.id}: kunci tidak valid`);
    if (!["mudah", "sedang", "sulit"].includes(q.tingkat)) errors.push(`${q.id}: tingkat tidak valid`);
  }
  if (qs.length < MIN_PER_KELAS) errors.push(`Kelas ${k}: hanya ${qs.length} soal`);
  const hitung = (f) => qs.reduce((m, q) => ((m[f(q)] = (m[f(q)] ?? 0) + 1), m), {});
  const topik = {};
  qs.forEach((q) => {
    const t = (topik[q.topik.id] ??= { nama: q.topik, jumlah: 0 });
    t.jumlah++;
  });
  meta.kelas[k] = { total: qs.length, tingkat: hitung((q) => q.tingkat), kategori: hitung((q) => q.kategori), topik: Object.values(topik) };
  fs.writeFileSync(path.join(OUT, `kelas-${k}.json`), JSON.stringify(qs));
  all.push(...qs);
}
// Paket soal olimpiade: kunci jawaban ditulis manual, jadi diperiksa ketat.
const HURUF = ["A", "B", "C", "D"];
const paketOut = [];
const semuaTeks = new Map(all.map((q) => [q.teks.id.pertanyaan.replace(/\s+/g, " ").toLowerCase(), q.id]));
for (const p of DAFTAR_PAKET) {
  const soal = p.soal.map((s, i) => {
    const id = `${p.id}-${String(i + 1).padStart(2, "0")}`;
    if (!HURUF.includes(s.kunci)) errors.push(`${id}: kunci tidak valid`);
    const teks = {};
    for (const L of LANGS) {
      const [pertanyaan, opsi, langkah] = s.teks[L] ?? [];
      if (!pertanyaan || opsi?.length !== 4 || !langkah?.length) { errors.push(`${id}/${L}: data tidak lengkap`); continue; }
      const pilihan = Object.fromEntries(opsi.map((o, k) => [HURUF[k], rapikanRumus(o)]));
      if (new Set(Object.values(pilihan)).size !== 4) errors.push(`${id}/${L}: pilihan ada yang sama`);
      teks[L] = { pertanyaan: rapikanRumus(pertanyaan), pilihan, pembahasan: [...langkah, PENUTUP[L](pilihan[s.kunci], s.kunci)].map(rapikanRumus) };
      [teks[L].pertanyaan, ...Object.values(pilihan), ...teks[L].pembahasan].forEach((x) => cekTeks(`${id}/${L}`, x));
    }
    const kunciTeks = s.teks.id[0].replace(/\s+/g, " ").toLowerCase();
    if (semuaTeks.has(kunciTeks)) errors.push(`${id}: sama dengan soal ${semuaTeks.get(kunciTeks)}`);
    semuaTeks.set(kunciTeks, id);
    return {
      id, kelas: s.kelas, kategori: "Olimpiade", paket: p.id,
      topik: { id: s.topik[0], en: s.topik[1], zh: s.topik[2] },
      tingkat: s.tingkat, kunci: s.kunci, teks,
      ...(s.koreksi ? { koreksi: { id: rapikanRumus(s.koreksi[0]), en: rapikanRumus(s.koreksi[1]), zh: rapikanRumus(s.koreksi[2]) } } : {}),
    };
  });
  paketOut.push({ id: p.id, judul: p.judul, deskripsi: p.deskripsi, soal });
  console.log(`${p.judul.id}: ${soal.length} soal`);
}
fs.writeFileSync(path.join(OUT, "paket.json"), JSON.stringify(paketOut));
meta.paket = paketOut.map((p) => ({ id: p.id, judul: p.judul, deskripsi: p.deskripsi, total: p.soal.length, kelas: [...new Set(p.soal.map((s) => s.kelas))].sort() }));
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify(meta, null, 1));

for (const [k, m] of Object.entries(meta.kelas)) console.log(`Kelas ${k}: ${m.total} soal`, m.tingkat);
console.log(`Total: ${all.length} soal × ${LANGS.length} bahasa`);
if (errors.length) {
  console.error(`\n${errors.length} masalah ditemukan:\n` + errors.slice(0, 40).join("\n"));
  process.exit(1);
}
console.log("Semua soal lolos pemeriksaan.");
