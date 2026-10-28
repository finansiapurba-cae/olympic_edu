// Alat bantu untuk generator bank soal (tiga bahasa: id, en, zh = Mandarin Tradisional).
// Setiap templat MENGHITUNG jawabannya sendiri, sehingga kunci jawaban dan pembahasan
// selalu konsisten dengan angka di soal. Templat dijalankan sekali per bahasa dengan
// keadaan acak yang sama, jadi angka, kunci, dan urutan pilihan identik di ketiga bahasa.

export const LANGS = ["id", "en", "zh"];

export const KAT = {
  OSN: "OSN/KSN",
  SEAMO: "SEAMO",
  KMNR: "KMNR",
  OMNAS: "OMNAS",
  KOSSMI: "KOSSMI",
  KSM: "KSM",
};

export const NAMA = [
  "Ani", "Budi", "Citra", "Dimas", "Eka", "Fajar", "Gita", "Hana", "Intan", "Joko",
  "Kiki", "Lala", "Made", "Nanda", "Putri", "Raka", "Sari", "Tono", "Wayan", "Yusuf",
  "Ayu", "Bayu", "Dewi", "Rizki", "Salsa", "Togar", "Nyoman", "Ucok", "Mega", "Rudi",
];

const HARI = {
  id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  zh: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
};

export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => {
    const b = [...arr];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  return {
    next, int, pick, shuffle,
    sample: (arr, k) => shuffle(arr).slice(0, k),
    getState: () => a,
    setState: (s) => (a = s),
  };
}

export const pad2 = (n) => String(n).padStart(2, "0");
export const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const lcm = (a, b) => (a / gcd(a, b)) * b;

function ordinalEn(n) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th");
  return n + s;
}

/** Konteks bahasa yang diberikan ke setiap templat. */
export function ctx(lang) {
  const id = lang === "id";
  const fmt = (n) => {
    const neg = n < 0;
    const x = Math.abs(n);
    const s = Number.isInteger(x) ? x.toLocaleString(id ? "id-ID" : "en-US") : id ? String(x).replace(".", ",") : String(x);
    return neg ? "−" + s : s;
  };
  const jam = (h, m) => (id ? `${pad2(h)}.${pad2(m)}` : `${pad2(h)}:${pad2(m)}`);
  return {
    lang,
    /** t(indonesia, english, mandarin) */
    t: (a, b, c) => (lang === "id" ? a : lang === "en" ? b : c),
    fmt,
    rp: (n) => "Rp" + fmt(n),
    hari: HARI[lang],
    jam,
    pukul: (h, m) => (id ? `pukul ${jam(h, m)}` : jam(h, m)),
    ke: (n) => (lang === "id" ? `ke-${n}` : lang === "en" ? ordinalEn(n) : `第 ${n} 個`),
    /** desimal dari persepuluhan: 12 → "1,2" / "1.2" */
    dec: (tenths) => `${Math.floor(tenths / 10)}${id ? "," : "."}${tenths % 10}`,
  };
}
export const CTX = Object.fromEntries(LANGS.map((l) => [l, ctx(l)]));

/** Pecahan dalam KaTeX, otomatis disederhanakan. Bilangan bulat ditulis biasa; pecahan > 1 ditulis campuran. */
export function frac(n, d, { sederhanakan = true, campuran = true } = {}) {
  if (sederhanakan) {
    const g = gcd(n, d);
    n /= g;
    d /= g;
  }
  if (d === 1) return `$${n}$`;
  if (campuran && n > d) return `$${Math.floor(n / d)}\\frac{${n % d}}{${d}}$`;
  return `$\\frac{${n}}{${d}}$`;
}
/** Pecahan tanpa tanda $ untuk dipakai di dalam rumus. */
export const fr = (n, d) => `\\frac{${n}}{${d}}`;

export function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

export function factors(n) {
  const f = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i);
  return f;
}

export function roman(n) {
  const map = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = "";
  const parts = [];
  for (const [v, r] of map) {
    while (n >= v) {
      s += r;
      n -= v;
      parts.push([r, v]);
    }
  }
  return { s, parts };
}

/** T(kategori, [topik id, en, zh], tingkat, gen, n?) — satu templat soal. gen(r, c) */
export const T = (kategori, topik, tingkat, gen, n = 3) => ({ kategori, topik, tingkat, gen, n });

/** Di dalam rumus KaTeX, koma di antara angka (12,000 atau 0,5) ditulis {,} agar tidak diberi spasi. */
export function rapikanRumus(s) {
  return s
    .split("$")
    .map((p, i) => (i % 2 ? p.replace(/(\d),(\d)/g, "$1{,}$2") : p))
    .join("$");
}

/** Memilih jawaban + 3 pengecoh berdasarkan NILAI (bukan teks), agar sama di semua bahasa. */
function pilihOpsi(q) {
  const isNum = typeof q.jawaban === "number";
  const items = [];
  const seen = new Set([isNum ? `n:${q.jawaban}` : `s:${q.jawaban}`]);
  (q.salah ?? []).forEach((v, i) => {
    if (items.length >= 3) return;
    if (typeof v === "number") {
      if (!Number.isFinite(v)) return;
      if (v < 0 && !q.negatif) return;
      if (q.bulat !== false && !Number.isInteger(v)) return;
      if (q.maks !== undefined && v > q.maks) return;
      if (seen.has(`n:${v}`)) return;
      seen.add(`n:${v}`);
      items.push({ v });
    } else {
      if (seen.has(`s:${v}`)) return;
      seen.add(`s:${v}`);
      items.push({ i });
    }
  });
  if (isNum && items.length < 3) {
    const step = q.langkah ?? 1;
    for (const d of [1, -1, 2, -2, 3, -3, 4, -4, 5, -5]) {
      if (items.length >= 3) break;
      const v = q.jawaban + d * step;
      if (v < 0 && !q.negatif) continue;
      if (q.min !== undefined && v < q.min) continue;
      if (q.maks !== undefined && v > q.maks) continue;
      if (seen.has(`n:${v}`)) continue;
      seen.add(`n:${v}`);
      items.push({ v });
    }
  }
  return items.length < 3 ? null : items;
}

function teksOpsi(q, item, c) {
  const f = (v) => (q.prefix ?? "") + c.fmt(v) + (q.satuan ? " " + q.satuan : "") + (q.akhiran ?? "");
  if (item === "jawaban") return typeof q.jawaban === "number" ? f(q.jawaban) : q.jawaban;
  if ("v" in item) return f(item.v);
  return q.salah[item.i];
}

export const PENUTUP = {
  id: (ans, h) => `Jadi, jawabannya ${ans} (pilihan ${h}).`,
  en: (ans, h) => `So the answer is ${ans} (option ${h}).`,
  zh: (ans, h) => `所以答案是 ${ans}（選項 ${h}）。`,
};

export function buildKelas(kelas, templates, seed) {
  const r = makeRng(seed);
  const out = [];
  const seen = new Set();
  for (const t of templates) {
    let made = 0;
    let tries = 0;
    while (made < t.n && tries < 400) {
      tries++;
      const awal = r.getState();
      const qs = {};
      for (const L of LANGS) {
        r.setState(awal);
        qs[L] = t.gen(r, CTX[L]);
      }
      const q = qs.id;
      if (!q || seen.has(q.pertanyaan)) continue;
      for (const L of LANGS) {
        if (!qs[L] || typeof qs[L].jawaban !== typeof q.jawaban || (typeof q.jawaban === "number" && qs[L].jawaban !== q.jawaban) || (qs[L].salah ?? []).length !== (q.salah ?? []).length)
          throw new Error(`Kelas ${kelas}, ${t.topik[0]}: hasil bahasa ${L} tidak cocok dengan bahasa id`);
      }
      const items = pilihOpsi(q);
      if (!items) continue;
      seen.add(q.pertanyaan);
      const urutan = r.shuffle(["jawaban", ...items]);
      const huruf = ["A", "B", "C", "D"];
      const kunci = huruf[urutan.indexOf("jawaban")];
      const teks = {};
      for (const L of LANGS) {
        const pilihan = {};
        urutan.forEach((it, i) => (pilihan[huruf[i]] = rapikanRumus(teksOpsi(qs[L], it, CTX[L]))));
        teks[L] = {
          pertanyaan: rapikanRumus(L === "zh" && !/[\u4e00-\u9fff]/.test(qs[L].pertanyaan) ? "計算：" + qs[L].pertanyaan : qs[L].pertanyaan),
          pilihan,
          pembahasan: [...qs[L].pembahasan, PENUTUP[L](pilihan[kunci], kunci)].map(rapikanRumus),
        };
      }
      out.push({
        kelas,
        kategori: q.kategori ?? t.kategori,
        topik: { id: t.topik[0], en: t.topik[1], zh: t.topik[2] },
        tingkat: q.tingkat ?? t.tingkat,
        kunci,
        teks,
      });
      made++;
    }
    if (made < t.n) throw new Error(`Kelas ${kelas}, templat "${t.topik[0]}": hanya ${made} soal dibuat`);
  }
  return out.map((q, i) => ({ id: `K${kelas}-${String(i + 1).padStart(3, "0")}`, ...q }));
}
