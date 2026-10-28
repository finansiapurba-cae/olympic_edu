import { T, KAT, NAMA, frac, fr, gcd } from "./lib.mjs";

export default [
  T(KAT.KMNR, ["Luas", "Area", "面積"], "mudah", (r, { t }) => {
    const p = r.int(4, 15), l = r.int(2, p - 1);
    return {
      pertanyaan: t(
        `Sebuah papan berbentuk persegi panjang dengan panjang ${p} cm dan lebar ${l} cm. Luas papan itu adalah ...`,
        `A rectangular board is ${p} cm long and ${l} cm wide. What is its area?`,
        `一塊長方形木板長 ${p} 公分、寬 ${l} 公分。它的面積是多少？`,
      ),
      jawaban: p * l,
      satuan: "cm²",
      salah: [2 * (p + l), p + l, p * l + p],
      pembahasan: [
        t(`Luas persegi panjang = panjang × lebar.`, `Area of a rectangle = length × width.`, `長方形面積 = 長 × 寬。`),
        `$${p} \\times ${l} = ${p * l}$ cm²`,
      ],
    };
  }),
  T(KAT.KMNR, ["Keliling", "Perimeter", "周長"], "mudah", (r, { t }) => {
    const p = r.int(5, 20), l = r.int(2, p - 1);
    return {
      pertanyaan: t(
        `Sebuah kebun berbentuk persegi panjang dengan panjang ${p} m dan lebar ${l} m. Keliling kebun itu adalah ...`,
        `A rectangular garden is ${p} m long and ${l} m wide. What is its perimeter?`,
        `一個長方形菜園長 ${p} 公尺、寬 ${l} 公尺。它的周長是多少？`,
      ),
      jawaban: 2 * (p + l),
      satuan: "m",
      salah: [p * l, p + l, 2 * p + l],
      pembahasan: [
        t(`Keliling persegi panjang = 2 × (panjang + lebar).`, `Perimeter of a rectangle = 2 × (length + width).`, `長方形周長 = 2 × (長 + 寬)。`),
        `$2 \\times (${p} + ${l}) = 2 \\times ${p + l} = ${2 * (p + l)}$ m`,
      ],
    };
  }),
  T(KAT.SEAMO, ["Pecahan", "Fractions", "分數"], "sedang", (r, { t }) => {
    const d = r.pick([3, 4, 5, 6]), num = r.int(1, d - 1);
    if (gcd(num, d) !== 1) return null;
    const n = d * r.int(2, 8), satu = n / d, ans = satu * num;
    return {
      pertanyaan: t(`Hasil dari $${fr(num, d)}$ dari ${n} adalah ...`, `What is $${fr(num, d)}$ of ${n}?`, `${n} 的 $${fr(num, d)}$ 是多少？`),
      jawaban: ans,
      salah: [satu, n - ans, ans + num, n * num],
      pembahasan: [
        t(`Bagi ${n} menjadi ${d} bagian sama besar: $${n} : ${d} = ${satu}$.`, `Split ${n} into ${d} equal parts: $${n} \\div ${d} = ${satu}$.`, `把 ${n} 平分成 ${d} 份：$${n} \\div ${d} = ${satu}$。`),
        t(`Ambil ${num} bagian: $${num} \\times ${satu} = ${ans}$.`, `Take ${num} of the parts: $${num} \\times ${satu} = ${ans}$.`, `取其中 ${num} 份：$${num} \\times ${satu} = ${ans}$。`),
      ],
    };
  }),
  T(KAT.OSN, ["Membandingkan pecahan", "Comparing fractions", "比較分數"], "sedang", (r, { t }) => {
    const satuan = r.next() < 0.5;
    if (satuan) {
      const ds = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10], 4), mn = Math.min(...ds);
      const daftar = `$${ds.map((d) => fr(1, d)).join("$, $")}$`;
      return {
        pertanyaan: t(`Di antara pecahan ${daftar}, manakah yang paling besar?`, `Which is the largest of the fractions ${daftar}?`, `${daftar.replaceAll("$, $", "$、$")} 之中，哪一個最大？`),
        jawaban: `$${fr(1, mn)}$`,
        salah: ds.filter((d) => d !== mn).map((d) => `$${fr(1, d)}$`),
        pembahasan: [
          t(`Semua pecahan pembilangnya 1. Bayangkan satu kue dibagi menjadi beberapa potong.`, `All the fractions have numerator 1. Imagine one cake cut into pieces.`, `這些分數的分子都是 1。想像把一個蛋糕切成幾塊。`),
          t(`Semakin sedikit potongannya (penyebut kecil), semakin besar setiap potongnya.`, `The fewer the pieces (smaller denominator), the bigger each piece.`, `切的塊數越少（分母越小），每一塊就越大。`),
          t(`Penyebut terkecil adalah ${mn}, jadi $${fr(1, mn)}$ yang paling besar.`, `The smallest denominator is ${mn}, so $${fr(1, mn)}$ is the largest.`, `最小的分母是 ${mn}，所以 $${fr(1, mn)}$ 最大。`),
        ],
      };
    }
    const d = r.int(7, 12), ns = r.sample(Array.from({ length: d - 1 }, (_, i) => i + 1), 4), mx = Math.max(...ns);
    const daftar = `$${ns.map((n) => fr(n, d)).join("$, $")}$`;
    return {
      pertanyaan: t(`Di antara pecahan ${daftar}, manakah yang paling besar?`, `Which is the largest of the fractions ${daftar}?`, `${daftar.replaceAll("$, $", "$、$")} 之中，哪一個最大？`),
      jawaban: `$${fr(mx, d)}$`,
      salah: ns.filter((n) => n !== mx).map((n) => `$${fr(n, d)}$`),
      pembahasan: [
        t(`Semua pecahan penyebutnya sama, yaitu ${d}.`, `All the fractions have the same denominator, ${d}.`, `這些分數的分母都是 ${d}。`),
        t(`Jika penyebutnya sama, pecahan dengan pembilang terbesar adalah yang paling besar: $${fr(mx, d)}$.`, `With the same denominator, the fraction with the largest numerator is the largest: $${fr(mx, d)}$.`, `分母相同時，分子最大的分數最大：$${fr(mx, d)}$。`),
      ],
    };
  }),
  T(KAT.KOSSMI, ["Pecahan", "Fractions", "分數"], "mudah", (r, { t }) => {
    const d = r.int(5, 12), a = r.int(1, d - 3), b = r.int(1, d - 1 - a), s = a + b;
    const g = gcd(s, d);
    return {
      pertanyaan: t(`Hasil dari $${fr(a, d)} + ${fr(b, d)}$ adalah ...`, `What is $${fr(a, d)} + ${fr(b, d)}$?`, `$${fr(a, d)} + ${fr(b, d)} = ?$`),
      jawaban: frac(s, d),
      salah: [`$${fr(s, 2 * d)}$`, `$${fr(s + 1, d)}$`, a === b ? `$${fr(s, d + d)}$` : `$${fr(Math.abs(a - b), d)}$`, `$${fr(s + 2, d)}$`].filter((x) => x !== frac(s, d)),
      pembahasan: [
        t(`Penyebutnya sama (${d}), jadi cukup jumlahkan pembilangnya. Penyebut tidak dijumlahkan.`, `The denominators are the same (${d}), so just add the numerators. Do not add the denominators.`, `分母相同（${d}），只要把分子相加，分母不相加。`),
        `$${fr(a, d)} + ${fr(b, d)} = ${fr(s, d)}$`,
        ...(g > 1
          ? [t(`Sederhanakan dengan membagi pembilang dan penyebut dengan ${g}: $${fr(s, d)} = ${fr(s / g, d / g)}$.`, `Simplify by dividing the top and bottom by ${g}: $${fr(s, d)} = ${fr(s / g, d / g)}$.`, `分子分母同除以 ${g} 約分：$${fr(s, d)} = ${fr(s / g, d / g)}$。`)]
          : []),
      ],
    };
  }),
  T(KAT.KSM, ["Satuan berat", "Units of weight", "重量單位"], "mudah", (r, { t, fmt }) => {
    const k = r.int(1, 9), g = r.int(1, 19) * 50;
    return {
      pertanyaan: t(`${k} kg ${g} gram sama dengan ... gram.`, `${k} kg ${g} g is equal to how many grams?`, `${k} 公斤 ${g} 公克等於幾公克？`),
      jawaban: 1000 * k + g,
      satuan: "g",
      salah: [100 * k + g, k + g, 1000 * k + g + 100, 10 * k + g],
      pembahasan: [
        t(`1 kg = ${fmt(1000)} gram, jadi ${k} kg $= ${fmt(1000 * k)}$ gram.`, `1 kg = ${fmt(1000)} g, so ${k} kg $= ${fmt(1000 * k)}$ g.`, `1 公斤 = ${fmt(1000)} 公克，所以 ${k} 公斤 $= ${fmt(1000 * k)}$ 公克。`),
        `$${fmt(1000 * k)} + ${g} = ${fmt(1000 * k + g)}$ g`,
      ],
    };
  }),
  T(KAT.SEAMO, ["Pola bilangan", "Number patterns", "數字規律"], "sedang", (r, { t }) => {
    const s = r.int(1, 5), seq = [0, 1, 2, 3].map((i) => (s + i) ** 2), ans = (s + 4) ** 2;
    return {
      pertanyaan: t(`Perhatikan pola: ${seq.join(", ")}, ... Bilangan berikutnya adalah ...`, `Look at the pattern: ${seq.join(", ")}, ... What is the next number?`, `觀察規律：${seq.join("、")}、……下一個數是多少？`),
      jawaban: ans,
      salah: [seq[3] + (seq[3] - seq[2]), ans + 1, (s + 4) * 2, ans - 2],
      pembahasan: [
        t(`Setiap bilangan adalah hasil kali bilangan dengan dirinya sendiri:`, `Each number is a number multiplied by itself:`, `每個數都是某個數乘以自己：`) + ` $${seq.map((v, i) => `${v} = ${s + i} \\times ${s + i}`).join(",\\ ")}$`,
        t(`Bilangan berikutnya: $${s + 4} \\times ${s + 4} = ${ans}$.`, `Next number: $${s + 4} \\times ${s + 4} = ${ans}$.`, `下一個數：$${s + 4} \\times ${s + 4} = ${ans}$。`),
      ],
    };
  }),
  T(KAT.OSN, ["Kelipatan", "Multiples", "倍數"], "sulit", (r, { t }) => {
    const d = r.pick([3, 4, 6, 7, 8, 9]), n = r.int(40, 100), ans = Math.floor(n / d);
    return {
      pertanyaan: t(`Berapa banyak bilangan dari 1 sampai ${n} yang habis dibagi ${d}?`, `How many numbers from 1 to ${n} are divisible by ${d}?`, `從 1 到 ${n}，有幾個數能被 ${d} 整除？`),
      jawaban: ans,
      salah: [ans + 1, ans - 1, ans + 2],
      pembahasan: [
        t(`Bilangan yang habis dibagi ${d} adalah kelipatan ${d}: ${d}, ${2 * d}, ${3 * d}, ...`, `Numbers divisible by ${d} are the multiples of ${d}: ${d}, ${2 * d}, ${3 * d}, ...`, `能被 ${d} 整除的數就是 ${d} 的倍數：${d}、${2 * d}、${3 * d}、……`),
        t(`Kelipatan ${d} terbesar yang tidak lebih dari ${n} adalah $${d} \\times ${ans} = ${d * ans}$.`, `The largest multiple of ${d} that is not more than ${n} is $${d} \\times ${ans} = ${d * ans}$.`, `不超過 ${n} 的最大 ${d} 的倍數是 $${d} \\times ${ans} = ${d * ans}$。`),
        t(`Jadi ada ${ans} bilangan.`, `So there are ${ans} numbers.`, `所以共有 ${ans} 個數。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Pembagian bersisa", "Division with remainders", "有餘數的除法"], "sedang", (r, { t }) => {
    const d = r.int(3, 9), q = r.int(4, 12), s = r.int(1, d - 1), n = d * q + s;
    return {
      pertanyaan: t(`Jika ${n} dibagi ${d}, sisanya adalah ...`, `What is the remainder when ${n} is divided by ${d}?`, `${n} 除以 ${d}，餘數是多少？`),
      jawaban: s,
      salah: [s + 1, s - 1, q, d - s],
      maks: d - 1,
      pembahasan: [
        t(`Cari kelipatan ${d} terbesar yang tidak lebih dari ${n}: $${d} \\times ${q} = ${d * q}$.`, `Find the largest multiple of ${d} that is not more than ${n}: $${d} \\times ${q} = ${d * q}$.`, `找出不超過 ${n} 的最大 ${d} 的倍數：$${d} \\times ${q} = ${d * q}$。`),
        t(`Sisa: $${n} - ${d * q} = ${s}$.`, `Remainder: $${n} - ${d * q} = ${s}$.`, `餘數：$${n} - ${d * q} = ${s}$。`),
      ],
    };
  }),
  T(KAT.KSM, ["Uang", "Money", "錢"], "sedang", (r, { t, rp, fmt }) => {
    const a = r.int(2, 6), h = r.int(2, 9) * 500, total = a * h, p = [10000, 20000, 50000].find((v) => v > total), n = r.pick(NAMA);
    const [ii, ie, ic, iz] = r.pick([["buku tulis", "notebooks", "本", "筆記本"], ["pulpen", "pens", "枝", "原子筆"], ["penggaris", "rulers", "把", "尺"], ["map plastik", "plastic folders", "個", "資料夾"]]);
    return {
      pertanyaan: t(
        `${n} membeli ${a} ${ii} dengan harga ${rp(h)} per buah. Ia membayar dengan uang ${rp(p)}. Berapa uang kembaliannya?`,
        `${n} buys ${a} ${ie} at ${rp(h)} each and pays with ${rp(p)}. How much change does ${n} get?`,
        `${n} 買了 ${a} ${ic}${iz}，每${ic} ${rp(h)}，付了 ${rp(p)}。應該找回多少錢？`,
      ),
      prefix: "Rp",
      langkah: 500,
      jawaban: p - total,
      salah: [p - h, total, p - total - h],
      pembahasan: [
        t(`Harga seluruhnya: $${a} \\times ${fmt(h)} = ${fmt(total)}$.`, `Total price: $${a} \\times ${fmt(h)} = ${fmt(total)}$.`, `總價：$${a} \\times ${fmt(h)} = ${fmt(total)}$。`),
        t(`Kembalian: $${fmt(p)} - ${fmt(total)} = ${fmt(p - total)}$.`, `Change: $${fmt(p)} - ${fmt(total)} = ${fmt(p - total)}$.`, `找回：$${fmt(p)} - ${fmt(total)} = ${fmt(p - total)}$。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Waktu", "Time", "時間"], "sedang", (r, { t, jam, pukul }) => {
    const h = r.int(6, 10), mm = r.int(6, 11) * 5, dur = r.int(Math.ceil((60 - mm) / 5), 10) * 5;
    const tot = mm + dur;
    if (tot < 60 || tot >= 120) return null;
    return {
      pertanyaan: t(
        `Bus berangkat pukul ${jam(h, mm)}. Perjalanan memakan waktu ${dur} menit. Bus tiba pukul ...`,
        `A bus leaves at ${jam(h, mm)}. The trip takes ${dur} minutes. What time does the bus arrive?`,
        `公車 ${jam(h, mm)} 出發，車程 ${dur} 分鐘。公車幾點到達？`,
      ),
      jawaban: pukul(h + 1, tot - 60),
      salah: [t(`pukul ${String(h).padStart(2, "0")}.${tot}`, `${String(h).padStart(2, "0")}:${tot}`, `${String(h).padStart(2, "0")}:${tot}`), pukul(h + 1, tot - 50 >= 60 ? 55 : tot - 50), tot - 70 >= 0 ? pukul(h + 1, tot - 70) : pukul(h, tot - 10)],
      pembahasan: [
        t(`$${mm} + ${dur} = ${tot}$ menit.`, `$${mm} + ${dur} = ${tot}$ minutes.`, `$${mm} + ${dur} = ${tot}$ 分鐘。`),
        t(`${tot} menit = 1 jam ${tot - 60} menit. Jadi jamnya maju 1 menjadi ${h + 1} dan menitnya ${tot - 60}.`, `${tot} minutes = 1 hour ${tot - 60} minutes, so the hour moves up to ${h + 1} and the minutes are ${tot - 60}.`, `${tot} 分鐘 = 1 小時 ${tot - 60} 分鐘，所以變成 ${h + 1} 點 ${tot - 60} 分。`),
        t(`Bus tiba pukul ${jam(h + 1, tot - 60)}.`, `The bus arrives at ${jam(h + 1, tot - 60)}.`, `公車 ${jam(h + 1, tot - 60)} 到達。`),
      ],
    };
  }),
  T(KAT.OSN, ["Jabat tangan", "Handshakes", "握手問題"], "sulit", (r, { t }) => {
    const n = r.int(4, 8), ans = (n * (n - 1)) / 2;
    const terms = Array.from({ length: n - 1 }, (_, i) => n - 1 - i);
    return {
      pertanyaan: t(
        `Ada ${n} anak dalam satu kelompok. Setiap anak berjabat tangan tepat satu kali dengan setiap anak lainnya. Berapa banyak jabat tangan yang terjadi?`,
        `There are ${n} children in a group. Each child shakes hands exactly once with every other child. How many handshakes are there?`,
        `一組有 ${n} 個小朋友，每兩個人都恰好握手一次。一共握了幾次手？`,
      ),
      jawaban: ans,
      salah: [n * (n - 1), n * n, ans + n],
      pembahasan: [
        t(`Anak pertama berjabat tangan dengan ${n - 1} anak lain.`, `The first child shakes hands with ${n - 1} other children.`, `第一個人和其他 ${n - 1} 個人握手。`),
        t(`Anak kedua tinggal berjabat tangan dengan ${n - 2} anak yang belum, dan seterusnya.`, `The second child only needs ${n - 2} new handshakes, and so on.`, `第二個人只要再和 ${n - 2} 個人握手，依此類推。`),
        t(`Jumlahnya: $${terms.join(" + ")} = ${ans}$.`, `Total: $${terms.join(" + ")} = ${ans}$.`, `總數：$${terms.join(" + ")} = ${ans}$。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Umur", "Ages", "年齡問題"], "sulit", (r, { t }) => {
    const y = r.int(4, 12), d = r.int(2, 7), S = 2 * y + d;
    return {
      pertanyaan: t(
        `Jumlah umur kakak dan adik adalah ${S} tahun. Kakak ${d} tahun lebih tua daripada adik. Berapa umur kakak?`,
        `The ages of an older and a younger sibling add up to ${S} years. The older one is ${d} years older. How old is the older sibling?`,
        `哥哥和弟弟的年齡加起來是 ${S} 歲，哥哥比弟弟大 ${d} 歲。哥哥幾歲？`,
      ),
      jawaban: y + d,
      satuan: t("tahun", "years", "歲"),
      salah: [y, S - d, y + d + 1],
      pembahasan: [
        t(`Kurangi dulu kelebihan umur kakak: $${S} - ${d} = ${2 * y}$. Ini sama dengan dua kali umur adik.`, `First take away the extra years: $${S} - ${d} = ${2 * y}$. This is twice the younger sibling's age.`, `先減去多出來的歲數：$${S} - ${d} = ${2 * y}$，這是弟弟年齡的 2 倍。`),
        t(`Umur adik $= ${2 * y} : 2 = ${y}$ tahun.`, `Younger sibling: $${2 * y} \\div 2 = ${y}$ years.`, `弟弟：$${2 * y} \\div 2 = ${y}$ 歲。`),
        t(`Umur kakak $= ${y} + ${d} = ${y + d}$ tahun.`, `Older sibling: $${y} + ${d} = ${y + d}$ years.`, `哥哥：$${y} + ${d} = ${y + d}$ 歲。`),
      ],
    };
  }),
  T(KAT.OSN, ["Menghitung bangun", "Counting shapes", "數圖形"], "sulit", (r, { t }) => {
    const n = r.int(3, 5);
    const parts = Array.from({ length: n }, (_, i) => (n - i) ** 2), ans = parts.reduce((p, q) => p + q, 0);
    return {
      pertanyaan: t(
        `Sebuah papan catur kecil berukuran ${n} × ${n} kotak. Berapa banyak persegi (dari semua ukuran) yang ada pada papan itu?`,
        `A small chessboard is ${n} × ${n} squares. How many squares of all sizes are there on the board?`,
        `一個 ${n} × ${n} 格的小棋盤上，大大小小的正方形一共有幾個？`,
      ),
      jawaban: ans,
      salah: [n * n, ans - 1, n * n + 1, ans + n],
      pembahasan: [
        ...parts.map((v, i) => t(`Persegi ukuran ${i + 1} × ${i + 1}: ada $${n - i} \\times ${n - i} = ${v}$.`, `${i + 1} × ${i + 1} squares: $${n - i} \\times ${n - i} = ${v}$.`, `${i + 1} × ${i + 1} 的正方形：$${n - i} \\times ${n - i} = ${v}$ 個。`)),
        t(`Jumlah seluruhnya: $${parts.join(" + ")} = ${ans}$.`, `Total: $${parts.join(" + ")} = ${ans}$.`, `總共：$${parts.join(" + ")} = ${ans}$。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Kalender", "Calendar", "日曆"], "sedang", (r, { t, hari }) => {
    const i = r.int(0, 6), n = r.int(15, 60), q = Math.floor(n / 7), s = n % 7;
    return {
      pertanyaan: t(`Hari ini hari ${hari[i]}. ${n} hari lagi adalah hari ...`, `Today is ${hari[i]}. What day will it be in ${n} days?`, `今天是${hari[i]}。再過 ${n} 天是星期幾？`),
      jawaban: hari[(i + n) % 7],
      salah: [hari[(i + n + 1) % 7], hari[(i + n + 6) % 7], hari[(i + q) % 7], hari[(i + n + 2) % 7]],
      pembahasan: [
        t(`Setiap 7 hari, harinya kembali sama.`, `Every 7 days, the day of the week repeats.`, `每 7 天星期就會重複。`),
        t(`$${n} : 7 = ${q}$ sisa ${s}.`, `$${n} \\div 7 = ${q}$ remainder ${s}.`, `$${n} \\div 7 = ${q}$ 餘 ${s}。`),
        s === 0
          ? t(`Sisanya 0, jadi harinya sama dengan hari ini: ${hari[i]}.`, `The remainder is 0, so it is the same day as today: ${hari[i]}.`, `餘數是 0，所以和今天一樣是${hari[i]}。`)
          : t(`Hitung maju ${s} hari dari hari ${hari[i]}, didapat hari ${hari[(i + n) % 7]}.`, `Count forward ${s} days from ${hari[i]} to get ${hari[(i + n) % 7]}.`, `從${hari[i]}往後數 ${s} 天，得到${hari[(i + n) % 7]}。`),
      ],
    };
  }),
  T(KAT.KOSSMI, ["Angka satuan", "Last digit", "個位數字"], "sedang", (r, { t }) => {
    const a = r.int(12, 99), b = r.int(12, 99), ua = a % 10, ub = b % 10, ans = (ua * ub) % 10;
    return {
      pertanyaan: t(`Angka satuan dari hasil $${a} \\times ${b}$ adalah ...`, `What is the ones digit of $${a} \\times ${b}$?`, `$${a} \\times ${b}$ 的個位數字是多少？`),
      jawaban: ans,
      salah: [(ua + ub) % 10, ua, ub, (ans + 1) % 10],
      maks: 9,
      pembahasan: [
        t(`Angka satuan hasil kali hanya ditentukan oleh angka satuan kedua bilangan, yaitu ${ua} dan ${ub}.`, `The ones digit of a product depends only on the ones digits of the two numbers: ${ua} and ${ub}.`, `乘積的個位數字只由兩個數的個位數字決定：${ua} 和 ${ub}。`),
        t(`$${ua} \\times ${ub} = ${ua * ub}$, angka satuannya ${ans}.`, `$${ua} \\times ${ub} = ${ua * ub}$, whose ones digit is ${ans}.`, `$${ua} \\times ${ub} = ${ua * ub}$，個位數字是 ${ans}。`),
      ],
    };
  }),
  T(KAT.OSN, ["Banyak angka", "Counting digits", "數字個數"], "sulit", (r, { t }) => {
    const n = r.int(20, 99), ans = 9 + 2 * (n - 9), nm = r.pick(NAMA);
    return {
      pertanyaan: t(
        `${nm} menulis semua bilangan dari 1 sampai ${n}. Berapa banyak angka (digit) yang ia tulis?`,
        `${nm} writes down every number from 1 to ${n}. How many digits does ${nm} write?`,
        `${nm} 把 1 到 ${n} 的數全部寫下來，一共寫了幾個數字？`,
      ),
      jawaban: ans,
      salah: [n, 2 * n, ans - 2, ans + 9],
      pembahasan: [
        t(`Bilangan 1 sampai 9 masing-masing terdiri dari 1 angka: 9 angka.`, `The numbers 1 to 9 have 1 digit each: 9 digits.`, `1 到 9 每個數 1 個數字：共 9 個。`),
        t(`Bilangan 10 sampai ${n} ada $${n} - 9 = ${n - 9}$ bilangan, masing-masing 2 angka: $${n - 9} \\times 2 = ${2 * (n - 9)}$ angka.`, `There are $${n} - 9 = ${n - 9}$ numbers from 10 to ${n}, with 2 digits each: $${n - 9} \\times 2 = ${2 * (n - 9)}$ digits.`, `10 到 ${n} 共有 $${n} - 9 = ${n - 9}$ 個數，每個 2 個數字：$${n - 9} \\times 2 = ${2 * (n - 9)}$ 個。`),
        t(`Total: $9 + ${2 * (n - 9)} = ${ans}$ angka.`, `Total: $9 + ${2 * (n - 9)} = ${ans}$ digits.`, `總共：$9 + ${2 * (n - 9)} = ${ans}$ 個數字。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Soal cerita", "Word problems", "應用題"], "mudah", (r, { t }) => {
    const total = r.int(80, 200), per = r.int(8, 20), h = r.int(3, 6), pak = r.pick(["Ali", "Darto", "Komang", "Herman"]);
    if (per * h >= total) return null;
    return {
      pertanyaan: t(
        `Pak ${pak} memanen ${total} kg mangga. Setiap hari ia menjual ${per} kg. Setelah ${h} hari, berapa kg mangga yang tersisa?`,
        `Mr ${pak} harvests ${total} kg of mangoes. He sells ${per} kg every day. How many kilograms are left after ${h} days?`,
        `${pak} 先生採收了 ${total} 公斤芒果，每天賣 ${per} 公斤。${h} 天後還剩幾公斤？`,
      ),
      jawaban: total - per * h,
      satuan: "kg",
      salah: [per * h, total - per, total - per * h + per],
      pembahasan: [
        t(`Mangga terjual: $${per} \\times ${h} = ${per * h}$ kg.`, `Mangoes sold: $${per} \\times ${h} = ${per * h}$ kg.`, `賣出：$${per} \\times ${h} = ${per * h}$ 公斤。`),
        t(`Sisa: $${total} - ${per * h} = ${total - per * h}$ kg.`, `Left: $${total} - ${per * h} = ${total - per * h}$ kg.`, `剩下：$${total} - ${per * h} = ${total - per * h}$ 公斤。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Bilangan berurutan", "Consecutive numbers", "連續整數"], "sulit", (r, { t }) => {
    const m = r.int(10, 60), S = 3 * m;
    return {
      pertanyaan: t(
        `Jumlah tiga bilangan asli berurutan adalah ${S}. Bilangan yang paling besar adalah ...`,
        `Three consecutive whole numbers add up to ${S}. What is the largest of them?`,
        `三個連續整數的和是 ${S}，最大的數是多少？`,
      ),
      jawaban: m + 1,
      salah: [m, m - 1, m + 2],
      pembahasan: [
        t(`Bilangan yang di tengah $= ${S} : 3 = ${m}$.`, `The middle number $= ${S} \\div 3 = ${m}$.`, `中間的數 $= ${S} \\div 3 = ${m}$。`),
        t(`Ketiga bilangan itu: ${m - 1}, ${m}, ${m + 1}.`, `The three numbers are ${m - 1}, ${m}, ${m + 1}.`, `三個數是 ${m - 1}、${m}、${m + 1}。`),
        t(`Cek: $${m - 1} + ${m} + ${m + 1} = ${S}$.`, `Check: $${m - 1} + ${m} + ${m + 1} = ${S}$.`, `驗算：$${m - 1} + ${m} + ${m + 1} = ${S}$。`),
      ],
    };
  }),
  T(KAT.KSM, ["Perkalian", "Multiplication", "乘法"], "mudah", (r, { t }) => {
    const a = r.int(12, 98), b = r.int(3, 9), tt = Math.floor(a / 10) * 10, o = a % 10;
    if (o === 0) return null;
    return {
      pertanyaan: t(`Hasil dari $${a} \\times ${b}$ adalah ...`, `What is $${a} \\times ${b}$?`, `$${a} \\times ${b} = ?$`),
      jawaban: a * b,
      salah: [a * b + 10, a * b - b, a * (b + 1), tt * b + o],
      pembahasan: [
        t(`Pisahkan ${a} menjadi $${tt} + ${o}$.`, `Split ${a} into $${tt} + ${o}$.`, `把 ${a} 拆成 $${tt} + ${o}$。`),
        `$${tt} \\times ${b} = ${tt * b}$, $${o} \\times ${b} = ${o * b}$`,
        t(`Jumlahkan: $${tt * b} + ${o * b} = ${a * b}$.`, `Add them: $${tt * b} + ${o * b} = ${a * b}$.`, `加起來：$${tt * b} + ${o * b} = ${a * b}$。`),
      ],
    };
  }),
];
