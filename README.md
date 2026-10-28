# Olympic Edu (olympicedu.netlify.app)

Website latihan soal gaya olimpiade matematika untuk kelas 1–6 SD, dalam tiga bahasa
(Indonesia, English, 繁體中文). React + TypeScript + Tailwind CSS + KaTeX. Progres disimpan di localStorage.

## Menjalankan

    npm install
    npm run dev           # mode pengembangan, buka http://localhost:5173
    npm run build         # hasil di folder dist/ (unggah ke Netlify, Vercel, GitHub Pages)
    npm run build:single  # satu file mandiri: dist-single/index.html

## Isi

- **Bank soal latihan**: 369 soal orisinal (60–66 per kelas) yang dibuat oleh generator di `scripts/soal/kelasN.mjs`.
  Setiap templat menghitung jawabannya sendiri dan ditulis dalam tiga bahasa sekaligus.
- **Paket olimpiade** (`scripts/paket/paket-2025.mjs`): 67 soal dari dokumen kiriman pemilik website
  (Paket 1: 49 soal kelas 4–6, Paket 2: 18 soal kelas 5). Soal yang pilihan jawabannya keliru di dokumen asli
  diperbaiki dan diberi catatan `koreksi`.

Setelah mengubah soal, jalankan:

    npm run gen

Perintah ini membuat ulang `src/data/bank/*.json` dan memeriksa setiap soal di ketiga bahasa: 4 pilihan berbeda,
kunci valid, tidak ada soal ganda (termasuk antara paket dan bank soal), dan semua rumus KaTeX bisa dibaca.

### Menambah paket soal baru

Tambahkan objek baru di `scripts/paket/paket-2025.mjs` (atau file baru yang diimpor di `scripts/generate-bank.mjs`):

```js
q(kelas, "mudah" | "sedang" | "sulit", ["Topik", "Topic", "主題"], "B",
  ["Pertanyaan ...", ["A", "B", "C", "D"], ["Langkah 1", "Langkah 2"]],   // Indonesia
  ["Question ...",   ["A", "B", "C", "D"], ["Step 1", "Step 2"]],         // English
  ["題目……",          ["A", "B", "C", "D"], ["步驟 1", "步驟 2"]],          // 繁體中文
  ["Catatan perbaikan (opsional)", "Correction note", "更正說明"])
```

Rumus ditulis dengan KaTeX di antara tanda `$...$`.

## Struktur

    src/
      i18n.tsx             semua teks tampilan dalam 3 bahasa + pilihan bahasa
      App.tsx              navigasi, penyimpanan, notifikasi badge
      components/SampulLebah.tsx   sampul dengan maskot lebah
      pages/Beranda.tsx    pilih kelas, tingkat, mode; paket olimpiade; bank soal
      pages/Latihan.tsx    satu soal per layar, periksa, pembahasan, timer, lewati, ringkasan tiap 10 soal
      pages/Statistik.tsx  statistik, badge, riwayat, reset progres
      lib/progres.ts       skor (10/20/30 poin), putaran soal tanpa pengulangan, localStorage
