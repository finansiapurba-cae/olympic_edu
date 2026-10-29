import { T, KAT, NAMA, frac, fr, gcd, lcm, factors } from "./lib.mjs";

const PI = `$\\pi = ${fr(22, 7)}$`;

export default [
  T(KAT.SEAMO, ["Luas lingkaran", "Area of a circle", "圓面積"], "sedang", (r, { t, fmt }) => {
    const rr = r.pick([7, 14, 21, 28, 35]), ans = (22 * rr * rr) / 7;
    return {
      pertanyaan: t(`Luas lingkaran yang berjari-jari ${rr} cm adalah ... (gunakan ${PI})`, `What is the area of a circle with radius ${rr} cm? (use ${PI})`, `半徑 ${rr} 公分的圓，面積是多少？（${PI}）`),
      jawaban: ans,
      satuan: "cm²",
      salah: [(44 * rr) / 7, (22 * 4 * rr * rr) / 7, ans / 2],
      visual: { j: "lingkaran", r: rr, satuan: "cm", ukur: "luas", hasil: `$\\frac{22}{7} \\times ${rr} \\times ${rr} = ${fmt(ans)}$` },
      pembahasan: [
        t(`Luas lingkaran $= \\pi \\times r \\times r$.`, `Area of a circle $= \\pi \\times r \\times r$.`, `圓面積 $= \\pi \\times r \\times r$。`),
        `$${fr(22, 7)} \\times ${rr} \\times ${rr} = 22 \\times ${rr / 7} \\times ${rr} = ${fmt(ans)}$ cm²`,
      ],
    };
  }),
  T(KAT.KMNR, ["Keliling lingkaran", "Circumference", "圓周長"], "mudah", (r, { t }) => {
    const d = 7 * r.int(1, 10), ans = (22 * d) / 7;
    return {
      pertanyaan: t(`Keliling lingkaran yang berdiameter ${d} cm adalah ... (gunakan ${PI})`, `What is the circumference of a circle with diameter ${d} cm? (use ${PI})`, `直徑 ${d} 公分的圓，圓周長是多少？（${PI}）`),
      jawaban: ans,
      satuan: "cm",
      salah: [ans * 2, ans / 2, 3 * d, (22 * d * d) / 28],
      visual: { j: "lingkaran", d, satuan: "cm", ukur: "keliling", hasil: `$\\frac{22}{7} \\times ${d} = ${ans}$` },
      pembahasan: [
        t(`Keliling lingkaran $= \\pi \\times d$.`, `Circumference $= \\pi \\times d$.`, `圓周長 $= \\pi \\times d$。`),
        `$${fr(22, 7)} \\times ${d} = 22 \\times ${d / 7} = ${ans}$ cm`,
      ],
    };
  }),
  T(KAT.OSN, ["Volume tabung", "Volume of a cylinder", "圓柱體積"], "sedang", (r, { t, fmt }) => {
    const rr = r.pick([7, 14]), h = r.int(5, 20), alas = (22 * rr * rr) / 7, ans = alas * h;
    return {
      pertanyaan: t(
        `Sebuah tabung memiliki jari-jari alas ${rr} cm dan tinggi ${h} cm. Volume tabung itu adalah ... (gunakan ${PI})`,
        `A cylinder has a base radius of ${rr} cm and a height of ${h} cm. What is its volume? (use ${PI})`,
        `一個圓柱底面半徑 ${rr} 公分、高 ${h} 公分，體積是多少？（${PI}）`,
      ),
      jawaban: ans,
      satuan: "cm³",
      langkah: 10,
      salah: [(22 * 2 * rr * h) / 7, alas, 4 * ans],
      visual: { j: "tabung", r: rr, t: h, satuan: "cm", hasil: `$\\frac{22}{7} \\times ${rr} \\times ${rr} \\times ${h} = ${fmt(ans)}$` },
      pembahasan: [
        t(`Volume tabung = luas alas × tinggi.`, `Volume of a cylinder = base area × height.`, `圓柱體積 = 底面積 × 高。`),
        t(`Luas alas `, `Base area `, `底面積 `) + `$= ${fr(22, 7)} \\times ${rr} \\times ${rr} = ${fmt(alas)}$ cm²`,
        t(`Volume `, `Volume `, `體積 `) + `$= ${fmt(alas)} \\times ${h} = ${fmt(ans)}$ cm³`,
      ],
    };
  }),
  T(KAT.KSM, ["Bilangan bulat", "Integers", "整數"], "sedang", (r, { t }) => {
    const a = r.int(2, 20), b = r.int(2, 9), c = r.int(2, 9), ans = -a - b * c;
    return {
      pertanyaan: t(`Hasil dari $-${a} + ${b} \\times (-${c})$ adalah ...`, `What is $-${a} + ${b} \\times (-${c})$?`, `$-${a} + ${b} \\times (-${c}) = ?$`),
      jawaban: ans,
      negatif: true,
      salah: [(-a + b) * -c, -a + b * c, a + b * c],
      visual: { j: "garis", min: ans - 2, max: 2, mulai: 0, lompat: [{ ke: -a, label: `−${a}` }, { ke: ans, label: `−${b * c}` }], tanya: ans, tanyaNanti: true },
      pembahasan: [
        t(`Kerjakan perkalian lebih dahulu: $${b} \\times (-${c}) = -${b * c}$.`, `Multiply first: $${b} \\times (-${c}) = -${b * c}$.`, `先算乘法：$${b} \\times (-${c}) = -${b * c}$。`),
        `$-${a} + (-${b * c}) = -${a} - ${b * c} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KMNR, ["Statistika", "Statistics", "統計"], "sedang", (r, { t }) => {
    const v = Array.from({ length: 7 }, () => r.int(4, 10)), s = [...v].sort((p, q) => p - q), med = s[3];
    if (v[3] === med) return null;
    const sep = t(", ", ", ", "、");
    return {
      pertanyaan: t(`Nilai kuis 7 siswa: ${v.join(", ")}. Median data tersebut adalah ...`, `The quiz scores of 7 students are ${v.join(", ")}. What is the median?`, `7 位學生的小考分數是 ${v.join("、")}。中位數是多少？`),
      jawaban: med,
      salah: [v[3], s[2] === med ? s[4] : s[2], Math.max(...v), Math.min(...v)],
      visual: { j: "data", mode: "median", nilai: v },
      pembahasan: [
        t(`Urutkan data dari yang terkecil: `, `Sort the data from smallest to largest: `, `由小到大排列：`) + s.join(sep) + ".",
        t(`Median adalah data yang di tengah. Dari 7 data, data ke-4 ada di tengah.`, `The median is the middle value. With 7 values, the 4th one is in the middle.`, `中位數是正中間的數。7 個數中，第 4 個在正中間。`),
        t(`Data ke-4 adalah ${med}.`, `The 4th value is ${med}.`, `第 4 個數是 ${med}。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Statistika", "Statistics", "統計"], "mudah", (r, { t }) => {
    const m = r.int(60, 90);
    const others = [];
    while (others.length < 6) {
      const x = r.int(60, 95);
      if (x !== m && others.filter((o) => o === x).length < 2) others.push(x);
    }
    const data = r.shuffle([m, m, m, ...others]);
    const counts = {};
    data.forEach((x) => (counts[x] = (counts[x] ?? 0) + 1));
    if (Object.values(counts).filter((c) => c >= 3).length !== 1) return null;
    return {
      pertanyaan: t(`Data nilai ulangan 9 siswa: ${data.join(", ")}. Modus data tersebut adalah ...`, `The test scores of 9 students are ${data.join(", ")}. What is the mode?`, `9 位學生的考試分數是 ${data.join("、")}。眾數是多少？`),
      jawaban: m,
      salah: [Math.max(...data), [...data].sort((p, q) => p - q)[4], Math.min(...data)].filter((x) => x !== m),
      visual: { j: "data", nilai: data },
      pembahasan: [
        t(`Modus adalah data yang paling sering muncul.`, `The mode is the value that appears most often.`, `眾數是出現最多次的數。`),
        t(`Nilai ${m} muncul 3 kali, lebih banyak daripada nilai lainnya.`, `${m} appears 3 times, more than any other value.`, `${m} 出現 3 次，比其他數都多。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["KPK", "LCM", "最小公倍數"], "sedang", (r, { t }) => {
    const x = r.pick([[4, 6, 8], [6, 8, 12], [3, 4, 10], [6, 9, 15], [4, 10, 15], [8, 12, 18], [6, 10, 15], [5, 6, 8]]);
    const L2 = lcm(x[0], x[1]), L = lcm(L2, x[2]);
    return {
      pertanyaan: t(`KPK dari ${x[0]}, ${x[1]}, dan ${x[2]} adalah ...`, `What is the LCM of ${x[0]}, ${x[1]} and ${x[2]}?`, `${x[0]}、${x[1]}、${x[2]} 的最小公倍數是多少？`),
      jawaban: L,
      salah: [L * 2, L / 2, x[0] * x[1] * x[2], L2],
      visual: { j: "daftar", baris: x.map((v) => ({ label: `×${v}`, angka: Array.from({ length: L / v }, (_, i) => v * (i + 1)) })), sorot: [L] },
      pembahasan: [
        t(`Cara cepat: cari KPK dua bilangan dulu, lalu dengan bilangan ketiga.`, `Quick method: find the LCM of two numbers first, then with the third.`, `快速做法：先求兩個數的最小公倍數，再和第三個數求。`),
        t(`KPK dari ${x[0]} dan ${x[1]} adalah ${L2}.`, `The LCM of ${x[0]} and ${x[1]} is ${L2}.`, `${x[0]} 和 ${x[1]} 的最小公倍數是 ${L2}。`),
        t(`KPK dari ${L2} dan ${x[2]} adalah ${L}.`, `The LCM of ${L2} and ${x[2]} is ${L}.`, `${L2} 和 ${x[2]} 的最小公倍數是 ${L}。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["FPB", "GCF", "最大公因數"], "sedang", (r, { t }) => {
    const x = r.pick([[12, 18, 24], [24, 36, 60], [16, 24, 40], [18, 27, 45], [20, 30, 50], [30, 45, 75], [14, 28, 42]]);
    const G2 = gcd(x[0], x[1]), G = gcd(G2, x[2]);
    return {
      pertanyaan: t(`FPB dari ${x[0]}, ${x[1]}, dan ${x[2]} adalah ...`, `What is the GCF of ${x[0]}, ${x[1]} and ${x[2]}?`, `${x[0]}、${x[1]}、${x[2]} 的最大公因數是多少？`),
      jawaban: G,
      salah: [G * 2, G / 2, G2 === G ? G + 1 : G2, x[0]],
      visual: { j: "daftar", baris: x.map((v) => ({ label: v, angka: factors(v) })), sorot: factors(G) },
      pembahasan: [
        t(`FPB dari ${x[0]} dan ${x[1]} adalah ${G2}.`, `The GCF of ${x[0]} and ${x[1]} is ${G2}.`, `${x[0]} 和 ${x[1]} 的最大公因數是 ${G2}。`),
        t(`FPB dari ${G2} dan ${x[2]} adalah ${G}.`, `The GCF of ${G2} and ${x[2]} is ${G}.`, `${G2} 和 ${x[2]} 的最大公因數是 ${G}。`),
        t(`Cek: `, `Check: `, `驗算：`) + x.map((v) => `$${v} \\div ${G} = ${v / G}$`).join(t(", ", ", ", "、")),
      ],
    };
  }),
  T(KAT.OSN, ["Peluang", "Probability", "機率"], "sedang", (r, { t }) => {
    const m = r.int(2, 8), b = r.int(2, 8), k = r.int(1, 6), N = m + b + k, ans = frac(m, N);
    return {
      pertanyaan: t(
        `Dalam sebuah kantong terdapat ${m} kelereng merah, ${b} kelereng biru, dan ${k} kelereng kuning. Sebuah kelereng diambil secara acak. Peluang terambilnya kelereng merah adalah ...`,
        `A bag holds ${m} red marbles, ${b} blue marbles and ${k} yellow marbles. One marble is picked at random. What is the probability that it is red?`,
        `袋子裡有 ${m} 顆紅彈珠、${b} 顆藍彈珠和 ${k} 顆黃彈珠。隨機拿出一顆，拿到紅彈珠的機率是多少？`,
      ),
      jawaban: ans,
      salah: [frac(m, b + k), `$${fr(1, 3)}$`, frac(b, N), frac(m + 1, N)].filter((x) => x !== ans),
      visual: { j: "hitung", grup: [{ n: m, e: "🔴" }, { n: b, e: "🔵" }, { n: k, e: "🟡" }], op: "+", hasil: ans },
      pembahasan: [
        t(`Banyak semua kelereng: $${m} + ${b} + ${k} = ${N}$.`, `Total marbles: $${m} + ${b} + ${k} = ${N}$.`, `彈珠總數：$${m} + ${b} + ${k} = ${N}$。`),
        t(`Peluang merah = banyak kelereng merah : banyak semua kelereng `, `P(red) = red marbles ÷ all marbles `, `紅色機率 = 紅彈珠數 ÷ 總數 `) + `$= ${fr(m, N)}$` + (gcd(m, N) > 1 ? ` = ${ans}` : "") + ".",
      ],
    };
  }),
  T(KAT.KMNR, ["Kaidah pencacahan", "Counting", "計數原理"], "mudah", (r, { t }) => {
    const a = r.int(2, 6), b = r.int(2, 5), topi = r.next() < 0.5, c = topi ? r.int(2, 3) : 1, ans = a * b * c, n = r.pick(NAMA);
    const rumus = topi ? `${a} \\times ${b} \\times ${c}` : `${a} \\times ${b}`;
    return {
      pertanyaan: t(
        `${n} punya ${a} kaus dan ${b} celana${topi ? ` serta ${c} topi` : ""}. Berapa banyak pasangan pakaian berbeda yang dapat dipakai${topi ? " (kaus, celana, dan topi)" : " (satu kaus dan satu celana)"}?`,
        `${n} has ${a} T-shirts and ${b} pairs of trousers${topi ? ` and ${c} hats` : ""}. How many different outfits can ${n} wear${topi ? " (T-shirt, trousers and hat)" : " (one T-shirt and one pair of trousers)"}?`,
        `${n} 有 ${a} 件 T 恤、${b} 條褲子${topi ? `和 ${c} 頂帽子` : ""}。一共可以搭配出幾種不同的穿法${topi ? "（T 恤、褲子、帽子各一）" : "（一件 T 恤配一條褲子）"}？`,
      ),
      jawaban: ans,
      salah: [a + b + (topi ? c : 0), ans + 1, topi ? a * b : ans * 2],
      visual: { j: "susunan", baris: a, kolom: b, eBaris: "👕", eKolom: "👖", kali: c, hasil: ans },
      pembahasan: [
        t(`Setiap kaus dapat dipasangkan dengan setiap celana${topi ? " dan setiap topi" : ""}.`, `Every T-shirt can go with every pair of trousers${topi ? " and every hat" : ""}.`, `每件 T 恤都能搭配每條褲子${topi ? "和每頂帽子" : ""}。`),
        `$${rumus} = ${ans}$`,
      ],
    };
  }),
  T(KAT.OSN, ["Kaidah pencacahan", "Counting", "計數原理"], "sulit", (r, { t }) => {
    const n = r.int(4, 7), beda = r.next() < 0.6, ans = beda ? n * (n - 1) * (n - 2) : n ** 3;
    const kartu = Array.from({ length: n }, (_, i) => i + 1);
    return {
      pertanyaan: t(
        `Dari angka-angka ${kartu.join(", ")} akan dibuat bilangan tiga angka ${beda ? "dengan angka-angka yang berbeda (tidak boleh berulang)" : "dan angkanya boleh berulang"}. Banyaknya bilangan yang dapat dibuat adalah ...`,
        `Three-digit numbers are made from the digits ${kartu.join(", ")}${beda ? ", with all digits different (no repeats)" : ", and digits may repeat"}. How many such numbers can be made?`,
        `用數字 ${kartu.join("、")} 組成三位數，${beda ? "每個數字都不同（不可重複）" : "數字可以重複"}。一共可以組成幾個？`,
      ),
      jawaban: ans,
      salah: beda ? [n ** 3, n * (n - 1), ans / 6] : [n * (n - 1) * (n - 2), 3 * n, n * n],
      visual: { j: "slot", pilihan: beda ? [n, n - 1, n - 2] : [n, n, n], hasil: ans },
      pembahasan: beda
        ? [
            t(`Angka ratusan: ${n} pilihan. Angka puluhan: ${n - 1} pilihan (tidak boleh sama). Angka satuan: ${n - 2} pilihan.`, `Hundreds digit: ${n} choices. Tens digit: ${n - 1} choices (it must be different). Ones digit: ${n - 2} choices.`, `百位：${n} 種選法；十位：${n - 1} 種（不能重複）；個位：${n - 2} 種。`),
            `$${n} \\times ${n - 1} \\times ${n - 2} = ${ans}$`,
          ]
        : [
            t(`Setiap tempat (ratusan, puluhan, satuan) masing-masing punya ${n} pilihan karena angka boleh berulang.`, `Each place (hundreds, tens, ones) has ${n} choices because digits may repeat.`, `數字可以重複，所以百位、十位、個位各有 ${n} 種選法。`),
            `$${n} \\times ${n} \\times ${n} = ${ans}$`,
          ],
    };
  }),
  T(KAT.KOSSMI, ["Koordinat", "Coordinates", "坐標"], "mudah", (r, { t }) => {
    const x = r.int(-5, 6), y = r.int(-5, 6), a = r.int(1, 5), b = r.int(1, 5);
    const P = (p, q) => `$(${p}, ${q})$`;
    return {
      pertanyaan: t(
        `Titik $A(${x}, ${y})$ digeser ${a} satuan ke kanan dan ${b} satuan ke bawah. Koordinat titik A yang baru adalah ...`,
        `Point $A(${x}, ${y})$ is moved ${a} unit${a > 1 ? "s" : ""} right and ${b} unit${b > 1 ? "s" : ""} down. What are the new coordinates of A?`,
        `點 $A(${x}, ${y})$ 向右移動 ${a} 單位、向下移動 ${b} 單位。A 的新坐標是什麼？`,
      ),
      jawaban: P(x + a, y - b),
      salah: [P(x - a, y + b), P(x + a, y + b), P(x - a, y - b), P(x + b, y - a)],
      visual: { j: "koordinat", dari: [x, y], ke: [x + a, y - b] },
      pembahasan: [
        t(`Ke kanan berarti koordinat x ditambah: $${x} + ${a} = ${x + a}$.`, `Moving right adds to the x-coordinate: $${x} + ${a} = ${x + a}$.`, `向右移，x 坐標加：$${x} + ${a} = ${x + a}$。`),
        t(`Ke bawah berarti koordinat y dikurangi: $${y} - ${b} = ${y - b}$.`, `Moving down subtracts from the y-coordinate: $${y} - ${b} = ${y - b}$.`, `向下移，y 坐標減：$${y} - ${b} = ${y - b}$。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Barisan bilangan", "Sequences", "數列"], "sedang", (r, { t }) => {
    const a = r.int(2, 10), d = r.int(2, 7), n = r.int(10, 30), ans = a + (n - 1) * d;
    const seq = [a, a + d, a + 2 * d, a + 3 * d];
    return {
      pertanyaan: t(`Suku ke-${n} dari barisan ${seq.join(", ")}, ... adalah ...`, `What is term number ${n} of the sequence ${seq.join(", ")}, ...?`, `數列 ${seq.join("、")}、……的第 ${n} 項是多少？`),
      jawaban: ans,
      salah: [a + n * d, n * d, a + (n - 2) * d],
      visual: { j: "pola", suku: seq, beda: `+${d}`, ke: n, jawab: ans, catatan: `$${a} + (${n} - 1) \\times ${d} = ${ans}$` },
      pembahasan: [
        t(`Bedanya (selisih tiap suku) adalah ${d}.`, `The common difference is ${d}.`, `公差（相鄰兩項的差）是 ${d}。`),
        t(`Dari suku ke-1 ke suku ke-${n} ada ${n - 1} kali loncatan.`, `From term 1 to term ${n} there are ${n - 1} jumps.`, `從第 1 項到第 ${n} 項要跳 ${n - 1} 次。`),
        t(`Suku ke-${n} `, `Term ${n} `, `第 ${n} 項 `) + `$= ${a} + ${n - 1} \\times ${d} = ${ans}$`,
      ],
    };
  }),
  T(KAT.OSN, ["Barisan bilangan", "Sequences", "數列"], "sulit", (r, { t }) => {
    const a = r.int(1, 9), d = r.int(2, 5), n = r.int(8, 15), last = a + (n - 1) * d, ans = (n * (a + last)) / 2;
    const seq = [a, a + d, a + 2 * d];
    return {
      pertanyaan: t(`Jumlah ${n} suku pertama barisan ${seq.join(", ")}, ... adalah ...`, `What is the sum of the first ${n} terms of the sequence ${seq.join(", ")}, ...?`, `數列 ${seq.join("、")}、……前 ${n} 項的和是多少？`),
      jawaban: ans,
      salah: [n * last, ans - last, ans + a + n * d],
      visual: { j: "pasangan", suku: Array.from({ length: n }, (_, i) => a + i * d), jawab: ans },
      pembahasan: [
        t(`Suku ke-${n} `, `Term ${n} `, `第 ${n} 項 `) + `$= ${a} + (${n} - 1) \\times ${d} = ${last}$`,
        t(`Pasangkan suku pertama dan terakhir: `, `Pair the first and last terms: `, `首項和末項配對：`) + `$${a} + ${last} = ${a + last}$`,
        t(`Jumlah `, `Sum `, `和 `) + `$= ${fr(n, 2)} \\times ${a + last} = ${ans}$`,
      ],
    };
  }),
  T(KAT.SEAMO, ["Perpangkatan", "Powers", "次方"], "sedang", (r, { t }) => {
    const base = r.pick([2, 3, 5]), a = r.int(3, 9), b = r.int(2, 8), c = r.int(2, a + b - 2), ans = a + b - c;
    const P = (e) => `$${base}^{${e}}$`;
    const bagi = t(":", "\\div", "\\div");
    return {
      pertanyaan: t(
        `Hasil dari $${base}^{${a}} \\times ${base}^{${b}} ${bagi} ${base}^{${c}}$ dapat ditulis sebagai ...`,
        `$${base}^{${a}} \\times ${base}^{${b}} ${bagi} ${base}^{${c}}$ can be written as ...`,
        `$${base}^{${a}} \\times ${base}^{${b}} ${bagi} ${base}^{${c}}$ 可以寫成什麼？`,
      ),
      jawaban: P(ans),
      salah: [P(a * b - c), P(a + b + c), P(ans + 1)],
      visual: { j: "pangkat", dasar: base, a, b, c, jawab: ans },
      pembahasan: [
        t(`Perkalian bilangan berpangkat dengan basis sama: pangkatnya dijumlahkan. Pembagian: pangkatnya dikurangkan.`, `When multiplying powers with the same base, add the exponents. When dividing, subtract them.`, `同底數相乘，指數相加；相除，指數相減。`),
        `$${base}^{${a} + ${b} - ${c}} = ${base}^{${ans}}$`,
      ],
    };
  }),
  T(KAT.OSN, ["Angka satuan", "Last digit", "個位數字"], "sulit", (r, { t }) => {
    const n = r.int(10, 50), cyc = [3, 9, 7, 1], s = n % 4, ans = cyc[(n - 1) % 4];
    return {
      pertanyaan: t(`Angka satuan dari $3^{${n}}$ adalah ...`, `What is the ones digit of $3^{${n}}$?`, `$3^{${n}}$ 的個位數字是多少？`),
      jawaban: ans,
      salah: cyc.filter((v) => v !== ans),
      visual: { j: "siklus", dasar: 3, isi: cyc, n },
      pembahasan: [
        t(`Angka satuan dari $3^1, 3^2, 3^3, 3^4, 3^5, \\ldots$ adalah 3, 9, 7, 1, 3, ... (berulang setiap 4).`, `The ones digits of $3^1, 3^2, 3^3, 3^4, 3^5, \\ldots$ are 3, 9, 7, 1, 3, ... (repeating every 4).`, `$3^1, 3^2, 3^3, 3^4, 3^5, \\ldots$ 的個位數字是 3、9、7、1、3、……（每 4 個重複）。`),
        t(`$${n} : 4 = ${Math.floor(n / 4)}$ sisa ${s}.`, `$${n} \\div 4 = ${Math.floor(n / 4)}$ remainder ${s}.`, `$${n} \\div 4 = ${Math.floor(n / 4)}$ 餘 ${s}。`),
        s === 0
          ? t(`Sisa 0 berarti sama dengan $3^4$, angka satuannya 1.`, `Remainder 0 means it matches $3^4$, so the ones digit is 1.`, `餘 0 表示和 $3^4$ 一樣，個位數字是 1。`)
          : t(`Sisa ${s} berarti sama dengan $3^{${s}}$, angka satuannya ${ans}.`, `Remainder ${s} means it matches $3^{${s}}$, so the ones digit is ${ans}.`, `餘 ${s} 表示和 $3^{${s}}$ 一樣，個位數字是 ${ans}。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Perbandingan berbalik nilai", "Inverse proportion", "反比"], "sulit", (r, { t }) => {
    const p = r.int(4, 12), d = r.int(6, 20), W = p * d;
    const qs = [];
    for (let q = p + 2; q <= 3 * p; q++) if (W % q === 0) qs.push(q);
    if (!qs.length) return null;
    const q = r.pick(qs), ans = W / q;
    return {
      pertanyaan: t(
        `Pembangunan sebuah pos ronda dapat diselesaikan oleh ${p} pekerja dalam ${d} hari. Jika dikerjakan oleh ${q} pekerja dengan kecepatan kerja yang sama, pekerjaan itu selesai dalam ...`,
        `${p} workers can build a guard post in ${d} days. If ${q} workers working at the same speed do the job, how long will it take?`,
        `${p} 個工人 ${d} 天可以蓋好一間警衛亭。如果改由 ${q} 個工作速度一樣的工人來蓋，要幾天？`,
      ),
      jawaban: ans,
      satuan: t("hari", "days", "天"),
      salah: [(d * q) / p, d - (q - p), ans + 1],
      visual: { j: "susunan", baris: p, kolom: d, ubah: q },
      pembahasan: [
        t(`Makin banyak pekerja, makin cepat selesai (perbandingan berbalik nilai).`, `More workers means the job finishes faster (inverse proportion).`, `工人越多，完成得越快（反比）。`),
        t(`Total pekerjaan $= ${p} \\times ${d} = ${W}$ hari-orang.`, `Total work $= ${p} \\times ${d} = ${W}$ worker-days.`, `總工作量 $= ${p} \\times ${d} = ${W}$ 人天。`),
        t(`Waktu dengan ${q} pekerja $= ${W} : ${q} = ${ans}$ hari.`, `Time with ${q} workers $= ${W} \\div ${q} = ${ans}$ days.`, `${q} 個工人需要 $${W} \\div ${q} = ${ans}$ 天。`),
      ],
    };
  }),
  T(KAT.OSN, ["Geometri", "Geometry", "幾何"], "sulit", (r, { t }) => {
    const n = r.int(5, 12), ans = (n * (n - 3)) / 2;
    const id = { 5: "segi lima", 6: "segi enam", 7: "segi tujuh", 8: "segi delapan", 9: "segi sembilan", 10: "segi sepuluh", 11: "segi sebelas", 12: "segi dua belas" }[n];
    const zh = { 5: "五", 6: "六", 7: "七", 8: "八", 9: "九", 10: "十", 11: "十一", 12: "十二" }[n];
    return {
      pertanyaan: t(`Berapa banyak diagonal pada bangun ${id} (${n} sisi)?`, `How many diagonals does a polygon with ${n} sides have?`, `${zh}邊形（${n} 條邊）有幾條對角線？`),
      jawaban: ans,
      salah: [n * (n - 3), (n * (n - 1)) / 2, n - 3],
      visual: { j: "poligon", n, hasil: ans },
      pembahasan: [
        t(`Dari setiap titik sudut dapat ditarik diagonal ke $${n} - 3 = ${n - 3}$ titik lain (tidak ke dirinya sendiri dan 2 titik tetangganya).`, `From each vertex you can draw diagonals to $${n} - 3 = ${n - 3}$ other vertices (not to itself or its 2 neighbours).`, `從每個頂點可以畫對角線到 $${n} - 3 = ${n - 3}$ 個頂點（不包括自己和相鄰的 2 個）。`),
        t(`$${n} \\times ${n - 3} = ${n * (n - 3)}$, tetapi setiap diagonal terhitung dua kali.`, `$${n} \\times ${n - 3} = ${n * (n - 3)}$, but each diagonal is counted twice.`, `$${n} \\times ${n - 3} = ${n * (n - 3)}$，但每條對角線被算了兩次。`),
        t(`Jadi banyak diagonal $= ${n * (n - 3)} : 2 = ${ans}$.`, `So the number of diagonals $= ${n * (n - 3)} \\div 2 = ${ans}$.`, `所以對角線有 $${n * (n - 3)} \\div 2 = ${ans}$ 條。`),
      ],
    };
  }),
  T(KAT.KOSSMI, ["Akar kuadrat", "Square roots", "平方根"], "mudah", (r, { t }) => {
    const a = r.int(4, 15), b = r.int(4, 15), kali = r.next() < 0.4, ans = kali ? a * b : a + b, op = kali ? "\\times" : "+";
    return {
      tingkat: kali ? "sedang" : "mudah",
      pertanyaan: t(`Hasil dari $\\sqrt{${a * a}} ${op} \\sqrt{${b * b}}$ adalah ...`, `What is $\\sqrt{${a * a}} ${op} \\sqrt{${b * b}}$?`, `$\\sqrt{${a * a}} ${op} \\sqrt{${b * b}} = ?$`),
      jawaban: ans,
      salah: kali ? [a + b, ans + a, ans - b] : [a * b, ans + 1, ans - 2],
      visual: { j: "akar", sisi: [a, b], op: kali ? "×" : "+" },
      pembahasan: [
        t(`$\\sqrt{${a * a}} = ${a}$ karena $${a} \\times ${a} = ${a * a}$.`, `$\\sqrt{${a * a}} = ${a}$ because $${a} \\times ${a} = ${a * a}$.`, `$\\sqrt{${a * a}} = ${a}$，因為 $${a} \\times ${a} = ${a * a}$。`),
        t(`$\\sqrt{${b * b}} = ${b}$ karena $${b} \\times ${b} = ${b * b}$.`, `$\\sqrt{${b * b}} = ${b}$ because $${b} \\times ${b} = ${b * b}$.`, `$\\sqrt{${b * b}} = ${b}$，因為 $${b} \\times ${b} = ${b * b}$。`),
        `$${a} ${op} ${b} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KSM, ["Bunga tabungan", "Savings interest", "存款利息"], "sedang", (r, { t, rp, fmt }) => {
    const Tt = r.int(10, 50) * 100000, p = r.pick([5, 6, 8, 10, 12]), bunga = (Tt * p) / 100, n = r.pick(NAMA);
    return {
      pertanyaan: t(
        `${n} menabung ${rp(Tt)} di bank dengan bunga ${p}% per tahun. Berapa jumlah tabungannya setelah 1 tahun?`,
        `${n} puts ${rp(Tt)} in a bank that pays ${p}% interest per year. How much money is in the account after 1 year?`,
        `${n} 把 ${rp(Tt)} 存進銀行，年利率 ${p}%。1 年後存款共有多少？`,
      ),
      prefix: "Rp",
      langkah: 10000,
      jawaban: Tt + bunga,
      salah: [bunga, Tt + p * 1000, Tt + 2 * bunga],
      visual: { j: "persen", p, total: fmt(Tt), hasil: `${fmt(Tt)} + ${fmt(bunga)} = ${fmt(Tt + bunga)}` },
      pembahasan: [
        t(`Bunga 1 tahun `, `Interest for 1 year `, `1 年的利息 `) + `$= ${p}\\% \\times ${fmt(Tt)} = ${fmt(bunga)}$`,
        t(`Tabungan akhir `, `Final amount `, `存款總額 `) + `$= ${fmt(Tt)} + ${fmt(bunga)} = ${fmt(Tt + bunga)}$`,
      ],
    };
  }),
  T(KAT.OMNAS, ["Rata-rata gabungan", "Combined average", "合併平均數"], "sulit", (r, { t }) => {
    const n1 = r.int(10, 25), n2 = r.int(10, 25), r1 = r.int(70, 85), r2 = r.int(70, 90), S = n1 * r1 + n2 * r2, N = n1 + n2;
    if (S % N !== 0 || r1 === r2) return null;
    const ans = S / N;
    return {
      pertanyaan: t(
        `Rata-rata nilai ${n1} siswa kelas 6A adalah ${r1}, sedangkan rata-rata nilai ${n2} siswa kelas 6B adalah ${r2}. Rata-rata nilai gabungan kedua kelas adalah ...`,
        `The ${n1} students in class 6A have an average score of ${r1}, and the ${n2} students in class 6B have an average of ${r2}. What is the average of both classes together?`,
        `6A 班 ${n1} 位學生的平均分數是 ${r1}，6B 班 ${n2} 位學生的平均分數是 ${r2}。兩班合起來的平均分數是多少？`,
      ),
      jawaban: ans,
      salah: [(r1 + r2) / 2, ans + 1, ans - 1, Math.max(r1, r2)],
      visual: { j: "banding", baris: [{ label: `6A · ${n1}`, nilai: r1 }, { label: `6B · ${n2}`, nilai: r2 }], garis: ans, hasil: ans },
      pembahasan: [
        t(`Jumlah nilai 6A `, `Total for 6A `, `6A 總分 `) + `$= ${n1} \\times ${r1} = ${n1 * r1}$. ` + t(`Jumlah nilai 6B `, `Total for 6B `, `6B 總分 `) + `$= ${n2} \\times ${r2} = ${n2 * r2}$.`,
        t(`Jumlah semua nilai `, `Total of all scores `, `全部總分 `) + `$= ${n1 * r1} + ${n2 * r2} = ${S}$, ` + t(`banyak siswa `, `number of students `, `學生人數 `) + `$= ${N}$.`,
        t(`Rata-rata gabungan `, `Combined average `, `合併平均 `) + `$= ${S} \\div ${N} = ${ans}$`,
      ],
    };
  }),
];
