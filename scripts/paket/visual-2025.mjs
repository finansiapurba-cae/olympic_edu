// Gambar bantu untuk paket soal olimpiade 2025, urut sesuai nomor soal.
// Setiap entri menerima bahasa (L) agar pemisah ribuan dan desimal mengikuti bahasa itu.
const f = (L) => (n) => n.toLocaleString(L === "id" ? "id-ID" : "en-US");
const d = (L) => (s) => (L === "id" ? String(s).replace(".", ",") : String(s));
const kel = (x, sampai) => Array.from({ length: Math.floor(sampai / x) }, (_, i) => x * (i + 1));
const fak = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((v) => n % v === 0);

const PAKET_1 = [
  // 1
  () => ({ j: "model", total: "?", bagian: [{ nilai: 945, label: "?" }, { nilai: 90, label: "+2", warna: true }], jawabList: ["27 × 35 = 945"], jawab: 947 }),
  () => ({ j: "banding", baris: [{ label: "🥭", nilai: 6 }, { label: "🍊", nilai: 6 }] }),
  () => ({ j: "grid", dari: 21, sampai: 150, sorot: [30, 40, 50, 60, 70, 80, 90, ...Array.from({ length: 10 }, (_, i) => 100 + i), 110, 120, 130, 140, 150], hasil: "22 + 1 = 23" }),
  () => ({ j: "akuarium", awal: 50, akhir: 60, hasil: "800 × 10 : 200 = 40" }),
  () => ({ j: "mesin", langkah: ["× 40", ": 20", ": 15"], kotak: ["15 📦", 600, 30, 2], tanya: 3 }),
  (L) => ({ j: "model", total: f(L)(125500), bagian: [{ nilai: 42000, label: `6 × ${f(L)(7000)}` }, { nilai: 40000, label: `4 × ${f(L)(10000)}` }, { nilai: 43500, label: "?" }], jawab: `3 × ${f(L)(14500)}` }),
  () => ({ j: "model", total: "26 🧃", bagian: [{ nilai: 21, label: "?" }, { nilai: 4, label: "+4", warna: true }, { nilai: 1, label: "+1", warna: true }], jawab: 21 }),
  () => ({ j: "model", total: "?", bagian: [19, 15, 11, 7, 3].map((v, i) => ({ nilai: v, label: `${10 - 2 * i}+${9 - 2 * i}` })), jawab: 55 }),
  (L) => ({ j: "lingkaran", r: 4, persegi: true, satuan: "", ukur: "luas", hasil: `${d(L)(3.14)} × 4 × 4 = ${d(L)(50.24)}` }),
  (L) => ({ j: "mesin", langkah: [`− ${f(L)(80000)}`, ": 2"], kotak: [f(L)(100000), f(L)(20000), f(L)(10000)], tanya: 0 }),
  // 11
  (L) => ({ j: "balok", p: 4.5, l: 3, t: 1.5, lp: d(L)(4.5), ll: "3", lt: d(L)(1.5), satuan: "m", hasil: `4 × (${d(L)(4.5)} + 3 + ${d(L)(1.5)}) + ${d(L)(0.5)} = ${d(L)(36.5)}` }),
  (L) => ({ j: "pp", p: 150, l: 75, satuan: "cm", label: "8 × ½ × 45 × 50", ukur: "luas", hasil: `${f(L)(11250)} − ${f(L)(9000)} = ${f(L)(2250)}` }),
  () => ({ j: "daftar", baris: [15, 24, 30].map((x) => ({ label: `${x}′`, angka: kel(x, 120) })), sorot: [120], hasil: "120′ = 2 h" }),
  () => ({ j: "perjalanan", v: 60, jarak: 15, selesai: [9, 45] }),
  (L) => ({ j: "banding", baris: [{ label: "Rajalele", nilai: 5400 }, { label: "Windu", nilai: 6000, tanya: true }], garis: 5700, hasil: f(L)(6000) }),
  () => ({ j: "bagian", baris: [{ label: "Upin 5′", n: 6, nilai: 7, tetap: true }, { label: "Ipin 3′", n: 10, nilai: 5, tetap: true }], hasil: "42 + 50 = 92" }),
  (L) => ({ j: "model", total: f(L)(875000), bagian: [{ nilai: 100, label: "?" }, { nilai: 25, label: "25%", warna: true }], jawabList: [`100% = ${f(L)(700000)}`] }),
  () => ({ j: "banding", sembunyi: true, baris: [["Diyah", 5], ["Layla", 4], ["Intan", 3], ["Wulan", 2], ["Mita", 1]].map(([label, nilai]) => ({ label, nilai, tanya: true })) }),
  (L) => ({ j: "model", total: f(L)(1050000), bagian: [{ nilai: 100, label: "?" }, ...Array.from({ length: 5 }, () => ({ nilai: 10, label: "10%", warna: true }))], jawabList: [f(L)(700000)] }),
  (L) => ({ j: "banding", baris: [{ label: "A", nilai: 30 }, { label: "B", nilai: 12 }], total: "42 L/′", hasil: `42 × 60 = ${f(L)(2520)}` }),
  // 21
  () => ({ j: "daftar", baris: [4, 5].map((x) => ({ label: `×${x}`, angka: kel(x, 20) })), sorot: [20], hasil: "19 + 20 − 31 = 8" }),
  () => ({ j: "bersarang", lapis: ["$\\frac{4^{2007}(4^4 - 6^3) + 40}{4^{2007} + 1}$", "$4^4 - 6^3 = 256 - 216 = 40$"], hasil: "40" }),
  (L) => ({ j: "bersarang", lapis: [`$\\sqrt{${d(L)("0.0025")}} + \\sqrt{${d(L)("0.16")}}$`, `$${d(L)("0.05")} + ${d(L)("0.4")}$`], hasil: d(L)("0.45") }),
  () => ({ j: "logika", orang: ["Nurul", "Indah", "Budi", "Rini", "Esdi"], sama: [[0, 1]], beda: [[1, 3], [3, 4]], jawab: [2, 3] }),
  () => ({ j: "bagian", baris: [{ label: "Dila", n: 3 }, { label: "Evita", n: 4 }, { label: "Chrissy", n: 6 }], nilai: 4, total: 52, hasil: "4 × 4 = 16" }),
  (L) => ({ j: "bagian", baris: [{ label: "Dikta", n: 2 }, { label: "Dudi", n: 5 }, { label: "Yovie", n: 9 }], nilai: f(L)(250000), hasil: `3 × ${f(L)(250000)} = ${f(L)(750000)}` }),
  (L) => ({ j: "model", total: f(L)(30000), bagian: [...Array.from({ length: 6 }, () => ({ nilai: 3600, label: "📘" })), ...Array.from({ length: 4 }, () => ({ nilai: 2100, label: "✏️", warna: true }))], hasil: `📘 = ${f(L)(3600)}` }),
  () => ({ j: "mesin", langkah: ["$\\frac{1}{x}$", "+4", "$\\sqrt{\\;}$"], kotak: ["$\\frac{1}{12}$", 12, 16, 4], tanya: 3 }),
  () => ({ j: "model", total: 30, bagian: [{ nilai: 13, label: "?" }, { nilai: 4, label: "4", warna: true }, { nilai: 13, label: "?" }], jawabList: [13, 13], hasil: "13 + 4 = 17" }),
  () => ({ j: "bersarang", lapis: ["$3 + \\frac{4}{2 + \\frac{3}{1 + \\frac{2}{3}}}$", "$2 + \\frac{9}{5} = \\frac{19}{5}$", "$1 + \\frac{2}{3} = \\frac{5}{3}$"], hasil: "$4\\frac{1}{19}$" }),
  // 31
  () => ({ j: "mesin", langkah: ["×2", "−12", ":2", "+122"], kotak: [256, 512, 500, 250, 372], tanya: 0 }),
  () => ({ j: "model", total: 229, bagian: [{ nilai: 200, label: "2 × 100" }, { nilai: 24, label: "3 × 8" }, { nilai: 5, label: "5" }], hasil: "2011 − 229 = 1782" }),
  (L) => ({ j: "tabung", r: 5, t: 20, satuan: "cm", kerucut: true, hasil: `${f(L)(1570)} − ${d(L)(523.3)} = ${f(L)(1046.7)}` }),
  () => ({ j: "roda", jari: [1, 3, 5, 7, 9], putaran: [180, null, null, null, "?"], jawab: 20, hasil: "180 × 1 = 9 × 20" }),
  () => ({ j: "persegiDiAtas", sisi: 4, p: 14, l: 10 }),
  () => ({ j: "pythagoras", a: "10π", b: "15π", c: "25π" }),
  () => ({ j: "banding", baris: [{ label: "I · 6 × 27", nilai: 162 }, { label: "II · 6 × 29", nilai: 174 }], selisih: 12, garis: 168, hasil: "12 : 2 = 6" }),
  () => ({ j: "pola", suku: [2, 3, 4, 9, 16, "?", 54], beda: "", jawab: 29, catatan: "$4 + 9 + 16 = 29$" }),
  (L) => ({ j: "model", total: "12 × 31 = 372", bagian: [{ nilai: 304, label: `10 × ${d(L)(30.4)}` }, { nilai: 35, label: "35", warna: true }, { nilai: 33, label: "?" }], jawab: 33 }),
  (L) => ({ j: "jam", waktu: [[6, 0], [11, 0]], putaran: 5, hasil: `5 × 360° = ${f(L)(1800)}°` }),
  // 41
  () => ({ j: "bersarang", semua: true, lapis: ["5 × 📦", "4 × 📦", "6 × 📦"], hasil: "5 + 20 + 120 = 145" }),
  (L) => ({ j: "model", total: "?", bagian: [{ nilai: 2, label: f(L)(2000000) }, { nilai: 1.5, label: f(L)(1500000) }, { nilai: 1, label: f(L)(1000000) }, { nilai: 1, label: f(L)(1000000) }], jawab: f(L)(5500000) }),
  () => ({ j: "banding", baris: [{ label: "50", nilai: 3 }, { label: "60", nilai: 9 }, { label: "70", nilai: 6 }, { label: "80", nilai: 5, tanya: true }, { label: "90", nilai: 2 }] }),
  (L) => ({ j: "pie", data: [{ label: "🌾", persen: 39 }, { label: "🛒", persen: 20 }, { label: "🧺", persen: 26 }, { label: "💼", persen: 15 }], hasil: `20% = 600 → 54% = 30 × 54 = ${f(L)(1620)}` }),
  () => ({ j: "mesin", langkah: ["+1"], kotak: [60, 61], tanya: 1 }),
  (L) => ({ j: "model", total: f(L)(12345), bagian: [{ nilai: 1, label: "2" }, { nilai: 12, label: "?" }], jawab: f(L)(12343), hasil: `2 × ${f(L)(12343)} = ${f(L)(24686)}` }),
  () => ({ j: "model", total: 15, bagian: [{ nilai: 8, label: "3 + 5" }, { nilai: 7, label: "$\\frac{7}{8} \\times 8$" }], hasil: "$1\\frac{7}{8}$" }),
  () => ({ j: "banding", baris: [{ label: "🚗 1", nilai: 75 }, { label: "🚗 2", nilai: 100 }], garis: 90, hasil: "+15 − 10 = −5" }),
  () => ({ j: "gelinding", putaran: 10, hasil: "28 4/7 m" }),
];

const PAKET_2 = [
  (L) => ({ j: "bagian", baris: [{ label: "Dira", n: 4 }, { label: "Mira", n: 5 }, { label: "Beny", n: 7 }], nilai: f(L)(50000), hasil: `16 × ${f(L)(50000)} = ${f(L)(800000)}` }),
  () => ({ j: "model", total: "?", bagian: [{ nilai: 270, label: "9 × 30" }, { nilai: 14, label: "2 × 7" }, { nilai: 5, label: "5" }], jawab: 289 }),
  (L) => ({ j: "model", total: "?", bagian: [{ nilai: 2300, label: "23 × 100" }, { nilai: 30, label: "3 × 10" }, { nilai: 64, label: "8 × 8" }], jawab: f(L)(2394) }),
  (L) => ({ j: "model", total: "?", bagian: [{ nilai: 1000, label: `${f(L)(1000)} kg` }, { nilai: 200, label: "2 × 100 kg" }], jawab: `${f(L)(1200)} kg` }),
  () => ({ j: "garis", min: 0, max: 450, mulai: 0, lompat: [{ ke: 400, label: "+400" }, { ke: 420, label: "+20" }, { ke: 390, label: "−30" }], tanya: 390, tanyaNanti: true }),
  (L) => ({ j: "model", total: "?", bagian: [{ nilai: 10000, label: `1 ha = ${f(L)(10000)} m²` }, { nilai: 1400, label: `14 are = ${f(L)(1400)} m²` }], jawab: `${f(L)(11400)} m²` }),
  (L) => ({ j: "model", total: `${f(L)(5500)} L`, bagian: [{ nilai: 2000, label: "2 m³" }, { nilai: 1500, label: `${f(L)(1500)} dm³` }, { nilai: 2000, label: "?" }], jawab: `${f(L)(2000)} L` }),
  () => ({ j: "pp", p: 17, l: 17, satuan: "m", tanyaSisi: true, label: "289 m²", grid: true, hasil: "17 × 17 = 289" }),
  (L) => ({ j: "lingkaran", d: 1, satuan: "m", ukur: "luas", hasil: `${d(L)(3.14)} × ${d(L)(0.5)} × ${d(L)(0.5)} = ${d(L)(0.785)}` }),
  () => ({ j: "daftar", baris: [12, 16, 36].map((x) => ({ label: `×${x}`, angka: kel(x, 144) })), sorot: [144] }),
  // 11
  (L) => ({ j: "model", total: "?", bagian: [{ nilai: 2, label: `${f(L)(7200)} : 3600 = 2` }, { nilai: 6, label: "360 : 60 = 6" }], jawab: 8 }),
  () => ({ j: "daftar", baris: [24, 36].map((x) => ({ label: x, angka: fak(x) })), sorot: fak(12) }),
  () => ({ j: "akar", sisi: [11, 15, 14] }),
  (L) => ({ j: "model", total: f(L)(24396), bagian: [{ nilai: 12672, label: f(L)(12672) }, { nilai: 11724, label: "?" }], jawab: f(L)(11724) }),
  () => ({ j: "balok", p: 8, l: 6, t: 4, satuan: "cm", hasil: "2 × (48 + 32 + 24) = 208" }),
  () => ({ j: "pp", p: 24, l: 12, satuan: "m", tanyaL: true, ukur: "luas", hasil: "(72 : 2 − 24) = 12 → 24 × 12 = 288" }),
  (L) => ({ j: "tabung", r: 7, t: 12, satuan: "cm", hasil: `$\\frac{22}{7} \\times 7 \\times 7 \\times 12 = ${f(L)(1848)}$` }),
  (L) => ({ j: "model", total: "111 m", bagian: [{ nilai: 46.6, label: d(L)(46.6) }, { nilai: 64.4, label: "?" }], jawab: `${d(L)(64.4)} m` }),
];

export default { "osd-2025-1": PAKET_1, "osd-2025-2": PAKET_2 };
