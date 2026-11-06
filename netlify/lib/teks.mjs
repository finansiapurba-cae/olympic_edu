// Mengubah teks soal (yang memakai rumus KaTeX di antara $...$) menjadi teks biasa untuk Threads.
export function polos(s) {
  return String(s)
    .replace(/\$([^$]*)\$/g, (_, r) => rumus(r))
    .replace(/\s+/g, " ")
    .trim();
}

function rumus(r) {
  let x = r;
  for (let i = 0; i < 3; i++) x = x.replace(/(\d+)\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1 $2/$3").replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2");
  return x
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdots|\\ldots|\\dots/g, "…")
    .replace(/\\pi/g, "π")
    .replace(/\\square/g, "□")
    .replace(/\^\\circ/g, "°")
    .replace(/\\sqrt\[3\]\{([^{}]*)\}/g, "∛$1")
    .replace(/\\sqrt\{([^{}]*)\}/g, "√$1")
    .replace(/\\text\{([^{}]*)\}/g, "$1")
    .replace(/\^\{([^{}]*)\}/g, (_, p) => pangkat(p))
    .replace(/\^(\d)/g, (_, p) => pangkat(p))
    .replace(/\{,\}/g, ",")
    .replace(/\\%/g, "%")
    .replace(/\\[,;:! ]/g, " ")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}]/g, "")
    .replace(/\s*([×÷=+])\s*/g, " $1 ")
    .trim();
}

const ATAS = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const pangkat = (p) => (/^\d+$/.test(p) ? [...p].map((c) => ATAS[c]).join("") : `^(${p})`);

/** Angka di dalam teks tanpa pemisah ribuan: "Rp6.000" → "6000". */
export const angkaDari = (s) => (String(s).match(/\d[\d.,]*/g) ?? []).map((a) => a.replace(/[.,](?=\d{3}(\D|$))/g, ""));
