import { T, KAT, NAMA, frac, fr, gcd } from "./lib.mjs";

const SEGI = {
  3: ["segitiga", "triangular", "三角"],
  4: ["segi empat", "rectangular", "四角"],
  5: ["segi lima", "pentagonal", "五角"],
  6: ["segi enam", "hexagonal", "六角"],
  7: ["segi tujuh", "heptagonal", "七角"],
  8: ["segi delapan", "octagonal", "八角"],
  9: ["segi sembilan", "nonagonal", "九角"],
};

export default [
  T(KAT.KMNR, ["Volume kubus", "Volume of a cube", "正方體體積"], "mudah", (r, { t, fmt }) => {
    const s = r.int(3, 12);
    return {
      pertanyaan: t(`Sebuah kubus memiliki panjang rusuk ${s} cm. Volume kubus itu adalah ...`, `A cube has edges ${s} cm long. What is its volume?`, `一個正方體的邊長是 ${s} 公分，它的體積是多少？`),
      jawaban: s ** 3,
      satuan: "cm³",
      salah: [s * s, 6 * s * s, 12 * s],
      visual: { j: "balok", p: s, l: s, t: s, satuan: "cm", hasil: `${s} × ${s} × ${s} = ${fmt(s ** 3)}` },
      pembahasan: [
        t(`Volume kubus = rusuk × rusuk × rusuk.`, `Volume of a cube = edge × edge × edge.`, `正方體體積 = 邊長 × 邊長 × 邊長。`),
        `$${s} \\times ${s} \\times ${s} = ${fmt(s ** 3)}$ cm³`,
      ],
    };
  }),
  T(KAT.KMNR, ["Volume balok", "Volume of a cuboid", "長方體體積"], "mudah", (r, { t }) => {
    const p = r.int(5, 15), l = r.int(3, 10), h = r.int(2, 9);
    return {
      pertanyaan: t(
        `Sebuah akuarium berbentuk balok berukuran panjang ${p} dm, lebar ${l} dm, dan tinggi ${h} dm. Volume akuarium itu adalah ...`,
        `A cuboid fish tank is ${p} dm long, ${l} dm wide and ${h} dm high. What is its volume?`,
        `一個長方體魚缸長 ${p} 公寸、寬 ${l} 公寸、高 ${h} 公寸。它的體積是多少？`,
      ),
      jawaban: p * l * h,
      satuan: "dm³",
      salah: [p * l, p + l + h, 2 * (p * l + p * h + l * h), p * l * h + p],
      visual: { j: "balok", p, l, t: h, satuan: "dm", hasil: `${p} × ${l} × ${h} = ${p * l * h}` },
      pembahasan: [
        t(`Volume balok = panjang × lebar × tinggi.`, `Volume of a cuboid = length × width × height.`, `長方體體積 = 長 × 寬 × 高。`),
        t(`$${p} \\times ${l} \\times ${h} = ${p * l * h}$ dm³ (sama dengan ${p * l * h} liter).`, `$${p} \\times ${l} \\times ${h} = ${p * l * h}$ dm³ (the same as ${p * l * h} litres).`, `$${p} \\times ${l} \\times ${h} = ${p * l * h}$ dm³（等於 ${p * l * h} 公升）。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Kecepatan", "Speed", "速率"], "sedang", (r, { t }) => {
    const v = r.int(6, 16) * 5, h = r.int(2, 5);
    return {
      pertanyaan: t(
        `Sebuah bus melaju dengan kecepatan rata-rata ${v} km/jam selama ${h} jam. Berapa jarak yang ditempuh bus itu?`,
        `A bus travels at an average speed of ${v} km/h for ${h} hours. How far does it travel?`,
        `一輛公車以平均每小時 ${v} 公里的速率行駛 ${h} 小時，共行駛了多遠？`,
      ),
      jawaban: v * h,
      satuan: "km",
      langkah: 5,
      salah: [v + h, v * (h + 1), v * (h - 1)],
      visual: { j: "perjalanan", v, jam: h, hasil: v * h },
      pembahasan: [
        t(`Jarak = kecepatan × waktu.`, `Distance = speed × time.`, `距離 = 速率 × 時間。`),
        `$${v} \\times ${h} = ${v * h}$ km`,
      ],
    };
  }),
  T(KAT.OSN, ["Kecepatan", "Speed", "速率"], "sulit", (r, { t, jam, pukul }) => {
    const v = r.pick([40, 60, 80]), menit = r.pick([30, 45, 90, 120, 150, 75]), j = (v * menit) / 60;
    if (!Number.isInteger(j)) return null;
    const h = r.int(6, 9), m0 = r.pick([0, 15, 30]), pak = r.pick(["Budi", "Andi", "Wayan", "Lukas"]);
    const tot = h * 60 + m0 + menit, eh = Math.floor(tot / 60), em = tot % 60;
    const jj = Math.floor(menit / 60), mm = menit % 60;
    const durTeks = [jj ? t(`${jj} jam`, `${jj} h`, `${jj} 小時`) : "", mm ? t(`${mm} menit`, `${mm} min`, `${mm} 分鐘`) : ""].filter(Boolean).join(" ");
    const f = (mins) => pukul(Math.floor(mins / 60), mins % 60);
    return {
      pertanyaan: t(
        `Pak ${pak} berangkat pukul ${jam(h, m0)} dan mengendarai mobil sejauh ${j} km dengan kecepatan rata-rata ${v} km/jam. Pukul berapa ia tiba?`,
        `Mr ${pak} leaves at ${jam(h, m0)} and drives ${j} km at an average speed of ${v} km/h. What time does he arrive?`,
        `${pak} 先生 ${jam(h, m0)} 出發，以平均每小時 ${v} 公里的速率開車 ${j} 公里。他幾點到達？`,
      ),
      jawaban: f(tot),
      salah: [f(tot + 15), f(tot - 15), f(tot + 60)],
      visual: { j: "perjalanan", v, jarak: j, mulai: [h, m0], selesai: [eh, em] },
      pembahasan: [
        t(`Waktu tempuh = jarak : kecepatan $= ${fr(j, v)}$ jam = ${menit} menit = ${durTeks}.`, `Time = distance ÷ speed $= ${fr(j, v)}$ h = ${menit} min = ${durTeks}.`, `時間 = 距離 ÷ 速率 $= ${fr(j, v)}$ 小時 = ${menit} 分鐘 = ${durTeks}。`),
        t(`Berangkat pukul ${jam(h, m0)}, ditambah ${durTeks}.`, `Start at ${jam(h, m0)} and add ${durTeks}.`, `從 ${jam(h, m0)} 加上 ${durTeks}。`),
        t(`Tiba pukul ${jam(eh, em)}.`, `He arrives at ${jam(eh, em)}.`, `${jam(eh, em)} 到達。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Persen", "Percentages", "百分率"], "mudah", (r, { t }) => {
    const p = r.pick([10, 20, 25, 40, 50, 75]), n = r.int(2, 20) * 20, ans = (n * p) / 100;
    return {
      pertanyaan: t(`${p}% dari ${n} adalah ...`, `What is ${p}% of ${n}?`, `${n} 的 ${p}% 是多少？`),
      jawaban: ans,
      salah: [n - ans, ans / 2, ans + 10, p],
      visual: { j: "persen", p, total: n, hasil: ans },
      pembahasan: [
        t(`${p}% artinya $${fr(p, 100)}$.`, `${p}% means $${fr(p, 100)}$.`, `${p}% 就是 $${fr(p, 100)}$。`),
        `$${fr(p, 100)} \\times ${n} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KSM, ["Diskon", "Discounts", "折扣"], "sedang", (r, { t, rp, fmt }) => {
    const harga = r.int(4, 20) * 10000, p = r.pick([10, 20, 25, 30, 50]), disk = (harga * p) / 100;
    return {
      pertanyaan: t(
        `Harga sepasang sepatu ${rp(harga)}. Toko memberi diskon ${p}%. Berapa yang harus dibayar?`,
        `A pair of shoes costs ${rp(harga)}. The shop gives a ${p}% discount. How much do you pay?`,
        `一雙鞋子 ${rp(harga)}，商店打 ${p}% 的折扣（減去 ${p}%）。要付多少錢？`,
      ),
      prefix: "Rp",
      langkah: 5000,
      jawaban: harga - disk,
      salah: [disk, harga - p * 1000, harga],
      visual: { j: "persen", p, total: fmt(harga), diskon: true, hasil: fmt(harga - disk) },
      pembahasan: [
        t(`Besar diskon: $${p}\\% \\times ${fmt(harga)} = ${fmt(disk)}$.`, `Discount: $${p}\\% \\times ${fmt(harga)} = ${fmt(disk)}$.`, `折扣金額：$${p}\\% \\times ${fmt(harga)} = ${fmt(disk)}$。`),
        t(`Yang dibayar: $${fmt(harga)} - ${fmt(disk)} = ${fmt(harga - disk)}$.`, `You pay: $${fmt(harga)} - ${fmt(disk)} = ${fmt(harga - disk)}$.`, `要付：$${fmt(harga)} - ${fmt(disk)} = ${fmt(harga - disk)}$。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Perbandingan", "Ratios", "比"], "sedang", (r, { t, rp, fmt }) => {
    const [a, b] = r.pick([[2, 3], [3, 5], [1, 4], [3, 4], [2, 5], [4, 5], [1, 3]]), k = r.int(3, 12) * 1000, Tt = (a + b) * k;
    const [n1, n2] = r.sample(NAMA, 2);
    return {
      pertanyaan: t(
        `Perbandingan uang ${n1} dan ${n2} adalah $${a} : ${b}$. Jumlah uang mereka ${rp(Tt)}. Berapa uang ${n1}?`,
        `The ratio of ${n1}'s money to ${n2}'s money is $${a} : ${b}$. Together they have ${rp(Tt)}. How much money does ${n1} have?`,
        `${n1} 和 ${n2} 的錢的比是 $${a} : ${b}$，兩人共有 ${rp(Tt)}。${n1} 有多少錢？`,
      ),
      prefix: "Rp",
      langkah: 1000,
      jawaban: a * k,
      salah: [b * k, k, Tt / 2],
      visual: { j: "bagian", baris: [{ label: n1, n: a }, { label: n2, n: b }], nilai: fmt(k), total: fmt(Tt), hasil: fmt(a * k) },
      pembahasan: [
        t(`Jumlah bagian: $${a} + ${b} = ${a + b}$ bagian.`, `Total parts: $${a} + ${b} = ${a + b}$.`, `總份數：$${a} + ${b} = ${a + b}$ 份。`),
        t(`Satu bagian $= ${fmt(Tt)} : ${a + b} = ${fmt(k)}$.`, `One part $= ${fmt(Tt)} \\div ${a + b} = ${fmt(k)}$.`, `一份 $= ${fmt(Tt)} \\div ${a + b} = ${fmt(k)}$。`),
        t(`Uang ${n1} $= ${a} \\times ${fmt(k)} = ${fmt(a * k)}$.`, `${n1}'s money $= ${a} \\times ${fmt(k)} = ${fmt(a * k)}$.`, `${n1} 的錢 $= ${a} \\times ${fmt(k)} = ${fmt(a * k)}$。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Rata-rata", "Averages", "平均數"], "mudah", (r, { t }) => {
    const v = [r.int(60, 95), r.int(60, 95), r.int(60, 95)];
    const sum3 = v[0] + v[1] + v[2];
    let x = r.int(60, 95);
    while ((sum3 + x) % 4 !== 0) x++;
    v.push(x);
    const S = sum3 + x, ans = S / 4, n = r.pick(NAMA);
    return {
      pertanyaan: t(`Nilai ulangan ${n} adalah ${v.join(", ")}. Rata-rata nilainya adalah ...`, `${n}'s test scores are ${v.join(", ")}. What is the average score?`, `${n} 的考試分數是 ${v.join("、")}，平均是幾分？`),
      jawaban: ans,
      salah: [ans + 2, ans - 2, Math.max(...v), ans + 1],
      visual: { j: "rata", data: v, hasil: ans },
      pembahasan: [
        t(`Jumlah semua nilai: $${v.join(" + ")} = ${S}$.`, `Sum of the scores: $${v.join(" + ")} = ${S}$.`, `總分：$${v.join(" + ")} = ${S}$。`),
        t(`Rata-rata = jumlah : banyak data $= ${S} : 4 = ${ans}$.`, `Average = sum ÷ number of scores $= ${S} \\div 4 = ${ans}$.`, `平均 = 總分 ÷ 次數 $= ${S} \\div 4 = ${ans}$。`),
      ],
    };
  }),
  T(KAT.OSN, ["Rata-rata", "Averages", "平均數"], "sulit", (r, { t }) => {
    const R = r.int(75, 88), v = [r.int(65, 95), r.int(65, 95), r.int(65, 95)], s3 = v[0] + v[1] + v[2], x = 4 * R - s3;
    if (x < 60 || x > 100) return null;
    const n = r.pick(NAMA);
    return {
      pertanyaan: t(
        `Rata-rata 4 nilai ulangan ${n} adalah ${R}. Tiga nilai pertamanya ${v.join(", ")}. Berapa nilai ulangan keempat?`,
        `The average of ${n}'s 4 test scores is ${R}. The first three scores are ${v.join(", ")}. What is the fourth score?`,
        `${n} 4 次考試的平均是 ${R} 分，前三次是 ${v.join("、")} 分。第四次考幾分？`,
      ),
      jawaban: x,
      salah: [R, x + 4, x - 4, Math.round(s3 / 3)],
      visual: { j: "rata", data: [...v, null], target: R, hasil: x },
      pembahasan: [
        t(`Jumlah keempat nilai $= ${R} \\times 4 = ${4 * R}$.`, `Sum of all four scores $= ${R} \\times 4 = ${4 * R}$.`, `四次的總分 $= ${R} \\times 4 = ${4 * R}$。`),
        t(`Jumlah tiga nilai pertama $= ${v.join(" + ")} = ${s3}$.`, `Sum of the first three $= ${v.join(" + ")} = ${s3}$.`, `前三次的總分 $= ${v.join(" + ")} = ${s3}$。`),
        t(`Nilai keempat $= ${4 * R} - ${s3} = ${x}$.`, `Fourth score $= ${4 * R} - ${s3} = ${x}$.`, `第四次 $= ${4 * R} - ${s3} = ${x}$。`),
      ],
    };
  }),
  T(KAT.KSM, ["Bilangan bulat", "Integers", "整數"], "mudah", (r, { t }) => {
    const a = r.int(2, 12), b = r.int(5, 20), kota = r.pick(["Dieng", "Puncak Jaya", "Bromo", "Cartenz"]);
    return {
      pertanyaan: t(
        `Suhu di ${kota} pada pagi hari $-${a}^\\circ$C. Pada siang hari suhunya naik ${b}°C. Suhu pada siang hari adalah ...`,
        `In the morning the temperature at ${kota} is $-${a}^\\circ$C. By noon it rises by ${b}°C. What is the temperature at noon?`,
        `${kota} 早上的氣溫是 $-${a}^\\circ$C，中午上升了 ${b}°C。中午的氣溫是多少？`,
      ),
      jawaban: b - a,
      negatif: true,
      akhiran: "°C",
      salah: [a + b, -(a + b), a - b],
      visual: { j: "garis", min: -a - 1, max: b - a + 1, mulai: -a, lompat: [{ ke: b - a, label: `+${b}` }], tanya: b - a, tanyaNanti: true },
      pembahasan: [
        t(`Naik berarti ditambah: $-${a} + ${b}$.`, `Rising means adding: $-${a} + ${b}$.`, `上升就是加：$-${a} + ${b}$。`),
        t(`Mulai dari $-${a}$, lalu maju ${b} langkah pada garis bilangan: $-${a} + ${b} = ${b - a}$.`, `Start at $-${a}$ and move ${b} steps right on the number line: $-${a} + ${b} = ${b - a}$.`, `從 $-${a}$ 開始，在數線上往右走 ${b} 格：$-${a} + ${b} = ${b - a}$。`),
      ],
    };
  }),
  T(KAT.KOSSMI, ["Akar pangkat tiga", "Cube roots", "立方根"], "sedang", (r, { t, fmt }) => {
    const s = r.int(2, 12), n = s ** 3;
    return {
      pertanyaan: t(`Hasil dari $\\sqrt[3]{${n}}$ adalah ...`, `What is $\\sqrt[3]{${n}}$?`, `$\\sqrt[3]{${n}} = ?$`),
      jawaban: s,
      salah: [s + 1, s - 1, s * 3, s * s],
      visual: { j: "balok", p: s, l: s, t: s, tanyaSisi: true, satuan: "", hasil: `${s} × ${s} × ${s} = ${fmt(n)}` },
      pembahasan: [
        t(`Cari bilangan yang jika dikali tiga kali dengan dirinya sendiri hasilnya ${fmt(n)}.`, `Find the number that, multiplied by itself three times, gives ${fmt(n)}.`, `找出自己連乘三次等於 ${fmt(n)} 的數。`),
        `$${s} \\times ${s} \\times ${s} = ${n}$, $\\sqrt[3]{${n}} = ${s}$`,
      ],
    };
  }),
  T(KAT.OSN, ["Pola bilangan", "Number patterns", "數字規律"], "sulit", (r, { t }) => {
    const n = r.int(6, 15), L = 2 * n - 1;
    return {
      pertanyaan: t(`Hasil dari $1 + 3 + 5 + 7 + \\cdots + ${L}$ adalah ...`, `What is $1 + 3 + 5 + 7 + \\cdots + ${L}$?`, `$1 + 3 + 5 + 7 + \\cdots + ${L} = ?$`),
      jawaban: n * n,
      salah: [n * (n + 1), L * n, n * n - 1, L * L],
      visual: { j: "titik", bentuk: "ganjil", suku: [1, 2, 3], tanya: n, jawab: n * n },
      pembahasan: [
        t(`Perhatikan polanya: `, `Look at the pattern: `, `觀察規律：`) + `$1 = 1^2$, $1 + 3 = 4 = 2^2$, $1 + 3 + 5 = 9 = 3^2$`,
        t(`Jumlah beberapa bilangan ganjil pertama = banyak suku dikuadratkan.`, `The sum of the first few odd numbers = (number of terms) squared.`, `前幾個奇數的和 = 項數的平方。`),
        t(`Banyak suku dari 1 sampai ${L}: $(${L} + 1) : 2 = ${n}$. Jadi jumlahnya $${n}^2 = ${n * n}$.`, `Number of terms from 1 to ${L}: $(${L} + 1) \\div 2 = ${n}$. So the sum is $${n}^2 = ${n * n}$.`, `1 到 ${L} 共有 $(${L} + 1) \\div 2 = ${n}$ 項，所以和是 $${n}^2 = ${n * n}$。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Skala", "Map scale", "比例尺"], "sedang", (r, { t, fmt }) => {
    const s = r.pick([100000, 200000, 250000, 500000, 1000000]), c = r.int(2, 12), km = (c * s) / 100000;
    if (!Number.isInteger(km)) return null;
    return {
      pertanyaan: t(
        `Jarak dua kota pada peta adalah ${c} cm. Skala peta itu $1 : ${fmt(s)}$. Jarak sebenarnya kedua kota adalah ...`,
        `Two towns are ${c} cm apart on a map. The map scale is $1 : ${fmt(s)}$. What is the real distance between the towns?`,
        `地圖上兩座城市相距 ${c} 公分，比例尺是 $1 : ${fmt(s)}$。兩城市實際相距多遠？`,
      ),
      jawaban: km,
      satuan: "km",
      salah: [km * 10, km / 10, c * (s / 1000)],
      visual: { j: "bagian", baris: [{ label: `${c} cm`, n: c }], nilai: `${fmt(s / 100000)} km`, hasil: `${fmt(km)} km` },
      pembahasan: [
        t(`Jarak sebenarnya $= ${c} \\times ${fmt(s)} = ${fmt(c * s)}$ cm.`, `Real distance $= ${c} \\times ${fmt(s)} = ${fmt(c * s)}$ cm.`, `實際距離 $= ${c} \\times ${fmt(s)} = ${fmt(c * s)}$ 公分。`),
        t(`1 km = ${fmt(100000)} cm, jadi $${fmt(c * s)} : ${fmt(100000)} = ${km}$ km.`, `1 km = ${fmt(100000)} cm, so $${fmt(c * s)} \\div ${fmt(100000)} = ${km}$ km.`, `1 公里 = ${fmt(100000)} 公分，所以 $${fmt(c * s)} \\div ${fmt(100000)} = ${km}$ 公里。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Debit", "Flow rate", "流量"], "sedang", (r, { t }) => {
    const d = r.int(2, 15), m = r.int(5, 30), V = d * m;
    return {
      pertanyaan: t(
        `Sebuah keran dapat mengisi bak berisi ${V} liter dalam waktu ${m} menit. Debit air keran itu adalah ...`,
        `A tap fills a ${V}-litre tub in ${m} minutes. What is the flow rate of the tap?`,
        `一個水龍頭 ${m} 分鐘可以裝滿 ${V} 公升的水桶。水龍頭的流量是多少？`,
      ),
      jawaban: d,
      satuan: t("liter/menit", "litres/minute", "公升/分鐘"),
      salah: [V - m, d + 1, d - 1, d * 2],
      visual: { j: "bagian", baris: [{ label: `${m}′`, n: m }], nilai: `${d} L`, total: `${V} L`, hasil: `${d} L` },
      pembahasan: [
        t(`Debit = volume : waktu.`, `Flow rate = volume ÷ time.`, `流量 = 容量 ÷ 時間。`),
        t(`$${V} : ${m} = ${d}$ liter/menit.`, `$${V} \\div ${m} = ${d}$ litres/minute.`, `$${V} \\div ${m} = ${d}$ 公升/分鐘。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Perkalian pecahan", "Multiplying fractions", "分數乘法"], "sedang", (r, { t }) => {
    const b = r.int(2, 9), d = r.int(2, 9), a = r.int(1, b - 1), c = r.int(1, d - 1);
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1) return null;
    const ans = frac(a * c, b * d), g = gcd(a * c, b * d);
    return {
      pertanyaan: t(`Hasil dari $${fr(a, b)} \\times ${fr(c, d)}$ adalah ...`, `What is $${fr(a, b)} \\times ${fr(c, d)}$?`, `$${fr(a, b)} \\times ${fr(c, d)} = ?$`),
      jawaban: ans,
      salah: [frac(a + c, b + d), frac(a * d, b * c), frac(a * c, b + d), frac(a * c + 1, b * d)].filter((x) => x !== ans),
      visual: { j: "pecahanKali", a, b, c, d },
      pembahasan: [
        t(`Kalikan pembilang dengan pembilang dan penyebut dengan penyebut.`, `Multiply numerator by numerator and denominator by denominator.`, `分子乘分子，分母乘分母。`),
        `$${fr(a, b)} \\times ${fr(c, d)} = ${fr(`${a} \\times ${c}`, `${b} \\times ${d}`)} = ${fr(a * c, b * d)}$`,
        ...(g > 1 ? [t(`Sederhanakan (bagi dengan ${g}): ${ans}.`, `Simplify (divide by ${g}): ${ans}.`, `約分（同除以 ${g}）：${ans}。`)] : []),
      ],
    };
  }),
  T(KAT.OMNAS, ["Pembagian pecahan", "Dividing fractions", "分數除法"], "sulit", (r, { t }) => {
    const b = r.int(2, 9), d = r.int(2, 9), a = r.int(1, b - 1), c = r.int(1, d - 1);
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || a * d === b * c) return null;
    const ans = frac(a * d, b * c);
    const bagi = t(":", "\\div", "\\div");
    return {
      pertanyaan: t(`Hasil dari $${fr(a, b)} : ${fr(c, d)}$ adalah ...`, `What is $${fr(a, b)} \\div ${fr(c, d)}$?`, `$${fr(a, b)} \\div ${fr(c, d)} = ?$`),
      jawaban: ans,
      salah: [frac(a * c, b * d), frac(b * c, a * d), frac(a + d, b + c)].filter((x) => x !== ans),
      visual: { j: "pecahan", bar: [{ a, b }, { a: c, b: d }], op: ":" },
      pembahasan: [
        t(`Membagi dengan pecahan sama dengan mengalikan dengan kebalikannya.`, `Dividing by a fraction is the same as multiplying by its reciprocal.`, `除以一個分數，等於乘以它的倒數。`),
        `$${fr(a, b)} ${bagi} ${fr(c, d)} = ${fr(a, b)} \\times ${fr(d, c)} = ${fr(a * d, b * c)}$`,
        t(`Bentuk paling sederhana: ${ans}.`, `Simplest form: ${ans}.`, `最簡分數：${ans}。`),
      ],
    };
  }),
  T(KAT.OSN, ["Bangun ruang", "3D shapes", "立體圖形"], "sulit", (r, { t }) => {
    const n = r.int(3, 9), jenis = r.int(0, 2);
    const nama = t(["rusuk", "sisi", "titik sudut"][jenis], ["edges", "faces", "vertices"][jenis], ["邊", "面", "頂點"][jenis]);
    const ans = [3 * n, n + 2, 2 * n][jenis];
    const sg = t(SEGI[n][0], SEGI[n][1], SEGI[n][2]);
    return {
      pertanyaan: t(`Banyak ${nama} pada prisma ${sg} adalah ...`, `How many ${nama} does a ${sg} prism have?`, `${sg}柱有幾個${nama}？`),
      jawaban: ans,
      salah: [3 * n, n + 2, 2 * n, n].filter((v) => v !== ans).concat([ans + 1]),
      visual: { j: "prisma", n, tanya: jenis, hasil: ans },
      pembahasan: [
        t(`Prisma ${sg} punya alas dan tutup berbentuk segi-${n} (masing-masing ${n} titik sudut dan ${n} rusuk).`, `A ${sg} prism has a top and a bottom that are ${n}-sided shapes (each with ${n} vertices and ${n} edges).`, `${sg}柱的上下底面都是 ${n} 邊形（各有 ${n} 個頂點和 ${n} 條邊）。`),
        [
          t(`Rusuk: ${n} di alas + ${n} di tutup + ${n} rusuk tegak $= 3 \\times ${n} = ${ans}$.`, `Edges: ${n} on the bottom + ${n} on the top + ${n} upright edges $= 3 \\times ${n} = ${ans}$.`, `邊：底面 ${n} 條 + 頂面 ${n} 條 + 側邊 ${n} 條 $= 3 \\times ${n} = ${ans}$。`),
          t(`Sisi: 1 alas + 1 tutup + ${n} sisi tegak $= ${n} + 2 = ${ans}$.`, `Faces: 1 bottom + 1 top + ${n} side faces $= ${n} + 2 = ${ans}$.`, `面：1 個底面 + 1 個頂面 + ${n} 個側面 $= ${n} + 2 = ${ans}$。`),
          t(`Titik sudut: ${n} di alas + ${n} di tutup $= 2 \\times ${n} = ${ans}$.`, `Vertices: ${n} on the bottom + ${n} on the top $= 2 \\times ${n} = ${ans}$.`, `頂點：底面 ${n} 個 + 頂面 ${n} 個 $= 2 \\times ${n} = ${ans}$。`),
        ][jenis],
      ],
    };
  }),
  T(KAT.OSN, ["Pekerjaan bersama", "Working together", "工程問題"], "sulit", (r, { t }) => {
    const [a, b, ans] = r.pick([[3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 15, 6], [12, 24, 8], [20, 30, 12], [6, 30, 5]]);
    const L = (a * b) / gcd(a, b), n = r.pick(NAMA);
    const [ci, ce, cz] = r.pick([
      ["mengecat pagar sekolah", "paint the school fence", "油漆學校的圍牆"],
      ["merapikan perpustakaan", "tidy the library", "整理圖書館"],
      ["menanam bibit di kebun", "plant the seedlings in the garden", "在菜園種完幼苗"],
    ]);
    return {
      pertanyaan: t(
        `${n} dapat ${ci} sendirian dalam ${a} hari. Temannya dapat melakukannya sendirian dalam ${b} hari. Jika mereka bekerja bersama-sama, pekerjaan itu selesai dalam ...`,
        `${n} can ${ce} alone in ${a} days. A friend can do it alone in ${b} days. If they work together, how long will the job take?`,
        `${n} 一個人 ${a} 天可以${cz}，朋友一個人要 ${b} 天。兩人一起做，幾天可以完成？`,
      ),
      jawaban: ans,
      satuan: t("hari", "days", "天"),
      salah: [(a + b) / 2, a + b, ans + 1, b - a],
      visual: { j: "model", total: L, bagian: Array.from({ length: ans }, () => ({ nilai: L / a + L / b, label: `${L / a}+${L / b}` })), sembunyi: true, hasil: ans },
      pembahasan: [
        t(`Dalam 1 hari, ${n} menyelesaikan $${fr(1, a)}$ pekerjaan dan temannya $${fr(1, b)}$ pekerjaan.`, `In 1 day, ${n} does $${fr(1, a)}$ of the job and the friend does $${fr(1, b)}$.`, `1 天內 ${n} 完成 $${fr(1, a)}$，朋友完成 $${fr(1, b)}$。`),
        t(`Bersama dalam 1 hari: `, `Together in 1 day: `, `兩人 1 天合計：`) + `$${fr(1, a)} + ${fr(1, b)} = ${fr(L / a, L)} + ${fr(L / b, L)} = ${fr(L / a + L / b, L)} = ${fr(1, ans)}$`,
        t(`Jadi seluruh pekerjaan selesai dalam ${ans} hari.`, `So the whole job takes ${ans} days.`, `所以全部完成需要 ${ans} 天。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Umur", "Ages", "年齡問題"], "sulit", (r, { t }) => {
    const B = r.int(8, 14), k = r.pick([3, 4]), tt = r.int(3, 6), A = k * (B - tt) + tt, S = A + B, n = r.pick(NAMA);
    if (A < 25 || A > 55) return null;
    return {
      pertanyaan: t(
        `Jumlah umur ${n} dan ayahnya sekarang ${S} tahun. ${tt} tahun yang lalu, umur ayah ${k} kali umur ${n}. Berapa umur ${n} sekarang?`,
        `${n} and Dad's ages add up to ${S} years now. ${tt} years ago, Dad was ${k} times as old as ${n}. How old is ${n} now?`,
        `${n} 和爸爸現在的年齡加起來是 ${S} 歲。${tt} 年前，爸爸的年齡是 ${n} 的 ${k} 倍。${n} 現在幾歲？`,
      ),
      jawaban: B,
      satuan: t("tahun", "years", "歲"),
      salah: [B - tt, B + tt, Math.round(S / (k + 1))],
      visual: { j: "banding", baris: [{ label: t("Ayah", "Father", "父親"), nilai: A, tanya: true }, { label: n, nilai: B, tanya: true }], total: S },
      pembahasan: [
        t(`${tt} tahun yang lalu, jumlah umur mereka $= ${S} - 2 \\times ${tt} = ${S - 2 * tt}$ tahun.`, `${tt} years ago, their ages added up to $${S} - 2 \\times ${tt} = ${S - 2 * tt}$ years.`, `${tt} 年前，兩人年齡和是 $${S} - 2 \\times ${tt} = ${S - 2 * tt}$ 歲。`),
        t(`Saat itu umur ayah ${k} bagian dan umur ${n} 1 bagian, total ${k + 1} bagian. Satu bagian $= ${S - 2 * tt} : ${k + 1} = ${B - tt}$ tahun.`, `Then Dad was ${k} parts and ${n} was 1 part, ${k + 1} parts in all. One part $= ${S - 2 * tt} \\div ${k + 1} = ${B - tt}$ years.`, `那時爸爸是 ${k} 份、${n} 是 1 份，共 ${k + 1} 份。一份 $= ${S - 2 * tt} \\div ${k + 1} = ${B - tt}$ 歲。`),
        t(`Umur ${n} sekarang $= ${B - tt} + ${tt} = ${B}$ tahun. (Cek: umur ayah sekarang ${A}, dan $${A} + ${B} = ${S}$.)`, `${n} is now $${B - tt} + ${tt} = ${B}$ years old. (Check: Dad is ${A}, and $${A} + ${B} = ${S}$.)`, `${n} 現在 $${B - tt} + ${tt} = ${B}$ 歲。（驗算：爸爸 ${A} 歲，$${A} + ${B} = ${S}$。）`),
      ],
    };
  }),
  T(KAT.KSM, ["Persen", "Percentages", "百分率"], "sedang", (r, { t, rp, fmt }) => {
    const a = r.int(2, 10) * 10000, p = r.pick([10, 20, 25, 50]), b = (a * (100 + p)) / 100;
    return {
      pertanyaan: t(
        `Harga sebuah tas naik dari ${rp(a)} menjadi ${rp(b)}. Kenaikan harganya sebesar ...`,
        `The price of a bag goes up from ${rp(a)} to ${rp(b)}. By what percentage did the price increase?`,
        `一個包包的價錢從 ${rp(a)} 漲到 ${rp(b)}，漲了百分之幾？`,
      ),
      jawaban: p,
      akhiran: "%",
      langkah: 5,
      salah: [p * 2, (b - a) / 1000, 100 + p],
      visual: { j: "banding", baris: [{ label: t("Awal", "Before", "原價"), nilai: a }, { label: t("Sekarang", "Now", "現價"), nilai: b }], selisih: fmt(b - a), hasil: `${p}%` },
      pembahasan: [
        t(`Kenaikan harga: $${fmt(b)} - ${fmt(a)} = ${fmt(b - a)}$.`, `Increase: $${fmt(b)} - ${fmt(a)} = ${fmt(b - a)}$.`, `漲價：$${fmt(b)} - ${fmt(a)} = ${fmt(b - a)}$。`),
        t(`Persentase kenaikan `, `Percentage increase `, `漲幅 `) + `$= ${fr(fmt(b - a), fmt(a))} \\times 100\\% = ${p}\\%$`,
      ],
    };
  }),
];
