import { T, KAT, NAMA, frac, fr, gcd, lcm, isPrime, factors, roman } from "./lib.mjs";

const kelipatan = (a, sampai) => Array.from({ length: Math.floor(sampai / a) }, (_, i) => a * (i + 1));

export default [
  T(KAT.KMNR, ["KPK", "LCM", "最小公倍數"], "sedang", (r, { t }) => {
    const [a, b] = r.pick([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [12, 18], [9, 12], [4, 10], [6, 15], [8, 10]]);
    const L = lcm(a, b), sep = t(", ", ", ", "、");
    return {
      pertanyaan: t(`KPK dari ${a} dan ${b} adalah ...`, `What is the LCM (least common multiple) of ${a} and ${b}?`, `${a} 和 ${b} 的最小公倍數是多少？`),
      jawaban: L,
      salah: [a * b, gcd(a, b), L * 2, L / 2],
      pembahasan: [
        t(`Kelipatan ${a}: `, `Multiples of ${a}: `, `${a} 的倍數：`) + kelipatan(a, L).join(sep) + " ...",
        t(`Kelipatan ${b}: `, `Multiples of ${b}: `, `${b} 的倍數：`) + kelipatan(b, L).join(sep) + " ...",
        t(`Kelipatan persekutuan yang paling kecil adalah ${L}.`, `The smallest common multiple is ${L}.`, `最小的公倍數是 ${L}。`),
      ],
    };
  }),
  T(KAT.KMNR, ["FPB", "GCF", "最大公因數"], "sedang", (r, { t }) => {
    const [a, b] = r.pick([[12, 18], [16, 24], [18, 24], [20, 30], [24, 36], [15, 25], [28, 42], [32, 48], [18, 27], [24, 40]]);
    const G = gcd(a, b), sep = t(", ", ", ", "、");
    return {
      pertanyaan: t(`FPB dari ${a} dan ${b} adalah ...`, `What is the GCF (greatest common factor) of ${a} and ${b}?`, `${a} 和 ${b} 的最大公因數是多少？`),
      jawaban: G,
      salah: [lcm(a, b), G / 2, G * 2, a],
      pembahasan: [
        t(`Faktor ${a}: `, `Factors of ${a}: `, `${a} 的因數：`) + factors(a).join(sep),
        t(`Faktor ${b}: `, `Factors of ${b}: `, `${b} 的因數：`) + factors(b).join(sep),
        t(`Faktor persekutuan yang paling besar adalah ${G}.`, `The greatest common factor is ${G}.`, `最大的公因數是 ${G}。`),
      ],
    };
  }),
  T(KAT.OSN, ["KPK", "LCM", "最小公倍數"], "sulit", (r, { t }) => {
    const [a, b] = r.pick([[4, 6], [6, 10], [8, 12], [5, 6], [9, 12], [6, 8], [10, 15], [4, 14]]);
    const L = lcm(a, b), konteks = r.int(0, 1), n = r.pick(NAMA), sep = t(", ", ", ", "、");
    return {
      pertanyaan: konteks === 0
        ? t(
            `Lampu merah berkedip setiap ${a} detik dan lampu hijau berkedip setiap ${b} detik. Jika sekarang keduanya berkedip bersamaan, setelah berapa detik keduanya berkedip bersamaan lagi?`,
            `A red light flashes every ${a} seconds and a green light every ${b} seconds. They flash together now. After how many seconds will they flash together again?`,
            `紅燈每 ${a} 秒閃一次，綠燈每 ${b} 秒閃一次。現在兩燈同時閃，幾秒後會再同時閃？`,
          )
        : t(
            `${n} berenang setiap ${a} hari sekali, sedangkan temannya berenang setiap ${b} hari sekali. Hari ini mereka berenang bersama. Setelah berapa hari mereka akan berenang bersama lagi?`,
            `${n} goes swimming every ${a} days and a friend goes every ${b} days. They swim together today. After how many days will they swim together again?`,
            `${n} 每 ${a} 天游泳一次，朋友每 ${b} 天游泳一次。今天他們一起游泳，幾天後會再一起游泳？`,
          ),
      jawaban: L,
      satuan: konteks === 0 ? t("detik", "seconds", "秒") : t("hari", "days", "天"),
      salah: [a * b === L ? L * 2 : a * b, a + b, gcd(a, b)],
      pembahasan: [
        t(`Waktu bersamaan lagi adalah kelipatan persekutuan terkecil (KPK) dari ${a} dan ${b}.`, `The next time together is the least common multiple (LCM) of ${a} and ${b}.`, `下一次同時發生的時間是 ${a} 和 ${b} 的最小公倍數。`),
        t(`Kelipatan ${a}: `, `Multiples of ${a}: `, `${a} 的倍數：`) + kelipatan(a, L).join(sep) + ". " + t(`Kelipatan ${b}: `, `Multiples of ${b}: `, `${b} 的倍數：`) + kelipatan(b, L).join(sep) + ".",
        t(`KPK = ${L}.`, `LCM = ${L}.`, `最小公倍數 = ${L}。`),
      ],
    };
  }),
  T(KAT.OSN, ["FPB", "GCF", "最大公因數"], "sulit", (r, { t }) => {
    const g = r.int(3, 9), m = r.int(2, 7), n = r.int(2, 7);
    if (m === n || gcd(m, n) !== 1) return null;
    const x = g * m, y = g * n, bu = r.pick(["Rina", "Siti", "Ketut", "Maria"]), sep = t(", ", ", ", "、");
    return {
      pertanyaan: t(
        `Bu ${bu} punya ${x} apel dan ${y} jeruk. Buah-buah itu akan dimasukkan ke dalam keranjang sehingga setiap keranjang berisi apel dan jeruk dengan jumlah yang sama. Paling banyak berapa keranjang yang dapat dibuat?`,
        `Mrs ${bu} has ${x} apples and ${y} oranges. She puts them into baskets so that every basket has the same number of apples and the same number of oranges. What is the greatest number of baskets she can fill?`,
        `${bu} 太太有 ${x} 個蘋果和 ${y} 個橘子，要分裝到籃子裡，每個籃子的蘋果數一樣、橘子數也一樣。最多可以裝幾籃？`,
      ),
      jawaban: g,
      satuan: t("keranjang", "baskets", "籃"),
      salah: [m + n, lcm(x, y), g * 2, m * n],
      pembahasan: [
        t(`Banyak keranjang harus membagi habis ${x} dan ${y}. Yang paling banyak adalah FPB-nya.`, `The number of baskets must divide both ${x} and ${y}. The greatest such number is the GCF.`, `籃子數必須同時整除 ${x} 和 ${y}，最多就是最大公因數。`),
        t(`Faktor ${x}: `, `Factors of ${x}: `, `${x} 的因數：`) + factors(x).join(sep) + ". " + t(`Faktor ${y}: `, `Factors of ${y}: `, `${y} 的因數：`) + factors(y).join(sep) + ".",
        t(`FPB = ${g}. Setiap keranjang berisi ${m} apel dan ${n} jeruk.`, `GCF = ${g}. Each basket holds ${m} apples and ${n} oranges.`, `最大公因數 = ${g}，每籃有 ${m} 個蘋果和 ${n} 個橘子。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Faktor", "Factors", "因數"], "sedang", (r, { t }) => {
    const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 32, 50]);
    const f = factors(n), sep = t(", ", ", ", "、");
    const pairs = f.filter((v) => v * v <= n).map((v) => `$${v} \\times ${n / v}$`);
    return {
      pertanyaan: t(`Banyaknya faktor dari ${n} adalah ...`, `How many factors does ${n} have?`, `${n} 有幾個因數？`),
      jawaban: f.length,
      salah: [f.length - 1, f.length + 1, f.length - 2],
      pembahasan: [
        t(`Cari pasangan perkalian yang hasilnya ${n}: `, `Find the multiplication pairs that make ${n}: `, `找出乘積是 ${n} 的兩數：`) + pairs.join(sep),
        t(`Faktor ${n}: `, `Factors of ${n}: `, `${n} 的因數：`) + f.join(sep),
        t(`Banyaknya ada ${f.length} faktor.`, `There are ${f.length} factors.`, `共有 ${f.length} 個因數。`),
      ],
    };
  }),
  T(KAT.OSN, ["Bilangan prima", "Prime numbers", "質數"], "sulit", (r, { t }) => {
    const a = r.int(1, 30), b = a + r.int(10, 20), sep = t(", ", ", ", "、");
    const ps = [];
    for (let i = a + 1; i < b; i++) if (isPrime(i)) ps.push(i);
    return {
      pertanyaan: t(`Berapa banyak bilangan prima yang lebih dari ${a} dan kurang dari ${b}?`, `How many prime numbers are greater than ${a} and less than ${b}?`, `大於 ${a} 且小於 ${b} 的質數有幾個？`),
      jawaban: ps.length,
      salah: [ps.length + 1, ps.length - 1, ps.length + 2],
      pembahasan: [
        t(`Bilangan prima adalah bilangan yang hanya punya dua faktor: 1 dan dirinya sendiri. (1 bukan bilangan prima.)`, `A prime number has exactly two factors: 1 and itself. (1 is not a prime number.)`, `質數只有 1 和它本身兩個因數。（1 不是質數。）`),
        t(`Bilangan prima di antara ${a} dan ${b}: `, `Primes between ${a} and ${b}: `, `${a} 和 ${b} 之間的質數：`) + (ps.length ? ps.join(sep) : t("tidak ada", "none", "沒有")) + ".",
        t(`Banyaknya ada ${ps.length}.`, `There are ${ps.length}.`, `共有 ${ps.length} 個。`),
      ],
    };
  }),
  T(KAT.KSM, ["Bilangan Romawi", "Roman numerals", "羅馬數字"], "mudah", (r, { t }) => {
    const n = r.int(14, 99), { s, parts } = roman(n);
    const naif = [...s].reduce((tt, c) => tt + { I: 1, V: 5, X: 10, L: 50, C: 100 }[c], 0);
    return {
      tingkat: /IV|IX|XL|XC/.test(s) ? "sedang" : "mudah",
      pertanyaan: t(`Lambang bilangan Romawi ${s} menyatakan bilangan ...`, `What number does the Roman numeral ${s} stand for?`, `羅馬數字 ${s} 代表多少？`),
      jawaban: n,
      salah: [naif, n + 10, n - 10, n + 1],
      pembahasan: [
        t(`Pisahkan lambangnya: `, `Break it into parts: `, `拆開來看：`) + parts.map(([rr, v]) => `${rr} = ${v}`).join(t(", ", ", ", "、")),
        t(`Ingat: lambang kecil di kiri lambang besar berarti dikurangi (contoh: IV = 4, XL = 40).`, `Remember: a smaller symbol to the left of a bigger one is subtracted (for example IV = 4, XL = 40).`, `注意：小的符號在大的符號左邊表示相減（例如 IV = 4，XL = 40）。`),
        `$${parts.map(([, v]) => v).join(" + ")} = ${n}$`,
      ],
    };
  }),
  T(KAT.OSN, ["Sudut", "Angles", "角度"], "sulit", (r, { t }) => {
    const h = r.int(1, 11), k = Math.min(h, 12 - h), ang = k * 30, hh = String(h).padStart(2, "0");
    return {
      pertanyaan: t(
        `Besar sudut terkecil yang dibentuk oleh jarum pendek dan jarum panjang jam pada pukul ${hh}.00 adalah ...`,
        `What is the smaller angle between the hour hand and the minute hand of a clock at ${hh}:00?`,
        `${hh}:00 時，時針和分針所夾的較小角是幾度？`,
      ),
      jawaban: ang,
      akhiran: "°",
      salah: [360 - ang, ang + 30, ang - 30, h * 10],
      pembahasan: [
        t(`Angka pada jam membagi lingkaran menjadi 12 bagian. Setiap bagian $= 360^\\circ : 12 = 30^\\circ$.`, `The numbers on a clock split the circle into 12 parts. Each part $= 360^\\circ \\div 12 = 30^\\circ$.`, `鐘面被 12 個數字分成 12 格，每格 $= 360^\\circ \\div 12 = 30^\\circ$。`),
        t(`Pukul ${h}.00: jarum panjang di angka 12, jarum pendek di angka ${h}. Jarak terpendeknya ${k} bagian.`, `At ${h}:00 the minute hand points to 12 and the hour hand to ${h}. They are ${k} parts apart (the shorter way).`, `${h}:00 時分針指 12、時針指 ${h}，相隔 ${k} 格（較近的一邊）。`),
        `$${k} \\times 30^\\circ = ${ang}^\\circ$`,
      ],
    };
  }),
  T(KAT.KMNR, ["Pecahan senilai", "Equivalent fractions", "等值分數"], "mudah", (r, { t }) => {
    const d = r.int(3, 9), n = r.int(1, d - 1), k = r.int(2, 6);
    if (gcd(n, d) !== 1) return null;
    return {
      pertanyaan: t(
        `Perhatikan: $${fr(n, d)} = ${fr("\\square", d * k)}$. Bilangan yang tepat untuk mengisi kotak adalah ...`,
        `Look: $${fr(n, d)} = ${fr("\\square", d * k)}$. Which number goes in the box?`,
        `$${fr(n, d)} = ${fr("\\square", d * k)}$，方格裡應該填多少？`,
      ),
      jawaban: n * k,
      salah: [n + k, n * k + 1, d * k - n, n * k - 1],
      pembahasan: [
        t(`Penyebut ${d} dikali ${k} menjadi ${d * k}.`, `The denominator ${d} was multiplied by ${k} to get ${d * k}.`, `分母 ${d} 乘以 ${k} 得到 ${d * k}。`),
        t(`Pembilang juga harus dikali ${k}: $${n} \\times ${k} = ${n * k}$.`, `The numerator must be multiplied by ${k} too: $${n} \\times ${k} = ${n * k}$.`, `分子也要乘以 ${k}：$${n} \\times ${k} = ${n * k}$。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Penjumlahan pecahan", "Adding fractions", "分數加法"], "sedang", (r, { t }) => {
    const [d1, d2] = r.sample([2, 3, 4, 5, 6], 2), a = r.int(1, d1 - 1), b = r.int(1, d2 - 1);
    if (gcd(a, d1) !== 1 || gcd(b, d2) !== 1) return null;
    const L = lcm(d1, d2), A = (a * L) / d1, B = (b * L) / d2, S = A + B;
    const g = gcd(S, L);
    const ans = frac(S, L);
    return {
      pertanyaan: t(`Hasil dari $${fr(a, d1)} + ${fr(b, d2)}$ adalah ...`, `What is $${fr(a, d1)} + ${fr(b, d2)}$?`, `$${fr(a, d1)} + ${fr(b, d2)} = ?$`),
      jawaban: ans,
      salah: [`$${fr(a + b, d1 + d2)}$`, `$${fr(a + b, L)}$`, frac(S + 1, L), frac(S - 1, L)].filter((x) => x !== ans && x !== "$0$"),
      pembahasan: [
        t(`Samakan penyebutnya menjadi ${L} (KPK dari ${d1} dan ${d2}).`, `Make the denominators the same: ${L} (the LCM of ${d1} and ${d2}).`, `通分成分母 ${L}（${d1} 和 ${d2} 的最小公倍數）。`),
        `$${fr(a, d1)} = ${fr(A, L)}$, $${fr(b, d2)} = ${fr(B, L)}$`,
        `$${fr(A, L)} + ${fr(B, L)} = ${fr(S, L)}$` + (g > 1 ? t(`, disederhanakan menjadi $${fr(S / g, L / g)}$.`, `, which simplifies to $${fr(S / g, L / g)}$.`, `，約分後是 $${fr(S / g, L / g)}$。`) : ""),
        ...(S / g > L / g ? [t(`Karena pembilang lebih besar dari penyebut, ubah ke pecahan campuran: ${ans}.`, `The numerator is bigger than the denominator, so write it as a mixed number: ${ans}.`, `分子比分母大，化成帶分數：${ans}。`)] : []),
      ],
    };
  }),
  T(KAT.KOSSMI, ["Desimal", "Decimals", "小數"], "mudah", (r, { t, dec }) => {
    const a = r.int(1, 9), b = r.int(1, 9), s = a + b, z = t(",", ".", ".");
    return {
      pertanyaan: t(`Hasil dari $0${z}${a} + 0${z}${b}$ adalah ...`, `What is $0${z}${a} + 0${z}${b}$?`, `$0${z}${a} + 0${z}${b} = ?$`),
      jawaban: dec(s),
      salah: [dec(s + 1), dec(Math.max(s - 1, 1)), `0${z}${a}${b}`, s >= 10 ? `0${z}${s}` : `${s}`],
      pembahasan: [
        t(`$0{,}${a}$ artinya ${a} persepuluh dan $0{,}${b}$ artinya ${b} persepuluh.`, `$0.${a}$ means ${a} tenths and $0.${b}$ means ${b} tenths.`, `$0.${a}$ 是 ${a} 個十分之一，$0.${b}$ 是 ${b} 個十分之一。`),
        t(`${a} persepuluh + ${b} persepuluh = ${s} persepuluh.`, `${a} tenths + ${b} tenths = ${s} tenths.`, `${a} 個十分之一 + ${b} 個十分之一 = ${s} 個十分之一。`),
        t(`${s} persepuluh ditulis ${dec(s)}.`, `${s} tenths is written ${dec(s)}.`, `${s} 個十分之一寫成 ${dec(s)}。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Luas gabungan", "Composite area", "組合圖形面積"], "sulit", (r, { t }) => {
    const p = r.int(8, 15), l = r.int(5, 10), x = r.int(2, 4), y = r.int(2, 4);
    return {
      pertanyaan: t(
        `Lantai sebuah ruangan berbentuk persegi panjang berukuran ${p} m × ${l} m. Di salah satu sudutnya ada kolam berbentuk persegi panjang ${x} m × ${y} m yang tidak dipasang keramik. Berapa luas lantai yang dipasang keramik?`,
        `A rectangular floor measures ${p} m × ${l} m. In one corner there is a ${x} m × ${y} m rectangular pool that is not tiled. What area of the floor is tiled?`,
        `一個長方形地板長 ${p} 公尺、寬 ${l} 公尺，其中一角有一個 ${x} 公尺 × ${y} 公尺的長方形水池不鋪磁磚。鋪磁磚的面積是多少？`,
      ),
      jawaban: p * l - x * y,
      satuan: "m²",
      salah: [p * l, p * l + x * y, 2 * (p + l), p * l - x - y],
      pembahasan: [
        t(`Luas seluruh lantai: $${p} \\times ${l} = ${p * l}$ m².`, `Whole floor: $${p} \\times ${l} = ${p * l}$ m².`, `整個地板：$${p} \\times ${l} = ${p * l}$ m²。`),
        t(`Luas kolam: $${x} \\times ${y} = ${x * y}$ m².`, `Pool: $${x} \\times ${y} = ${x * y}$ m².`, `水池：$${x} \\times ${y} = ${x * y}$ m²。`),
        t(`Luas berkeramik: $${p * l} - ${x * y} = ${p * l - x * y}$ m².`, `Tiled area: $${p * l} - ${x * y} = ${p * l - x * y}$ m².`, `鋪磁磚：$${p * l} - ${x * y} = ${p * l - x * y}$ m²。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Pembulatan", "Rounding", "四捨五入"], "mudah", (r, { t, fmt }) => {
    const n = r.int(1001, 9999), sisa = n % 100;
    if (sisa === 0) return null;
    const fl = n - sisa, ans = sisa >= 50 ? fl + 100 : fl, pul = Math.floor(sisa / 10);
    return {
      pertanyaan: t(`Bilangan ${fmt(n)} dibulatkan ke ratusan terdekat menjadi ...`, `Round ${fmt(n)} to the nearest hundred.`, `把 ${fmt(n)} 四捨五入到百位是多少？`),
      jawaban: ans,
      salah: [fl, fl + 100, Math.round(n / 10) * 10, Math.round(n / 1000) * 1000],
      pembahasan: [
        t(`Lihat angka puluhannya, yaitu ${pul}.`, `Look at the tens digit: ${pul}.`, `看十位數字：${pul}。`),
        pul >= 5
          ? t(`Karena ${pul} adalah 5 atau lebih, dibulatkan ke atas menjadi ${fmt(ans)}.`, `Because ${pul} is 5 or more, round up to ${fmt(ans)}.`, `${pul} 大於或等於 5，進位成 ${fmt(ans)}。`)
          : t(`Karena ${pul} kurang dari 5, dibulatkan ke bawah menjadi ${fmt(ans)}.`, `Because ${pul} is less than 5, round down to ${fmt(ans)}.`, `${pul} 小於 5，捨去成 ${fmt(ans)}。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Keliling dan luas", "Perimeter and area", "周長與面積"], "sedang", (r, { t }) => {
    const s = r.int(4, 15), L = s * s;
    return {
      pertanyaan: t(`Luas sebuah persegi adalah ${L} cm². Keliling persegi itu adalah ...`, `A square has an area of ${L} cm². What is its perimeter?`, `一個正方形的面積是 ${L} cm²，它的周長是多少？`),
      jawaban: 4 * s,
      satuan: "cm",
      salah: [2 * s, L, 4 * s + 4, L / 2],
      pembahasan: [
        t(`Luas persegi = sisi × sisi. Bilangan yang dikali dirinya sendiri menghasilkan ${L} adalah ${s}, jadi sisi = ${s} cm.`, `Area of a square = side × side. The number that times itself gives ${L} is ${s}, so each side is ${s} cm.`, `正方形面積 = 邊長 × 邊長。自己乘自己等於 ${L} 的數是 ${s}，所以邊長是 ${s} 公分。`),
        t(`Keliling $= 4 \\times ${s} = ${4 * s}$ cm.`, `Perimeter $= 4 \\times ${s} = ${4 * s}$ cm.`, `周長 $= 4 \\times ${s} = ${4 * s}$ 公分。`),
      ],
    };
  }),
  T(KAT.OSN, ["Pola bilangan", "Number patterns", "數字規律"], "sedang", (r, { t }) => {
    const k = r.int(1, 5), tri = (i) => (i * (i + 1)) / 2;
    const seq = [k, k + 1, k + 2, k + 3].map(tri), ans = tri(k + 4);
    return {
      pertanyaan: t(`Perhatikan pola: ${seq.join(", ")}, ... Bilangan berikutnya adalah ...`, `Look at the pattern: ${seq.join(", ")}, ... What is the next number?`, `觀察規律：${seq.join("、")}、……下一個數是多少？`),
      jawaban: ans,
      salah: [seq[3] + (seq[3] - seq[2]), ans + 1, ans - 1],
      pembahasan: [
        t(`Selisihnya: `, `The differences: `, `相鄰兩數的差：`) + `$${seq[1]} - ${seq[0]} = ${k + 1}$, $${seq[2]} - ${seq[1]} = ${k + 2}$, $${seq[3]} - ${seq[2]} = ${k + 3}$`,
        t(`Selisihnya selalu bertambah 1, jadi selisih berikutnya ${k + 4}.`, `The difference grows by 1 each time, so the next difference is ${k + 4}.`, `差每次多 1，所以下一個差是 ${k + 4}。`),
        `$${seq[3]} + ${k + 4} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KSM, ["Operasi hitung campuran", "Order of operations", "四則混合運算"], "sedang", (r, { t }) => {
    const a = r.int(10, 50), b = r.int(2, 9), c = r.int(2, 9);
    return {
      pertanyaan: t(`Hasil dari $${a} + ${b} \\times ${c}$ adalah ...`, `What is $${a} + ${b} \\times ${c}$?`, `$${a} + ${b} \\times ${c} = ?$`),
      jawaban: a + b * c,
      salah: [(a + b) * c, a + b + c, a * b + c],
      pembahasan: [
        t(`Perkalian dikerjakan lebih dahulu daripada penjumlahan.`, `Multiplication comes before addition.`, `先乘除，後加減。`),
        `$${b} \\times ${c} = ${b * c}$`,
        `$${a} + ${b * c} = ${a + b * c}$`,
      ],
    };
  }),
  T(KAT.OSN, ["Kelipatan", "Multiples", "倍數"], "sulit", (r, { t }) => {
    const d = r.pick([3, 4, 5, 6]), k = r.int(5, 10), N = d * k, ans = (d * k * (k + 1)) / 2, sep = t(", ", ", ", "、");
    return {
      pertanyaan: t(`Jumlah semua kelipatan ${d} dari 1 sampai ${N} adalah ...`, `What is the sum of all the multiples of ${d} from 1 to ${N}?`, `1 到 ${N} 之間所有 ${d} 的倍數加起來是多少？`),
      jawaban: ans,
      salah: [(k * (k + 1)) / 2, ans - N, ans + d, N * k],
      pembahasan: [
        t(`Kelipatan ${d} dari 1 sampai ${N}: `, `Multiples of ${d} from 1 to ${N}: `, `1 到 ${N} 中 ${d} 的倍數：`) + kelipatan(d, N).join(sep) + ".",
        t(`Semuanya adalah ${d} dikali 1, 2, 3, ..., ${k}. Jadi jumlahnya $${d} \\times (1 + 2 + \\cdots + ${k})$.`, `They are ${d} times 1, 2, 3, ..., ${k}. So the sum is $${d} \\times (1 + 2 + \\cdots + ${k})$.`, `它們是 ${d} 乘以 1、2、3、……、${k}，所以和是 $${d} \\times (1 + 2 + \\cdots + ${k})$。`),
        `$1 + 2 + \\cdots + ${k} = ${(k * (k + 1)) / 2}$, $${d} \\times ${(k * (k + 1)) / 2} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KMNR, ["Satuan panjang", "Units of length", "長度單位"], "mudah", (r, { t, fmt }) => {
    const k = r.int(1, 9), m = r.int(5, 995);
    return {
      pertanyaan: t(`${k} km ${m} m sama dengan ... m.`, `${k} km ${m} m is equal to how many metres?`, `${k} 公里 ${m} 公尺等於幾公尺？`),
      jawaban: 1000 * k + m,
      satuan: "m",
      salah: [100 * k + m, k + m, 10000 * k + m],
      pembahasan: [
        t(`1 km = ${fmt(1000)} m, jadi ${k} km $= ${fmt(1000 * k)}$ m.`, `1 km = ${fmt(1000)} m, so ${k} km $= ${fmt(1000 * k)}$ m.`, `1 公里 = ${fmt(1000)} 公尺，所以 ${k} 公里 $= ${fmt(1000 * k)}$ 公尺。`),
        `$${fmt(1000 * k)} + ${m} = ${fmt(1000 * k + m)}$ m`,
      ],
    };
  }),
  T(KAT.KOSSMI, ["Uang", "Money", "錢"], "mudah", (r, { t, rp, fmt }) => {
    const per = r.int(2, 10) * 500, k = r.int(5, 20), Tt = per * k, n = r.pick(NAMA);
    return {
      pertanyaan: t(
        `${n} menabung ${rp(per)} setiap hari. Berapa hari yang ia perlukan agar tabungannya menjadi ${rp(Tt)}?`,
        `${n} saves ${rp(per)} every day. How many days does it take to save ${rp(Tt)}?`,
        `${n} 每天存 ${rp(per)}，要幾天才能存到 ${rp(Tt)}？`,
      ),
      jawaban: k,
      satuan: t("hari", "days", "天"),
      salah: [k + 1, k - 1, k * 2, k + 5],
      pembahasan: [
        t(`Banyak hari = jumlah tabungan : tabungan per hari.`, `Number of days = total savings ÷ savings per day.`, `天數 = 總金額 ÷ 每天存的錢。`),
        t(`$${fmt(Tt)} : ${fmt(per)} = ${k}$ hari.`, `$${fmt(Tt)} \\div ${fmt(per)} = ${k}$ days.`, `$${fmt(Tt)} \\div ${fmt(per)} = ${k}$ 天。`),
      ],
    };
  }),
  T(KAT.OSN, ["Angka satuan", "Last digit", "個位數字"], "sulit", (r, { t }) => {
    const n = r.int(10, 40), cyc = [2, 4, 8, 6], s = n % 4, ans = cyc[(n - 1) % 4];
    return {
      pertanyaan: t(`Angka satuan dari $2^{${n}}$ adalah ...`, `What is the ones digit of $2^{${n}}$?`, `$2^{${n}}$ 的個位數字是多少？`),
      jawaban: ans,
      salah: cyc.filter((v) => v !== ans),
      pembahasan: [
        t(`Angka satuan dari $2^1, 2^2, 2^3, 2^4, 2^5, \\ldots$ adalah 2, 4, 8, 6, 2, ... (berulang setiap 4).`, `The ones digits of $2^1, 2^2, 2^3, 2^4, 2^5, \\ldots$ are 2, 4, 8, 6, 2, ... (repeating every 4).`, `$2^1, 2^2, 2^3, 2^4, 2^5, \\ldots$ 的個位數字是 2、4、8、6、2、……（每 4 個重複）。`),
        t(`$${n} : 4 = ${Math.floor(n / 4)}$ sisa ${s}.`, `$${n} \\div 4 = ${Math.floor(n / 4)}$ remainder ${s}.`, `$${n} \\div 4 = ${Math.floor(n / 4)}$ 餘 ${s}。`),
        s === 0
          ? t(`Sisa 0 berarti angka satuannya sama dengan $2^4$, yaitu 6.`, `Remainder 0 means it matches $2^4$, so the ones digit is 6.`, `餘 0 表示和 $2^4$ 一樣，個位數字是 6。`)
          : t(`Sisa ${s} berarti angka satuannya sama dengan $2^{${s}}$, yaitu ${ans}.`, `Remainder ${s} means it matches $2^{${s}}$, so the ones digit is ${ans}.`, `餘 ${s} 表示和 $2^{${s}}$ 一樣，個位數字是 ${ans}。`),
      ],
    };
  }),
];
