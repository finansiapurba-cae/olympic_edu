import { T, KAT, NAMA, EMOJI } from "./lib.mjs";

// [id, en (jamak), kata bantu bilangan zh, zh]
const BENDA = [
  ["kelereng", "marbles", "顆", "彈珠"],
  ["permen", "candies", "顆", "糖果"],
  ["stiker", "stickers", "張", "貼紙"],
  ["kue", "cookies", "片", "餅乾"],
  ["jeruk", "oranges", "個", "橘子"],
  ["pensil", "pencils", "枝", "鉛筆"],
];
const MAKANAN = [
  ["kue", "cakes", "塊", "蛋糕"],
  ["jeruk", "oranges", "個", "橘子"],
  ["apel", "apples", "個", "蘋果"],
  ["roti", "buns", "個", "麵包"],
];

export default [
  T(KAT.KMNR, ["Penjumlahan", "Addition", "加法"], "mudah", (r, { t }) => {
    const n = r.pick(NAMA), a = r.int(3, 12), b = r.int(2, 8), [bi, be, bc, bz] = r.pick(BENDA);
    return {
      pertanyaan: t(
        `${n} punya ${a} ${bi}. Ibu memberi ${n} ${b} ${bi} lagi. Berapa banyak ${bi} ${n} sekarang?`,
        `${n} has ${a} ${be}. Mom gives ${n} ${b} more ${be}. How many ${be} does ${n} have now?`,
        `${n} 有 ${a} ${bc}${bz}。媽媽又給了 ${n} ${b} ${bc}${bz}。${n} 現在有幾${bc}${bz}？`,
      ),
      jawaban: a + b,
      salah: [a - b, a + b - 1, a + b + 1],
      visual: { j: "hitung", grup: [{ n: a, e: EMOJI[bi] }, { n: b, e: EMOJI[bi] }], op: "+", hasil: a + b },
      pembahasan: [
        t(`Mula-mula ${n} punya ${a} ${bi}.`, `At first ${n} has ${a} ${be}.`, `${n} 原本有 ${a} ${bc}${bz}。`),
        t(`Diberi lagi ${b}, artinya ditambah: $${a} + ${b} = ${a + b}$.`, `Getting ${b} more means we add: $${a} + ${b} = ${a + b}$.`, `再給 ${b} ${bc}，就是相加：$${a} + ${b} = ${a + b}$。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Pengurangan", "Subtraction", "減法"], "mudah", (r, { t }) => {
    const a = r.int(10, 20), b = r.int(3, 9), [mi, me, mc, mz] = r.pick(MAKANAN);
    return {
      pertanyaan: t(
        `Di atas piring ada ${a} ${mi}. Adik memakan ${b} ${mi}. Berapa ${mi} yang tersisa?`,
        `There are ${a} ${me} on a plate. Little brother eats ${b} ${me}. How many ${me} are left?`,
        `盤子上有 ${a} ${mc}${mz}。弟弟吃了 ${b} ${mc}${mz}。還剩下幾${mc}${mz}？`,
      ),
      jawaban: a - b,
      salah: [a + b, a - b + 1, a - b - 1],
      visual: { j: "hitung", grup: [{ n: a, e: EMOJI[mi], coret: b }], hasil: a - b },
      pembahasan: [
        t(`Dimakan berarti berkurang, jadi kita kurangi.`, `Eating some means there are fewer, so we subtract.`, `吃掉就是變少，所以用減法。`),
        `$${a} - ${b} = ${a - b}$`,
      ],
    };
  }),
  T(KAT.SEAMO, ["Pola bilangan", "Number patterns", "數字規律"], "mudah", (r, { t }) => {
    const s = r.pick([2, 3, 5, 10]), a = r.int(1, 10);
    const seq = [0, 1, 2, 3].map((i) => a + i * s);
    const ans = a + 4 * s;
    return {
      tingkat: s === 2 || s === 10 ? "mudah" : "sedang",
      pertanyaan: t(
        `Lanjutkan pola bilangan berikut: ${seq.join(", ")}, ... Bilangan berikutnya adalah ...`,
        `Continue the number pattern: ${seq.join(", ")}, ... What is the next number?`,
        `接下來是哪個數？${seq.join("、")}、……`,
      ),
      jawaban: ans,
      salah: [ans + s, ans - 1, ans + 1, seq[3]],
      visual: { j: "pola", suku: seq, beda: `+${s}`, jawab: ans },
      pembahasan: [
        t(`Hitung selisih dua bilangan yang berdekatan: $${seq[1]} - ${seq[0]} = ${s}$.`, `Find the difference between neighbouring numbers: $${seq[1]} - ${seq[0]} = ${s}$.`, `算出相鄰兩數的差：$${seq[1]} - ${seq[0]} = ${s}$。`),
        t(`Setiap langkah bilangannya bertambah ${s}.`, `Each step adds ${s}.`, `每一步都加 ${s}。`),
        t(`Bilangan berikutnya: $${seq[3]} + ${s} = ${ans}$.`, `Next number: $${seq[3]} + ${s} = ${ans}$.`, `下一個數：$${seq[3]} + ${s} = ${ans}$。`),
      ],
    };
  }),
  T(KAT.KOSSMI, ["Bilangan", "Numbers", "數的認識"], "sedang", (r, { t }) => {
    const a = r.int(2, 30), gap = 2 * r.int(2, 6), b = a + gap, ans = a + gap / 2;
    return {
      pertanyaan: t(
        `Bilangan yang letaknya tepat di tengah-tengah ${a} dan ${b} adalah ...`,
        `Which number is exactly halfway between ${a} and ${b}?`,
        `剛好在 ${a} 和 ${b} 正中間的數是多少？`,
      ),
      jawaban: ans,
      salah: [ans + 1, ans - 1, ans + 2],
      visual: { j: "garis", min: a - 1, max: b + 1, titik: [a, b], tanya: ans, tanyaNanti: true },
      pembahasan: [
        t(`Jarak dari ${a} ke ${b} adalah $${b} - ${a} = ${gap}$.`, `The distance from ${a} to ${b} is $${b} - ${a} = ${gap}$.`, `從 ${a} 到 ${b} 相差 $${b} - ${a} = ${gap}$。`),
        t(`Setengah dari ${gap} adalah ${gap / 2}.`, `Half of ${gap} is ${gap / 2}.`, `${gap} 的一半是 ${gap / 2}。`),
        t(`Bilangan tengahnya: $${a} + ${gap / 2} = ${ans}$.`, `The middle number: $${a} + ${gap / 2} = ${ans}$.`, `中間的數：$${a} + ${gap / 2} = ${ans}$。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Membandingkan bilangan", "Comparing numbers", "比較大小"], "mudah", (r, { t }) => {
    const x = r.int(1, 9);
    let y = r.int(1, 9);
    if (y === x) y = (x % 9) + 1;
    const set = new Set([10 * x + y, 10 * y + x]);
    while (set.size < 4) set.add(r.int(11, 99));
    const nums = r.shuffle([...set]);
    const max = Math.max(...nums);
    const sorted = [...nums].sort((p, q) => q - p);
    return {
      pertanyaan: t(
        `Di antara bilangan ${nums.join(", ")}, manakah yang paling besar?`,
        `Which is the largest of the numbers ${nums.join(", ")}?`,
        `${nums.join("、")} 之中，哪一個數最大？`,
      ),
      jawaban: String(max),
      salah: nums.filter((v) => v !== max).map(String),
      visual: { j: "kartu", angka: nums, jawab: max },
      pembahasan: [
        t(`Bandingkan dulu angka puluhan setiap bilangan. Angka puluhan yang paling besar menunjukkan bilangan terbesar.`, `First compare the tens digits. The number with the largest tens digit is the largest.`, `先比較十位數字，十位數字最大的數就最大。`),
        t(`Jika angka puluhannya sama, bandingkan angka satuannya.`, `If the tens digits are the same, compare the ones digits.`, `如果十位數字相同，再比較個位數字。`),
        t(`Urutan dari yang terbesar: ${sorted.join(", ")}.`, `From largest to smallest: ${sorted.join(", ")}.`, `由大到小：${sorted.join("、")}。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Nilai tempat", "Place value", "位值"], "mudah", (r, { t }) => {
    const p = r.int(1, 9), s = r.int(1, 9), ans = 10 * p + s;
    return {
      pertanyaan: t(`${p} puluhan dan ${s} satuan membentuk bilangan ...`, `${p} tens and ${s} ones make the number ...`, `${p} 個十和 ${s} 個一合起來是多少？`),
      jawaban: ans,
      salah: [10 * s + p, p + s, ans + 10],
      visual: { j: "nilaiTempat", angka: ans },
      pembahasan: [
        t(`${p} puluhan $= ${p * 10}$.`, `${p} tens $= ${p * 10}$.`, `${p} 個十 $= ${p * 10}$。`),
        `$${p * 10} + ${s} = ${ans}$`,
      ],
    };
  }),
  T(KAT.OSN, ["Kalimat matematika", "Number sentences", "填空算式"], "sedang", (r, { t }) => {
    const a = r.int(5, 30), c = a + r.int(5, 25);
    return {
      pertanyaan: t(
        `Perhatikan: $${a} + \\square = ${c}$. Bilangan yang tepat untuk mengisi kotak adalah ...`,
        `Look: $${a} + \\square = ${c}$. Which number goes in the box?`,
        `$${a} + \\square = ${c}$，方格裡應該填多少？`,
      ),
      jawaban: c - a,
      salah: [a + c, c - a + 1, c - a - 1],
      visual: { j: "model", total: c, bagian: [{ nilai: a, label: a }, { nilai: c - a, label: "?" }], jawab: c - a },
      pembahasan: [
        t(`Bilangan di kotak adalah ${c} dikurangi ${a}.`, `The number in the box is ${c} minus ${a}.`, `方格裡的數是 ${c} 減 ${a}。`),
        `$${c} - ${a} = ${c - a}$`,
        t(`Cek: $${a} + ${c - a} = ${c}$. Benar.`, `Check: $${a} + ${c - a} = ${c}$. Correct.`, `驗算：$${a} + ${c - a} = ${c}$，正確。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Hari dan waktu", "Days of the week", "星期"], "sedang", (r, { t, hari }) => {
    const i = r.int(0, 6);
    let n = r.int(2, 13);
    if (n === 7) n = 9;
    const ans = hari[(i + n) % 7];
    const sisa = n > 7 ? n - 7 : n;
    const sep = t(", ", ", ", "、");
    const langkah = Array.from({ length: sisa }, (_, k) => hari[(i + k + 1) % 7]).join(sep);
    return {
      pertanyaan: t(`Hari ini hari ${hari[i]}. ${n} hari lagi adalah hari ...`, `Today is ${hari[i]}. What day will it be in ${n} days?`, `今天是${hari[i]}。再過 ${n} 天是星期幾？`),
      jawaban: ans,
      salah: [hari[(i + n + 1) % 7], hari[(i + n + 6) % 7], hari[(i + n + 2) % 7]],
      visual: { j: "kalender", mulai: i, maju: n },
      pembahasan:
        n > 7
          ? [
              t(`7 hari lagi adalah hari ${hari[i]} lagi.`, `In 7 days it is ${hari[i]} again.`, `再過 7 天又是${hari[i]}。`),
              t(`Masih tersisa $${n} - 7 = ${sisa}$ hari. Hitung maju dari ${hari[i]}: ${langkah}.`, `There are $${n} - 7 = ${sisa}$ days left. Count forward from ${hari[i]}: ${langkah}.`, `還剩 $${n} - 7 = ${sisa}$ 天。從${hari[i]}往後數：${langkah}。`),
            ]
          : [t(`Hitung maju ${n} hari dari hari ${hari[i]}: ${langkah}.`, `Count forward ${n} days from ${hari[i]}: ${langkah}.`, `從${hari[i]}往後數 ${n} 天：${langkah}。`)],
    };
  }),
  T(KAT.OSN, ["Soal cerita", "Word problems", "應用題"], "sulit", (r, { t }) => {
    const a = r.int(2, 5), b = r.int(1, 4), ans = 2 * a + 4 * b;
    return {
      pertanyaan: t(
        `Di halaman ada ${a} ekor ayam dan ${b} ekor kucing. Berapa jumlah kaki semua hewan itu?`,
        `In the yard there are ${a} chickens and ${b} cats. How many legs do the animals have altogether?`,
        `院子裡有 ${a} 隻雞和 ${b} 隻貓。這些動物一共有幾隻腳？`,
      ),
      jawaban: ans,
      salah: [a + b, 4 * a + 2 * b, 2 * (a + b), 4 * (a + b)],
      visual: { j: "kelompok", grup: [{ n: a, e: "🐔", isi: 2 }, { n: b, e: "🐱", isi: 4 }], hasil: ans },
      pembahasan: [
        t(`Ayam berkaki 2 dan kucing berkaki 4.`, `A chicken has 2 legs and a cat has 4 legs.`, `雞有 2 隻腳，貓有 4 隻腳。`),
        t(`Kaki ayam: $${a} \\times 2 = ${2 * a}$. Kaki kucing: $${b} \\times 4 = ${4 * b}$.`, `Chicken legs: $${a} \\times 2 = ${2 * a}$. Cat legs: $${b} \\times 4 = ${4 * b}$.`, `雞腳：$${a} \\times 2 = ${2 * a}$。貓腳：$${b} \\times 4 = ${4 * b}$。`),
        t(`Jumlah kaki: $${2 * a} + ${4 * b} = ${ans}$.`, `Total legs: $${2 * a} + ${4 * b} = ${ans}$.`, `腳的總數：$${2 * a} + ${4 * b} = ${ans}$。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Urutan dan posisi", "Order and position", "排隊問題"], "sulit", (r, { t, ke }) => {
    const n = r.pick(NAMA), a = r.int(3, 9), b = r.int(2, 8);
    return {
      pertanyaan: t(
        `${n} berdiri di barisan pada urutan ke-${a} dari depan. Di belakang ${n} masih ada ${b} anak. Berapa banyak anak dalam barisan itu?`,
        `${n} is ${ke(a)} in line from the front. There are ${b} more children behind ${n}. How many children are in the line?`,
        `${n} 排在隊伍從前面數來第 ${a} 個，${n} 後面還有 ${b} 個小朋友。這一排共有幾個小朋友？`,
      ),
      jawaban: a + b,
      salah: [a + b - 1, a + b + 1, b],
      visual: { j: "antrian", total: a + b, posisi: a },
      pembahasan: [
        t(`Urutan ke-${a} dari depan berarti ada ${a} anak dari depan sampai ${n} (termasuk ${n}).`, `Being number ${a} from the front means there are ${a} children up to and including ${n}.`, `從前面數第 ${a} 個，表示從第一個到 ${n}（包括 ${n}）共有 ${a} 個人。`),
        t(`Ditambah ${b} anak di belakangnya: $${a} + ${b} = ${a + b}$.`, `Add the ${b} children behind: $${a} + ${b} = ${a + b}$.`, `再加上後面的 ${b} 個人：$${a} + ${b} = ${a + b}$。`),
      ],
    };
  }),
  T(KAT.OSN, ["Urutan dan posisi", "Order and position", "排隊問題"], "sulit", (r, { t, ke }) => {
    const nm = r.pick(NAMA), n = r.int(8, 15), a = r.int(2, n - 2), ans = n - a + 1;
    return {
      pertanyaan: t(
        `Ada ${n} anak berbaris. ${nm} berada di urutan ke-${a} dari depan. ${nm} berada di urutan ke berapa dari belakang?`,
        `${n} children stand in a line. ${nm} is ${ke(a)} from the front. What position is ${nm} from the back?`,
        `有 ${n} 個小朋友排成一排。${nm} 從前面數是第 ${a} 個，從後面數是第幾個？`,
      ),
      jawaban: ke(ans),
      salah: [ke(n - a), ke(n - a + 2), ke(a), ke(n - a - 1)],
      visual: { j: "antrian", total: n, posisi: a, belakang: true },
      pembahasan: [
        t(`Di depan ${nm} ada ${a - 1} anak.`, `There are ${a - 1} children in front of ${nm}.`, `${nm} 前面有 ${a - 1} 個人。`),
        t(`Dari ${nm} sampai paling belakang: $${n} - ${a - 1} = ${ans}$ anak.`, `From ${nm} to the very back: $${n} - ${a - 1} = ${ans}$ children.`, `從 ${nm} 到最後一個：$${n} - ${a - 1} = ${ans}$ 個人。`),
        t(`Maka ${nm} berada di urutan ke-${ans} dari belakang.`, `So ${nm} is ${ke(ans)} from the back.`, `所以 ${nm} 從後面數是第 ${ans} 個。`),
      ],
    };
  }),
  T(KAT.KSM, ["Jam", "Telling time", "時間"], "sedang", (r, { t, pukul }) => {
    const h = r.int(1, 12), d = r.int(2, 6), x = ((h + d - 1) % 12) + 1;
    const f = (v) => pukul(((v - 1 + 12) % 12) + 1, 0);
    return {
      pertanyaan: t(`Sekarang ${pukul(h, 0)}. ${d} jam lagi pukul berapa?`, `It is ${pukul(h, 0)} now. What time will it be in ${d} hours?`, `現在是 ${pukul(h, 0)}。再過 ${d} 小時是幾點？`),
      jawaban: f(x),
      salah: [f(x + 1), f(x - 1), f(h - d)],
      visual: { j: "jam", waktu: [[h, 0], [x, 0]], tanya: 1, durasi: d * 60 },
      pembahasan:
        h + d > 12
          ? [
              t(`Hitung maju ${d} jam: $${h} + ${d} = ${h + d}$.`, `Count forward ${d} hours: $${h} + ${d} = ${h + d}$.`, `往後數 ${d} 小時：$${h} + ${d} = ${h + d}$。`),
              t(`Pada jam dinding, setelah angka 12 kembali ke angka 1, jadi $${h + d} - 12 = ${x}$.`, `On a clock, after 12 we go back to 1, so $${h + d} - 12 = ${x}$.`, `時鐘過了 12 又從 1 開始，所以 $${h + d} - 12 = ${x}$。`),
            ]
          : [t(`Hitung maju ${d} jam dari pukul ${h}: $${h} + ${d} = ${x}$.`, `Count forward ${d} hours from ${h} o'clock: $${h} + ${d} = ${x}$.`, `從 ${h} 點往後數 ${d} 小時：$${h} + ${d} = ${x}$。`)],
    };
  }),
  T(KAT.KSM, ["Uang", "Money", "錢"], "mudah", (r, { t, rp, fmt }) => {
    const a = r.int(1, 5) * 1000, b = r.int(2, 9) * 1000;
    return {
      pertanyaan: t(
        `Harga sebuah pensil ${rp(a)} dan harga sebuah buku tulis ${rp(b)}. Berapa harga keduanya?`,
        `A pencil costs ${rp(a)} and a notebook costs ${rp(b)}. How much do they cost together?`,
        `一枝鉛筆 ${rp(a)}，一本筆記本 ${rp(b)}。兩樣一共多少錢？`,
      ),
      prefix: "Rp",
      langkah: 1000,
      jawaban: a + b,
      salah: [a + b - 1000, a + b + 1000, Math.abs(b - a)],
      visual: { j: "model", total: "?", bagian: [{ nilai: a, label: fmt(a) }, { nilai: b, label: fmt(b) }], jawab: fmt(a + b) },
      pembahasan: [t(`Harga keduanya dijumlahkan.`, `Add the two prices.`, `把兩個價錢加起來。`), `$${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}$`],
    };
  }),
  T(KAT.SEAMO, ["Bilangan ganjil dan genap", "Odd and even numbers", "奇數與偶數"], "sedang", (r, { t }) => {
    const genap = r.next() < 0.5, n = r.int(10, 20);
    const list = [];
    for (let i = 1; i <= n; i++) if ((i % 2 === 0) === genap) list.push(i);
    const jenis = t(genap ? "genap" : "ganjil", genap ? "even" : "odd", genap ? "偶數" : "奇數");
    return {
      pertanyaan: t(`Berapa banyak bilangan ${jenis} dari 1 sampai ${n}?`, `How many ${jenis} numbers are there from 1 to ${n}?`, `從 1 到 ${n}，一共有幾個${jenis}？`),
      jawaban: list.length,
      salah: [list.length + 1, list.length - 1, n],
      visual: { j: "grid", dari: 1, sampai: n, sorot: list },
      pembahasan: [
        t(`Tuliskan bilangan ${jenis} dari 1 sampai ${n}: ${list.join(", ")}.`, `List the ${jenis} numbers from 1 to ${n}: ${list.join(", ")}.`, `寫出 1 到 ${n} 的${jenis}：${list.join("、")}。`),
        t(`Hitung banyaknya: ada ${list.length} bilangan.`, `Count them: there are ${list.length} numbers.`, `數一數，共有 ${list.length} 個。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Pengurangan", "Subtraction", "減法"], "mudah", (r, { t }) => {
    const a = r.int(8, 15), b = r.int(2, a - 2);
    return {
      pertanyaan: t(
        `Umur kakak ${a} tahun. Umur adik ${b} tahun. Berapa tahun selisih umur mereka?`,
        `Big sister is ${a} years old. Little brother is ${b} years old. What is the difference in their ages?`,
        `姊姊 ${a} 歲，弟弟 ${b} 歲。他們相差幾歲？`,
      ),
      jawaban: a - b,
      satuan: t("tahun", "years", "歲"),
      salah: [a + b, a - b + 1, a - b - 1],
      visual: { j: "banding", baris: [{ label: t("Kakak", "Sister", "姊姊"), nilai: a }, { label: t("Adik", "Brother", "弟弟"), nilai: b }], selisih: "?", jawab: a - b },
      pembahasan: [t(`Selisih berarti dikurangi: yang besar dikurangi yang kecil.`, `Difference means subtract: the bigger number minus the smaller one.`, `相差就是用大的數減小的數。`), `$${a} - ${b} = ${a - b}$`],
    };
  }),
  T(KAT.KOSSMI, ["Penjumlahan", "Addition", "加法"], "mudah", (r, { t }) => {
    const a = r.int(2, 15), b = r.int(2, 15), c = r.int(2, 15), s = a + b + c;
    return {
      tingkat: s <= 20 ? "mudah" : "sedang",
      pertanyaan: t(`Hasil dari $${a} + ${b} + ${c}$ adalah ...`, `What is $${a} + ${b} + ${c}$?`, `$${a} + ${b} + ${c} = ?$`),
      jawaban: s,
      salah: [s + 1, s - 1, a + b, s + 10],
      visual: { j: "hitung", grup: [{ n: a, e: "🔵" }, { n: b, e: "🟠" }, { n: c, e: "🟢" }], op: "+", hasil: s },
      pembahasan: [
        t(`Jumlahkan dua bilangan pertama: $${a} + ${b} = ${a + b}$.`, `Add the first two numbers: $${a} + ${b} = ${a + b}$.`, `先算前兩個數：$${a} + ${b} = ${a + b}$。`),
        t(`Tambahkan ${c}: $${a + b} + ${c} = ${s}$.`, `Then add ${c}: $${a + b} + ${c} = ${s}$.`, `再加 ${c}：$${a + b} + ${c} = ${s}$。`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Pengelompokan", "Grouping", "分組"], "sulit", (r, { t }) => {
    const per = r.pick([2, 3, 4, 5]), k = r.int(2, 5), total = per * k;
    const chain = Array.from({ length: k + 1 }, (_, i) => total - i * per);
    return {
      pertanyaan: t(
        `Ada ${total} kue. Kue itu dimasukkan ke dalam kotak. Setiap kotak berisi ${per} kue. Berapa kotak yang diperlukan?`,
        `There are ${total} cookies. They are put into boxes with ${per} cookies in each box. How many boxes are needed?`,
        `有 ${total} 片餅乾，每盒裝 ${per} 片。需要幾個盒子？`,
      ),
      jawaban: k,
      satuan: t("kotak", "boxes", "盒"),
      salah: [k + 1, k - 1, per, total - per],
      visual: { j: "kelompok", grup: [{ n: k, e: "📦", isi: per, titik: "🍪" }], sembunyi: true, hasil: k },
      pembahasan: [
        t(`Ambil ${per} kue setiap kali sampai habis: $${chain.join(" \\to ")}$.`, `Take ${per} cookies at a time until none are left: $${chain.join(" \\to ")}$.`, `每次拿走 ${per} 片，直到拿完：$${chain.join(" \\to ")}$。`),
        t(`Kita mengambil ${k} kali, jadi diperlukan ${k} kotak.`, `We took ${k} times, so we need ${k} boxes.`, `一共拿了 ${k} 次，所以需要 ${k} 個盒子。`),
      ],
    };
  }),
  T(KAT.OSN, ["Menyusun bilangan", "Making numbers", "組數"], "sedang", (r, { t }) => {
    const a = r.int(1, 9);
    let b = r.int(1, 9);
    if (a === b) b = (a % 9) + 1;
    const mx = Math.max(a, b), mn = Math.min(a, b);
    const besar = r.next() < 0.5;
    const ans = besar ? mx * 10 + mn : mn * 10 + mx;
    const n = r.pick(NAMA);
    return {
      pertanyaan: t(
        `${n} punya dua kartu angka: ${a} dan ${b}. Bilangan dua angka ${besar ? "terbesar" : "terkecil"} yang dapat disusun dari kedua kartu itu adalah ...`,
        `${n} has two digit cards: ${a} and ${b}. What is the ${besar ? "largest" : "smallest"} two-digit number that can be made with both cards?`,
        `${n} 有兩張數字卡：${a} 和 ${b}。用這兩張卡能排出的${besar ? "最大" : "最小"}二位數是多少？`,
      ),
      jawaban: ans,
      salah: [besar ? mn * 10 + mx : mx * 10 + mn, a + b, besar ? mx * 11 : mn * 11],
      visual: { j: "kartu", angka: [a, b], jawab: ans },
      pembahasan: besar
        ? [
            t(`Agar bilangannya terbesar, angka yang lebih besar (${mx}) diletakkan di tempat puluhan.`, `To make the largest number, put the bigger digit (${mx}) in the tens place.`, `要最大，就把較大的數字 ${mx} 放在十位。`),
            t(`Angka ${mn} di tempat satuan, sehingga bilangannya ${ans}.`, `Put ${mn} in the ones place, so the number is ${ans}.`, `${mn} 放在個位，所以這個數是 ${ans}。`),
          ]
        : [
            t(`Agar bilangannya terkecil, angka yang lebih kecil (${mn}) diletakkan di tempat puluhan.`, `To make the smallest number, put the smaller digit (${mn}) in the tens place.`, `要最小，就把較小的數字 ${mn} 放在十位。`),
            t(`Angka ${mx} di tempat satuan, sehingga bilangannya ${ans}.`, `Put ${mx} in the ones place, so the number is ${ans}.`, `${mx} 放在個位，所以這個數是 ${ans}。`),
          ],
    };
  }),
  T(KAT.KOSSMI, ["Soal cerita", "Word problems", "應用題"], "sedang", (r, { t }) => {
    const n = r.pick(NAMA), a = r.int(5, 12), b = r.int(2, a - 1), c = r.int(2, 8), ans = a - b + c;
    return {
      pertanyaan: t(
        `${n} berdiri di lantai, lalu naik ${a} anak tangga, turun ${b} anak tangga, kemudian naik lagi ${c} anak tangga. Sekarang ${n} berada di anak tangga ke berapa?`,
        `${n} stands on the floor, walks up ${a} steps, down ${b} steps, then up ${c} more steps. Which step is ${n} on now?`,
        `${n} 站在地面上，先往上走 ${a} 階，再往下走 ${b} 階，然後又往上走 ${c} 階。${n} 現在在第幾階？`,
      ),
      jawaban: ans,
      salah: [a + b + c, a - b, a + c],
      visual: { j: "garis", min: 0, max: Math.max(a, ans) + 1, mulai: 0, lompat: [{ ke: a, label: `+${a}` }, { ke: a - b, label: `−${b}` }, { ke: ans, label: `+${c}` }], tanya: ans, tanyaNanti: true },
      pembahasan: [
        t(`Naik berarti ditambah, turun berarti dikurangi.`, `Going up means add, going down means subtract.`, `往上用加法，往下用減法。`),
        `$${a} - ${b} = ${a - b}$, $${a - b} + ${c} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KMNR, ["Bilangan", "Numbers", "數的認識"], "mudah", (r, { t }) => {
    const n = r.int(20, 99), jenis = r.int(0, 2);
    const ans = [n - 1, n + 1, n + 10][jenis];
    return {
      pertanyaan: [
        t(`Bilangan yang tepat sebelum ${n} adalah ...`, `Which number comes just before ${n}?`, `${n} 的前一個數是多少？`),
        t(`Bilangan yang tepat sesudah ${n} adalah ...`, `Which number comes just after ${n}?`, `${n} 的後一個數是多少？`),
        t(`Bilangan yang 10 lebih banyak dari ${n} adalah ...`, `What number is 10 more than ${n}?`, `比 ${n} 多 10 的數是多少？`),
      ][jenis],
      jawaban: ans,
      salah: [n - 1, n + 1, n + 10, n - 10, n],
      visual: { j: "garis", min: n - 2, max: n + 11, titik: [n], tanya: ans, tanyaNanti: true },
      pembahasan: [
        [
          t(`Bilangan tepat sebelum berarti dikurangi 1: $${n} - 1 = ${ans}$.`, `Just before means subtract 1: $${n} - 1 = ${ans}$.`, `前一個數就是減 1：$${n} - 1 = ${ans}$。`),
          t(`Bilangan tepat sesudah berarti ditambah 1: $${n} + 1 = ${ans}$.`, `Just after means add 1: $${n} + 1 = ${ans}$.`, `後一個數就是加 1：$${n} + 1 = ${ans}$。`),
          t(`10 lebih banyak berarti ditambah 10: $${n} + 10 = ${ans}$.`, `10 more means add 10: $${n} + 10 = ${ans}$.`, `多 10 就是加 10：$${n} + 10 = ${ans}$。`),
        ][jenis],
      ],
    };
  }),
  T(KAT.SEAMO, ["Setengah", "Halves", "一半"], "sedang", (r, { t }) => {
    const n = 2 * r.int(2, 10);
    return {
      pertanyaan: t(
        `Ibu membeli ${n} buah jeruk. Setengahnya diberikan kepada nenek. Berapa jeruk yang diberikan kepada nenek?`,
        `Mom buys ${n} oranges. She gives half of them to Grandma. How many oranges does Grandma get?`,
        `媽媽買了 ${n} 個橘子，把一半送給奶奶。奶奶得到幾個橘子？`,
      ),
      jawaban: n / 2,
      satuan: t("buah", "oranges", "個"),
      salah: [n * 2, n / 2 + 1, n - 2],
      visual: { j: "kelompok", grup: [{ n: 2, e: "🧺", isi: n / 2, titik: "🍊" }], hasil: n / 2 },
      pembahasan: [
        t(`Setengah berarti dibagi menjadi 2 bagian yang sama banyak.`, `Half means splitting into 2 equal parts.`, `一半就是平分成 2 份。`),
        t(`Setengah dari ${n} adalah ${n / 2}, karena $${n / 2} + ${n / 2} = ${n}$.`, `Half of ${n} is ${n / 2}, because $${n / 2} + ${n / 2} = ${n}$.`, `${n} 的一半是 ${n / 2}，因為 $${n / 2} + ${n / 2} = ${n}$。`),
      ],
    };
  }),
  T(KAT.KSM, ["Pola bilangan", "Number patterns", "數字規律"], "mudah", (r, { t }) => {
    const s = r.pick([2, 3, 5]), a = r.int(25, 45);
    const seq = [0, 1, 2, 3].map((i) => a - i * s), ans = a - 4 * s;
    return {
      pertanyaan: t(
        `Lanjutkan pola mundur berikut: ${seq.join(", ")}, ... Bilangan berikutnya adalah ...`,
        `Continue the counting-down pattern: ${seq.join(", ")}, ... What is the next number?`,
        `倒數的規律：${seq.join("、")}、……下一個數是多少？`,
      ),
      jawaban: ans,
      salah: [ans - s, ans + 1, ans - 1, seq[3] + s],
      visual: { j: "pola", suku: seq, beda: `−${s}`, jawab: ans },
      pembahasan: [
        t(`Setiap langkah bilangannya berkurang ${s} (contoh: $${seq[0]} - ${seq[1]} = ${s}$).`, `Each step takes away ${s} (for example $${seq[0]} - ${seq[1]} = ${s}$).`, `每一步都減 ${s}（例如 $${seq[0]} - ${seq[1]} = ${s}$）。`),
        t(`Bilangan berikutnya: $${seq[3]} - ${s} = ${ans}$.`, `Next number: $${seq[3]} - ${s} = ${ans}$.`, `下一個數：$${seq[3]} - ${s} = ${ans}$。`),
      ],
    };
  }),
];
