// Membuat bank soal JSON (3 bahasa) di src/data/bank dan memeriksa setiap soal.
// Jalankan: npm run gen
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { buildKelas, LANGS, rapikanRumus, PENUTUP } from "./soal/lib.mjs";
import PAKET_2025 from "./paket/paket-2025.mjs";
import PAKET_LATIHAN from "./paket/paket-latihan.mjs";
import VISUAL_PAKET from "./paket/visual-2025.mjs";

// Jenis gambar bantu yang dikenal komponen src/components/Visualisasi.tsx.
const JENIS_VISUAL = [...fs.readFileSync("src/components/Visualisasi.tsx", "utf8").match(/const RENDER.*?> = \{([^}]*)\}/s)[1].matchAll(/(\w+):/g)].map((m) => m[1]);
// Rumus di dalam label gambar dirapikan dan diperiksa seperti teks soal.
function rapikanVisual(v) {
  if (typeof v === "string") return v.includes("$") ? rapikanRumus(v) : v;
  if (Array.isArray(v)) return v.map(rapikanVisual);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, rapikanVisual(x)]));
  return v;
}
function cekVisual(id, v) {
  if (!v || typeof v !== "object") return errors.push(`${id}: tanpa gambar bantu`);
  JSON.stringify(v).match(/"[^"]*\$[^"]*"/g)?.forEach((x) => cekTeks(`${id}/gambar`, JSON.parse(x)));
  if (!JENIS_VISUAL.includes(v.j)) errors.push(`${id}: jenis gambar "${v.j}" tidak dikenal`);
  const js = JSON.stringify(v);
  if (/null,"|NaN|undefined|Infinity/.test(js.replace(/\[null|,null/g, ""))) errors.push(`${id}: gambar rusak ${js}`);
}

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
    q.visual = rapikanVisual(q.visual);
    for (const L of LANGS) if (q.teks[L].visual) q.teks[L].visual = rapikanVisual(q.teks[L].visual);
    cekVisual(q.id, q.visual);
    for (const L of LANGS) if (q.teks[L].visual) cekVisual(`${q.id}/${L}`, q.teks[L].visual);
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
const KATEGORI_PAKET = ["indonesia", "internasional", "standar"];
const DAFTAR_PAKET = [...PAKET_2025.map((p) => ({ kategori: "indonesia", ...p })), ...PAKET_LATIHAN];
const paketOut = [];
const semuaTeks = new Map(all.map((q) => [q.teks.id.pertanyaan.replace(/\s+/g, " ").toLowerCase(), q.id]));
for (const p of DAFTAR_PAKET) {
  if (!KATEGORI_PAKET.includes(p.kategori)) errors.push(`${p.id}: kategori "${p.kategori}" tidak dikenal`);
  // Gambar bantu: dari soal itu sendiri (paket latihan) atau dari visual-2025.mjs.
  const vis = p.soal.map((s, i) => {
    const v = s.visual ?? VISUAL_PAKET[p.id]?.[i];
    return v === undefined ? undefined : typeof v === "function" ? v : () => v;
  });
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
    const visual = rapikanVisual(vis[i]?.("id"));
    cekVisual(id, visual);
    for (const L of LANGS) {
      const vL = rapikanVisual(vis[i]?.(L));
      if (teks[L] && JSON.stringify(vL) !== JSON.stringify(visual)) teks[L].visual = vL;
    }
    return {
      id, kelas: s.kelas, kategori: "Olimpiade", paket: p.id, visual,
      topik: { id: s.topik[0], en: s.topik[1], zh: s.topik[2] },
      tingkat: s.tingkat, kunci: s.kunci, teks,
      ...(s.koreksi ? { koreksi: { id: rapikanRumus(s.koreksi[0]), en: rapikanRumus(s.koreksi[1]), zh: rapikanRumus(s.koreksi[2]) } } : {}),
    };
  });
  paketOut.push({ id: p.id, kategori: p.kategori, judul: p.judul, deskripsi: p.deskripsi, soal });
  console.log(`${p.judul.id}: ${soal.length} soal`);
}
fs.writeFileSync(path.join(OUT, "paket.json"), JSON.stringify(paketOut));
meta.paket = paketOut.map((p) => ({ id: p.id, kategori: p.kategori, judul: p.judul, deskripsi: p.deskripsi, total: p.soal.length, kelas: [...new Set(p.soal.map((s) => s.kelas))].sort() }));
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify(meta, null, 1));

for (const [k, m] of Object.entries(meta.kelas)) console.log(`Kelas ${k}: ${m.total} soal`, m.tingkat);
console.log(`Total: ${all.length} soal × ${LANGS.length} bahasa`);
if (errors.length) {
  console.error(`\n${errors.length} masalah ditemukan:\n` + errors.slice(0, 40).join("\n"));
  process.exit(1);
}
console.log("Semua soal lolos pemeriksaan.");
