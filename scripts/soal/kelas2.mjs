import { T, KAT, NAMA } from "./lib.mjs";

const ALAT = [
  ["pensil", "pencils", "枝", "鉛筆"],
  ["spidol", "markers", "枝", "彩色筆"],
  ["krayon", "crayons", "枝", "蠟筆"],
  ["penghapus", "erasers", "個", "橡皮擦"],
];

export default [
  T(KAT.KMNR, ["Perkalian", "Multiplication", "乘法"], "mudah", (r, { t }) => {
    const k = r.int(3, 9), b = r.int(3, 9), [ai, ae, ac, az] = r.pick(ALAT);
    return {
      pertanyaan: t(
        `Ada ${k} kotak. Setiap kotak berisi ${b} ${ai}. Berapa banyak ${ai} seluruhnya?`,
        `There are ${k} boxes. Each box holds ${b} ${ae}. How many ${ae} are there in all?`,
        `有 ${k} 個盒子，每盒有 ${b} ${ac}${az}。一共有幾${ac}${az}？`,
      ),
      jawaban: k * b,
      salah: [k + b, k * b + k, k * b - b],
      pembahasan: [
        t(`Ini sama dengan menjumlahkan ${b} sebanyak ${k} kali.`, `This is the same as adding ${b} a total of ${k} times.`, `這就是把 ${b} 連加 ${k} 次。`),
        `$${k} \\times ${b} = ${k * b}$`,
      ],
    };
  }),
  T(KAT.KMNR, ["Pembagian", "Division", "除法"], "mudah", (r, { t }) => {
    const b = r.int(2, 9), q = r.int(3, 9), total = b * q;
    return {
      pertanyaan: t(
        `${total} apel dibagikan sama banyak kepada ${b} anak. Setiap anak mendapat berapa apel?`,
        `${total} apples are shared equally among ${b} children. How many apples does each child get?`,
        `${total} 個蘋果平分給 ${b} 個小朋友，每人分到幾個？`,
      ),
      jawaban: q,
      satuan: t("apel", "apples", "個"),
      salah: [total - b, q + 1, q - 1, b],
      pembahasan: [
        t(`Dibagi sama banyak berarti pembagian: $${total} : ${b} = ${q}$.`, `Sharing equally means dividing: $${total} \\div ${b} = ${q}$.`, `平分就是用除法：$${total} \\div ${b} = ${q}$。`),
        t(`Cek: $${b} \\times ${q} = ${total}$.`, `Check: $${b} \\times ${q} = ${total}$.`, `驗算：$${b} \\times ${q} = ${total}$。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Nilai tempat", "Place value", "位值"], "sedang", (r, { t }) => {
    const ds = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
    const n = ds[0] * 100 + ds[1] * 10 + ds[2];
    const pos = r.int(0, 2), d = ds[pos], place = [100, 10, 1][pos];
    const nama = t(["ratusan", "puluhan", "satuan"][pos], ["hundreds", "tens", "ones"][pos], ["百位", "十位", "個位"][pos]);
    return {
      pertanyaan: t(`Nilai angka ${d} pada bilangan ${n} adalah ...`, `What is the value of the digit ${d} in the number ${n}?`, `在 ${n} 這個數中，數字 ${d} 代表多少？`),
      jawaban: d * place,
      salah: [d, d * 10, d * 100, n].filter((v) => v !== d * place),
      pembahasan: [
        t(`Pada bilangan ${n}, angka ${d} berada di tempat ${nama}.`, `In ${n}, the digit ${d} is in the ${nama} place.`, `在 ${n} 中，${d} 在${nama}。`),
        t(`Nilainya $${d} \\times ${place} = ${d * place}$.`, `Its value is $${d} \\times ${place} = ${d * place}$.`, `它代表 $${d} \\times ${place} = ${d * place}$。`),
      ],
    };
  }),
  T(KAT.OSN, ["Pola bilangan", "Number patterns", "數字規律"], "sedang", (r, { t }) => {
    const m = r.pick([2, 3]), a = r.int(1, m === 2 ? 6 : 3);
    const seq = [a, a * m, a * m * m, a * m ** 3], ans = a * m ** 4;
    return {
      pertanyaan: t(`Perhatikan pola: ${seq.join(", ")}, ... Bilangan berikutnya adalah ...`, `Look at the pattern: ${seq.join(", ")}, ... What is the next number?`, `觀察規律：${seq.join("、")}、……下一個數是多少？`),
      jawaban: ans,
      salah: [seq[3] + (seq[3] - seq[2]), seq[3] + m, ans + 1],
      pembahasan: [
        `$${seq[1]} = ${seq[0]} \\times ${m}$, $${seq[2]} = ${seq[1]} \\times ${m}$`,
        t(`Setiap bilangan dikali ${m} untuk mendapatkan bilangan berikutnya.`, `Each number is multiplied by ${m} to get the next one.`, `每個數乘以 ${m} 就得到下一個數。`),
        `$${seq[3]} \\times ${m} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KSM, ["Uang", "Money", "錢"], "sedang", (r, { t, rp, fmt }) => {
    const h = r.int(3, 18) * 500, p = h < 10000 ? 10000 : 20000, n = r.pick(NAMA);
    return {
      pertanyaan: t(
        `${n} membeli roti seharga ${rp(h)}. Ia membayar dengan uang ${rp(p)}. Berapa uang kembaliannya?`,
        `${n} buys bread for ${rp(h)} and pays with ${rp(p)}. How much change does ${n} get?`,
        `${n} 買了一個 ${rp(h)} 的麵包，付了 ${rp(p)}。應該找回多少錢？`,
      ),
      prefix: "Rp",
      langkah: 500,
      jawaban: p - h,
      salah: [p - h - 500, p - h + 500, p - h + 1000],
      pembahasan: [
        t(`Kembalian = uang yang dibayarkan − harga roti.`, `Change = money paid − price of the bread.`, `找回的錢 = 付的錢 − 麵包的價錢。`),
        `$${fmt(p)} - ${fmt(h)} = ${fmt(p - h)}$`,
      ],
    };
  }),
  T(KAT.OMNAS, ["Waktu", "Time", "時間"], "sulit", (r, { t, jam }) => {
    const h = r.int(6, 10), mm = r.int(1, 11) * 5;
    const endTotal = r.int(Math.ceil((65 - mm) / 5), Math.floor((115 - mm) / 5)) * 5 + mm;
    const dur = endTotal - mm, em = endTotal - 60;
    const salahDesimal = (h + 1) * 100 + em - (h * 100 + mm);
    return {
      pertanyaan: t(
        `Les menggambar dimulai pukul ${jam(h, mm)} dan selesai pukul ${jam(h + 1, em)}. Berapa menit lamanya les itu?`,
        `A drawing class starts at ${jam(h, mm)} and ends at ${jam(h + 1, em)}. How many minutes long is the class?`,
        `美術課 ${jam(h, mm)} 開始，${jam(h + 1, em)} 結束。這堂課上了幾分鐘？`,
      ),
      jawaban: dur,
      satuan: t("menit", "minutes", "分鐘"),
      langkah: 5,
      salah: [salahDesimal, dur - 5, dur + 10],
      pembahasan: [
        t(`Dari pukul ${jam(h, mm)} sampai pukul ${jam(h + 1, 0)} ada $60 - ${mm} = ${60 - mm}$ menit.`, `From ${jam(h, mm)} to ${jam(h + 1, 0)} is $60 - ${mm} = ${60 - mm}$ minutes.`, `從 ${jam(h, mm)} 到 ${jam(h + 1, 0)} 是 $60 - ${mm} = ${60 - mm}$ 分鐘。`),
        t(`Dari pukul ${jam(h + 1, 0)} sampai pukul ${jam(h + 1, em)} ada ${em} menit.`, `From ${jam(h + 1, 0)} to ${jam(h + 1, em)} is ${em} minutes.`, `從 ${jam(h + 1, 0)} 到 ${jam(h + 1, em)} 是 ${em} 分鐘。`),
        t(`Jumlahkan: $${60 - mm} + ${em} = ${dur}$ menit.`, `Add them: $${60 - mm} + ${em} = ${dur}$ minutes.`, `加起來：$${60 - mm} + ${em} = ${dur}$ 分鐘。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Satuan panjang", "Units of length", "長度單位"], "sedang", (r, { t }) => {
    const m = r.int(1, 9), c = r.int(5, 95);
    return {
      pertanyaan: t(`${m} meter ${c} cm sama dengan ... cm.`, `${m} m ${c} cm is equal to how many cm?`, `${m} 公尺 ${c} 公分等於幾公分？`),
      jawaban: 100 * m + c,
      satuan: "cm",
      salah: [m + c, 10 * m + c, 1000 * m + c],
      pembahasan: [
        t(`1 meter = 100 cm, jadi ${m} meter $= ${m} \\times 100 = ${m * 100}$ cm.`, `1 m = 100 cm, so ${m} m $= ${m} \\times 100 = ${m * 100}$ cm.`, `1 公尺 = 100 公分，所以 ${m} 公尺 $= ${m} \\times 100 = ${m * 100}$ 公分。`),
        `$${m * 100} + ${c} = ${100 * m + c}$ cm`,
      ],
    };
  }),
  T(KAT.OSN, ["Soal cerita", "Word problems", "應用題"], "sulit", (r, { t }) => {
    const g = r.int(2, 8), a = r.int(2, 8), h = a + g, k = 2 * a + 4 * g;
    return {
      pertanyaan: t(
        `Di kandang ada ayam dan kambing. Jumlah kepalanya ${h} dan jumlah kakinya ${k}. Berapa ekor kambing di kandang itu?`,
        `A pen has chickens and goats. There are ${h} heads and ${k} legs. How many goats are there?`,
        `籠子裡有雞和羊，一共有 ${h} 個頭、${k} 隻腳。羊有幾隻？`,
      ),
      jawaban: g,
      satuan: t("ekor", "goats", "隻"),
      salah: [a, h, g + 1, g - 1],
      pembahasan: [
        t(`Misalkan semua hewan adalah ayam (berkaki 2). Jumlah kakinya $${h} \\times 2 = ${2 * h}$.`, `Pretend all the animals are chickens (2 legs). That gives $${h} \\times 2 = ${2 * h}$ legs.`, `假設全部都是雞（2 隻腳），腳有 $${h} \\times 2 = ${2 * h}$ 隻。`),
        t(`Kaki yang masih kurang: $${k} - ${2 * h} = ${2 * g}$.`, `Legs still missing: $${k} - ${2 * h} = ${2 * g}$.`, `還少了 $${k} - ${2 * h} = ${2 * g}$ 隻腳。`),
        t(`Setiap kambing punya 2 kaki lebih banyak daripada ayam, jadi banyak kambing $${2 * g} : 2 = ${g}$.`, `Each goat has 2 more legs than a chicken, so there are $${2 * g} \\div 2 = ${g}$ goats.`, `每隻羊比雞多 2 隻腳，所以羊有 $${2 * g} \\div 2 = ${g}$ 隻。`),
        t(`Cek: ${a} ayam dan ${g} kambing, kaki $= ${2 * a} + ${4 * g} = ${k}$.`, `Check: ${a} chickens and ${g} goats have $${2 * a} + ${4 * g} = ${k}$ legs.`, `驗算：${a} 隻雞和 ${g} 隻羊，腳有 $${2 * a} + ${4 * g} = ${k}$ 隻。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Menyusun bilangan", "Making numbers", "組數"], "sedang", (r, { t }) => {
    const ds = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
    const desc = [...ds].sort((p, q) => q - p), asc = [...ds].sort((p, q) => p - q);
    const besar = r.next() < 0.5;
    const num = (arr) => arr[0] * 100 + arr[1] * 10 + arr[2];
    const ans = besar ? num(desc) : num(asc);
    return {
      pertanyaan: t(
        `Dengan kartu angka ${ds.join(", ")} (setiap kartu dipakai sekali), bilangan tiga angka ${besar ? "terbesar" : "terkecil"} yang dapat dibuat adalah ...`,
        `Using the digit cards ${ds.join(", ")} (each card once), what is the ${besar ? "largest" : "smallest"} three-digit number you can make?`,
        `用數字卡 ${ds.join("、")}（每張只用一次），能排出的${besar ? "最大" : "最小"}三位數是多少？`,
      ),
      jawaban: ans,
      salah: [besar ? num(asc) : num(desc), num(ds), besar ? num([desc[0], desc[2], desc[1]]) : num([asc[0], asc[2], asc[1]])],
      pembahasan: besar
        ? [
            t(`Agar terbesar, letakkan angka terbesar di ratusan, lalu yang berikutnya di puluhan.`, `For the largest number, put the biggest digit in the hundreds place, then the next biggest in the tens place.`, `要最大，把最大的數字放在百位，第二大的放在十位。`),
            t(`Urutan angka dari besar ke kecil: ${desc.join(", ")}, jadi bilangannya ${ans}.`, `Digits from largest to smallest: ${desc.join(", ")}, so the number is ${ans}.`, `數字由大到小：${desc.join("、")}，所以是 ${ans}。`),
          ]
        : [
            t(`Agar terkecil, letakkan angka terkecil di ratusan, lalu yang berikutnya di puluhan.`, `For the smallest number, put the smallest digit in the hundreds place, then the next smallest in the tens place.`, `要最小，把最小的數字放在百位，第二小的放在十位。`),
            t(`Urutan angka dari kecil ke besar: ${asc.join(", ")}, jadi bilangannya ${ans}.`, `Digits from smallest to largest: ${asc.join(", ")}, so the number is ${ans}.`, `數字由小到大：${asc.join("、")}，所以是 ${ans}。`),
          ],
    };
  }),
  T(KAT.OSN, ["Penjumlahan berurutan", "Adding consecutive numbers", "連續數相加"], "sulit", (r, { t }) => {
    const n = r.pick([10, 12, 14, 16, 20]), ans = (n * (n + 1)) / 2;
    return {
      pertanyaan: t(`Hasil dari $1 + 2 + 3 + \\cdots + ${n}$ adalah ...`, `What is $1 + 2 + 3 + \\cdots + ${n}$?`, `$1 + 2 + 3 + \\cdots + ${n} = ?$`),
      jawaban: ans,
      salah: [(n * n) / 2, ans - n, n * (n + 1)],
      pembahasan: [
        t(`Pasangkan bilangan pertama dengan terakhir: $1 + ${n} = ${n + 1}$, $2 + ${n - 1} = ${n + 1}$, dan seterusnya.`, `Pair the first number with the last: $1 + ${n} = ${n + 1}$, $2 + ${n - 1} = ${n + 1}$, and so on.`, `頭尾配對：$1 + ${n} = ${n + 1}$，$2 + ${n - 1} = ${n + 1}$，依此類推。`),
        t(`Ada $${n} : 2 = ${n / 2}$ pasangan, dan setiap pasangan berjumlah ${n + 1}.`, `There are $${n} \\div 2 = ${n / 2}$ pairs, and each pair adds up to ${n + 1}.`, `共有 $${n} \\div 2 = ${n / 2}$ 對，每對的和都是 ${n + 1}。`),
        `$${n / 2} \\times ${n + 1} = ${ans}$`,
      ],
    };
  }),
  T(KAT.KOSSMI, ["Pecahan sederhana", "Simple fractions", "簡單分數"], "sedang", (r, { t }) => {
    const per4 = r.next() < 0.5;
    const n = per4 ? 4 * r.int(2, 10) : 2 * r.int(10, 40);
    const d = per4 ? 4 : 2, ans = n / d;
    const nm = t(per4 ? "Seperempat" : "Setengah", per4 ? "One quarter" : "Half", per4 ? "四分之一" : "一半");
    return {
      pertanyaan: t(`${nm} dari ${n} adalah ...`, `What is ${per4 ? "one quarter" : "half"} of ${n}?`, `${n} 的${nm}是多少？`),
      jawaban: ans,
      salah: [per4 ? n / 2 : n / 4, ans + 2, n - ans, n * d],
      pembahasan: [
        t(`${nm} berarti dibagi menjadi ${d} bagian sama besar.`, `${nm} means dividing into ${d} equal parts.`, `${nm}就是平分成 ${d} 份。`),
        t(`$${n} : ${d} = ${ans}$`, `$${n} \\div ${d} = ${ans}$`, `$${n} \\div ${d} = ${ans}$`),
      ],
    };
  }),
  T(KAT.OMNAS, ["Umur", "Ages", "年齡問題"], "sulit", (r, { t }) => {
    const a = r.int(28, 40), b = r.int(3, 10), tt = r.int(3, 10), n = r.pick(NAMA);
    return {
      pertanyaan: t(
        `Umur ayah ${a} tahun dan umur ${n} ${b} tahun. Berapa selisih umur mereka ${tt} tahun lagi?`,
        `Dad is ${a} years old and ${n} is ${b} years old. What will the difference in their ages be in ${tt} years?`,
        `爸爸 ${a} 歲，${n} ${b} 歲。再過 ${tt} 年，他們相差幾歲？`,
      ),
      jawaban: a - b,
      satuan: t("tahun", "years", "歲"),
      salah: [a - b + tt, a - b - tt, a + b],
      pembahasan: [
        t(`Setiap tahun, umur ayah dan umur ${n} sama-sama bertambah 1 tahun.`, `Every year, both Dad and ${n} get 1 year older.`, `每過一年，爸爸和 ${n} 都各長 1 歲。`),
        t(`Karena itu, selisih umur mereka tidak pernah berubah.`, `So the difference in their ages never changes.`, `所以他們的年齡差永遠不變。`),
        t(`Selisih sekarang: $${a} - ${b} = ${a - b}$ tahun.`, `The difference now: $${a} - ${b} = ${a - b}$ years.`, `現在相差：$${a} - ${b} = ${a - b}$ 歲。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Kalimat matematika", "Number sentences", "填空算式"], "sedang", (r, { t }) => {
    const a = r.int(2, 9), b = r.int(2, 10), c = a * b;
    return {
      pertanyaan: t(
        `Perhatikan: $${a} \\times \\square = ${c}$. Bilangan yang tepat untuk mengisi kotak adalah ...`,
        `Look: $${a} \\times \\square = ${c}$. Which number goes in the box?`,
        `$${a} \\times \\square = ${c}$，方格裡應該填多少？`,
      ),
      jawaban: b,
      salah: [c - a, b + 1, b - 1, a],
      pembahasan: [
        t(`Cari bilangan yang jika dikali ${a} hasilnya ${c}.`, `Find the number that gives ${c} when multiplied by ${a}.`, `找出乘以 ${a} 會等於 ${c} 的數。`),
        t(`$${c} : ${a} = ${b}$, karena $${a} \\times ${b} = ${c}$.`, `$${c} \\div ${a} = ${b}$, because $${a} \\times ${b} = ${c}$.`, `$${c} \\div ${a} = ${b}$，因為 $${a} \\times ${b} = ${c}$。`),
      ],
    };
  }),
  T(KAT.KSM, ["Soal cerita", "Word problems", "應用題"], "sedang", (r, { t }) => {
    const total = r.int(60, 150), d = r.int(5, 12), h = r.int(3, 7), n = r.pick(NAMA);
    if (d * h >= total) return null;
    return {
      pertanyaan: t(
        `Sebuah buku cerita tebalnya ${total} halaman. ${n} membaca ${d} halaman setiap hari. Setelah ${h} hari, berapa halaman yang belum dibaca?`,
        `A storybook has ${total} pages. ${n} reads ${d} pages every day. After ${h} days, how many pages are still unread?`,
        `一本故事書有 ${total} 頁，${n} 每天讀 ${d} 頁。${h} 天後，還有幾頁沒讀？`,
      ),
      jawaban: total - d * h,
      satuan: t("halaman", "pages", "頁"),
      salah: [d * h, total - d, total - d * h - d],
      pembahasan: [
        t(`Halaman yang sudah dibaca: $${d} \\times ${h} = ${d * h}$.`, `Pages already read: $${d} \\times ${h} = ${d * h}$.`, `已經讀了：$${d} \\times ${h} = ${d * h}$ 頁。`),
        t(`Halaman yang belum dibaca: $${total} - ${d * h} = ${total - d * h}$.`, `Pages not read yet: $${total} - ${d * h} = ${total - d * h}$.`, `還沒讀：$${total} - ${d * h} = ${total - d * h}$ 頁。`),
      ],
    };
  }),
  T(KAT.OSN, ["Jarak dan tiang", "Posts and gaps", "植樹問題"], "sulit", (r, { t }) => {
    const d = r.pick([2, 3, 4, 5]), k = r.int(4, 10), L = d * k;
    return {
      pertanyaan: t(
        `Di sepanjang jalan yang panjangnya ${L} meter dipasang tiang bendera setiap ${d} meter, termasuk di kedua ujung jalan. Berapa banyak tiang bendera yang dipasang?`,
        `Along a road ${L} m long, a flagpole is put up every ${d} m, including at both ends. How many flagpoles are there?`,
        `一條長 ${L} 公尺的路，每隔 ${d} 公尺插一根旗桿，兩端都要插。一共要插幾根旗桿？`,
      ),
      jawaban: k + 1,
      satuan: t("tiang", "flagpoles", "根"),
      salah: [k, k + 2, k - 1],
      pembahasan: [
        t(`Jalan dibagi menjadi $${L} : ${d} = ${k}$ jarak (celah).`, `The road is split into $${L} \\div ${d} = ${k}$ gaps.`, `整條路分成 $${L} \\div ${d} = ${k}$ 段間隔。`),
        t(`Tiang selalu 1 lebih banyak daripada celah karena kedua ujung dipasang tiang.`, `There is always 1 more pole than gaps, because both ends have a pole.`, `兩端都插的時候，旗桿數比間隔數多 1。`),
        t(`Banyak tiang $= ${k} + 1 = ${k + 1}$.`, `Number of poles $= ${k} + 1 = ${k + 1}$.`, `旗桿數 $= ${k} + 1 = ${k + 1}$。`),
      ],
    };
  }),
  T(KAT.KMNR, ["Pembulatan", "Rounding", "四捨五入"], "mudah", (r, { t }) => {
    const n = r.int(11, 99);
    if (n % 10 === 0) return null;
    const u = n % 10, fl = n - u, ans = u >= 5 ? fl + 10 : fl;
    return {
      pertanyaan: t(`Bilangan ${n} jika dibulatkan ke puluhan terdekat menjadi ...`, `Round ${n} to the nearest ten.`, `把 ${n} 四捨五入到十位是多少？`),
      jawaban: ans,
      salah: [fl, fl + 10, fl + 20, n],
      pembahasan: [
        t(`Lihat angka satuannya, yaitu ${u}.`, `Look at the ones digit: ${u}.`, `看個位數字：${u}。`),
        u >= 5
          ? t(`Karena ${u} adalah 5 atau lebih, dibulatkan ke atas menjadi ${ans}.`, `Because ${u} is 5 or more, round up to ${ans}.`, `${u} 大於或等於 5，所以進位成 ${ans}。`)
          : t(`Karena ${u} kurang dari 5, dibulatkan ke bawah menjadi ${ans}.`, `Because ${u} is less than 5, round down to ${ans}.`, `${u} 小於 5，所以捨去成 ${ans}。`),
      ],
    };
  }),
  T(KAT.SEAMO, ["Kalender", "Calendar", "日曆"], "sulit", (r, { t, hari }) => {
    const i = r.int(0, 6), n = r.int(8, 30);
    const base = [1, 8, 15, 22, 29].filter((b) => b <= n).pop(), s = n - base;
    const ans = hari[(i + n - 1) % 7];
    return {
      pertanyaan: t(
        `Tanggal 1 bulan ini jatuh pada hari ${hari[i]}. Tanggal ${n} bulan ini jatuh pada hari ...`,
        `Day 1 of this month is a ${hari[i]}. What day of the week is day ${n} of this month?`,
        `這個月的 1 號是${hari[i]}。這個月的 ${n} 號是星期幾？`,
      ),
      jawaban: ans,
      salah: [hari[(i + n) % 7], hari[(i + n - 2 + 7) % 7], hari[(i + n + 1) % 7]],
      pembahasan: [
        t(`Hari yang sama berulang setiap 7 hari, jadi tanggal 1, 8, 15, 22, dan 29 jatuh pada hari ${hari[i]}.`, `The same day repeats every 7 days, so the 1st, 8th, 15th, 22nd and 29th are all ${hari[i]}s.`, `每 7 天重複一次，所以 1、8、15、22、29 號都是${hari[i]}。`),
        s === 0
          ? t(`Tanggal ${n} termasuk di dalamnya, jadi harinya ${hari[i]}.`, `Day ${n} is one of them, so it is a ${hari[i]}.`, `${n} 號就在其中，所以是${hari[i]}。`)
          : t(`Tanggal ${n} adalah ${s} hari setelah tanggal ${base}. Hitung maju ${s} hari dari ${hari[i]}.`, `Day ${n} is ${s} days after day ${base}. Count forward ${s} days from ${hari[i]}.`, `${n} 號是 ${base} 號之後 ${s} 天，從${hari[i]}往後數 ${s} 天。`),
      ],
    };
  }),
  T(KAT.KOSSMI, ["Keliling", "Perimeter", "周長"], "sedang", (r, { t }) => {
    const s = r.int(3, 15);
    return {
      pertanyaan: t(
        `Sebuah taman berbentuk persegi dengan panjang sisi ${s} meter. Berapa meter pagar yang diperlukan untuk mengelilingi taman itu?`,
        `A square garden has sides of ${s} m. How many metres of fence are needed to go all the way around it?`,
        `一個正方形花園的邊長是 ${s} 公尺。圍住花園一圈需要幾公尺的籬笆？`,
      ),
      jawaban: 4 * s,
      satuan: "m",
      salah: [s * s, 2 * s, 3 * s],
      pembahasan: [
        t(`Persegi punya 4 sisi yang sama panjang.`, `A square has 4 sides of equal length.`, `正方形有 4 條一樣長的邊。`),
        t(`Keliling $= 4 \\times ${s} = ${4 * s}$ meter.`, `Perimeter $= 4 \\times ${s} = ${4 * s}$ m.`, `周長 $= 4 \\times ${s} = ${4 * s}$ 公尺。`),
      ],
    };
  }),
  T(KAT.KSM, ["Operasi hitung", "Arithmetic", "四則運算"], "mudah", (r, { t }) => {
    const a = r.int(20, 60), b = r.int(10, 40), c = r.int(5, a + b - 5);
    return {
      pertanyaan: t(`Hasil dari $${a} + ${b} - ${c}$ adalah ...`, `What is $${a} + ${b} - ${c}$?`, `$${a} + ${b} - ${c} = ?$`),
      jawaban: a + b - c,
      salah: [a + b + c, a - b + c, a + b - c + 10],
      pembahasan: [
        t(`Kerjakan dari kiri ke kanan.`, `Work from left to right.`, `由左往右計算。`),
        `$${a} + ${b} = ${a + b}$, $${a + b} - ${c} = ${a + b - c}$`,
      ],
    };
  }),
  T(KAT.OMNAS, ["Soal cerita", "Word problems", "應用題"], "sulit", (r, { t }) => {
    const b = r.int(5, 20), diff = 2 * r.int(2, 10), a = b + diff;
    const [n1, n2] = r.sample(NAMA, 2);
    return {
      pertanyaan: t(
        `${n1} punya ${a} kelereng dan ${n2} punya ${b} kelereng. Berapa kelereng yang harus diberikan ${n1} kepada ${n2} agar kelereng mereka sama banyak?`,
        `${n1} has ${a} marbles and ${n2} has ${b} marbles. How many marbles should ${n1} give ${n2} so they have the same number?`,
        `${n1} 有 ${a} 顆彈珠，${n2} 有 ${b} 顆。${n1} 要給 ${n2} 幾顆，兩人的彈珠才會一樣多？`,
      ),
      jawaban: diff / 2,
      satuan: t("kelereng", "marbles", "顆"),
      salah: [diff, diff / 2 + 1, diff / 2 - 1],
      pembahasan: [
        t(`Selisih kelereng mereka: $${a} - ${b} = ${diff}$.`, `The difference is $${a} - ${b} = ${diff}$ marbles.`, `兩人相差 $${a} - ${b} = ${diff}$ 顆。`),
        t(`Agar sama, selisih itu dibagi dua: $${diff} : 2 = ${diff / 2}$.`, `To make them equal, split the difference in half: $${diff} \\div 2 = ${diff / 2}$.`, `要一樣多，把差平分：$${diff} \\div 2 = ${diff / 2}$。`),
        t(`Cek: ${n1} menjadi ${a - diff / 2} dan ${n2} menjadi ${b + diff / 2}. Sama banyak.`, `Check: ${n1} ends with ${a - diff / 2} and ${n2} with ${b + diff / 2}. Equal.`, `驗算：${n1} 剩 ${a - diff / 2} 顆，${n2} 變成 ${b + diff / 2} 顆，一樣多。`),
      ],
    };
  }),
];
