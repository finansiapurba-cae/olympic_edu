// Bot Threads Olympic Edu: "Soal Hari Ini" setiap pagi, jawaban keesokan harinya, dan balasan otomatis untuk komentar.
import { polos, angkaDari } from "./teks.mjs";
import { soalUntuk, pilihanPolos } from "./soal.mjs";
import { buatThreads } from "./threads.mjs";

const SITUS = "olympicedu.netlify.app";
const BATAS = 500; // panjang maksimum satu post Threads
const HURUF = ["A", "B", "C", "D"];
const potong = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…");

/** Tanggal hari ini menurut WIB (UTC+7). */
export const tanggalWIB = (d = new Date()) => new Date(d.getTime() + 7 * 3_600_000).toISOString().slice(0, 10);

export function teksSoal(s) {
  const p = pilihanPolos(s);
  const isi = `🐝 Soal Hari Ini · Kelas ${s.kelas} SD\n\n${polos(s.teks.id.pertanyaan)}\n\n${HURUF.map((h) => `${h}. ${p[h]}`).join("\n")}`;
  const ajakan = "\n\nTulis jawabanmu (A, B, C, atau D) di balasan! Pembahasannya besok pagi jam 07.00.";
  const tagar = "\n\n#OlympicEdu #OlimpiadeMatematika #SoalOSN";
  return (isi + ajakan + tagar).length <= BATAS ? isi + ajakan + tagar : potong(isi + ajakan, BATAS);
}

export function teksJawaban(s) {
  const p = pilihanPolos(s);
  const kepala = `✅ Jawaban: ${s.kunci}. ${p[s.kunci]}\n\nPembahasan:\n`;
  const kaki = `\n\nLatihan ratusan soal lain (gratis dicoba): ${SITUS}`;
  // Langkah terakhir pembahasan hanya mengulang jawaban ("Jadi, jawabannya ..."), jadi dilewati.
  const langkah = s.teks.id.pembahasan.slice(0, -1).map((l, i) => `${i + 1}. ${polos(l)}`).join("\n");
  return kepala + potong(langkah, BATAS - kepala.length - kaki.length) + kaki;
}

/** Membaca huruf jawaban (A–D) dari komentar, atau null bila tidak jelas. */
export function bacaJawaban(teks, pilihan) {
  const t = String(teks).replace(/@\w[\w.]*/g, " ").trim();
  let m = t.match(/^\(?\s*([A-Da-d])\s*[).:!]*\s*$/);
  if (m) return m[1].toUpperCase();
  m = t.match(/\b(?:jawab(?:an)?(?:nya|ku)?|jwb|answer)\s*[:=]?\s*\(?([A-Da-d])\b/i);
  if (m) return m[1].toUpperCase();
  m = t.match(/^\(?([A-D])[).:]\s/);
  if (m) return m[1];
  const besar = [...new Set([...t.matchAll(/(?:^|\s)([A-D])(?=$|[\s.,!?;)])/g)].map((x) => x[1]))];
  if (besar.length === 1) return besar[0];
  // Menulis nilai jawaban, misalnya "6000" atau "Rp6.000".
  const angkaKomentar = new Set(angkaDari(t));
  const cocokAngka = HURUF.filter((h) => {
    const a = angkaDari(pilihan[h]);
    return a.length > 0 && a.every((x) => angkaKomentar.has(x));
  });
  if (cocokAngka.length === 1) return cocokAngka[0];
  const kecil = t.toLowerCase();
  const cocokKata = HURUF.filter((h) => !/\d/.test(pilihan[h]) && pilihan[h].length >= 3 && kecil.includes(pilihan[h].toLowerCase()));
  return cocokKata.length === 1 ? cocokKata[0] : null;
}

export function teksBalasan(post, s, nama, huruf) {
  const p = pilihanPolos(s);
  if (huruf === s.kunci) {
    return `Benar, @${nama}! 🎉 Hebat.${post.dijawab ? " Pembahasannya ada di balasan paling atas." : " Pembahasan lengkap besok pagi jam 07.00."} Latihan soal lain: ${SITUS}`;
  }
  if (post.dijawab) return `Hampir, @${nama}! 😊 Jawaban yang benar ${s.kunci}. ${p[s.kunci]}. Lihat pembahasannya di balasan paling atas, lalu coba soal hari ini ya!`;
  // Petunjuk dari langkah pertama, asal tidak membocorkan jawaban.
  const langkah1 = polos(s.teks.id.pembahasan[0] ?? "");
  const bocor = angkaDari(p[s.kunci]).some((a) => angkaDari(langkah1).includes(a)) || langkah1.toLowerCase().includes(p[s.kunci].toLowerCase());
  const petunjuk = !langkah1 || bocor ? "kerjakan langkah demi langkah, dan coba gambar soalnya dulu." : potong(langkah1, 180);
  return `Hampir, @${nama}! 😊 Coba cek lagi ya. Petunjuk: ${petunjuk}`;
}

const KUNCI = "status";
const STATUS_AWAL = { posts: [], terakhirHarian: null, token: null, tokenDiperbarui: null, userId: null, username: null };

/** deps: store (Netlify Blobs), env, fetchFn, sekarang () => Date. */
export function buatBot({ store, env = process.env, fetchFn = fetch, sekarang = () => new Date(), tunggu }) {
  let status = null;
  const muat = async () => (status ??= { ...STATUS_AWAL, ...((await store.get(KUNCI, { type: "json" })) ?? {}) });
  const simpan = () => store.setJSON(KUNCI, status);
  const api = buatThreads(async () => (await muat()).token ?? env.THREADS_ACCESS_TOKEN, { fetchFn, tunggu });

  async function siapkan() {
    await muat();
    if (!status.token && !env.THREADS_ACCESS_TOKEN) throw new Error("THREADS_ACCESS_TOKEN belum diisi di Netlify");
    if (!status.userId) {
      const saya = await api.saya();
      Object.assign(status, { userId: saya.id, username: saya.username });
      await simpan();
    }
    // Perpanjang token sekitar sebulan sekali (token berlaku 60 hari).
    const umur = status.tokenDiperbarui ? sekarang() - new Date(status.tokenDiperbarui) : Infinity;
    if (umur > 25 * 86_400_000) {
      try {
        const baru = await api.perpanjangToken();
        Object.assign(status, { token: baru.access_token, tokenDiperbarui: sekarang().toISOString() });
        await simpan();
      } catch (e) {
        console.warn("Token belum bisa diperpanjang:", e.message);
      }
    }
  }

  return {
    status: async () => (await muat(), status),

    /** Dijalankan setiap pagi: jawab soal kemarin, lalu terbitkan soal hari ini. */
    async harian() {
      await siapkan();
      const hari = tanggalWIB(sekarang());
      if (status.terakhirHarian === hari) return { lewati: `sudah posting untuk ${hari}` };
      const hasil = {};
      for (const post of status.posts.filter((p) => !p.dijawab)) {
        const s = soalUntuk(post.tanggal);
        await api.posting(status.userId, teksJawaban(s), post.mediaId);
        post.dijawab = true;
        hasil.jawaban = (hasil.jawaban ?? 0) + 1;
        await simpan();
      }
      const s = soalUntuk(hari);
      const mediaId = await api.posting(status.userId, teksSoal(s));
      status.posts = [{ tanggal: hari, mediaId, soalId: s.id, dijawab: false, ditangani: [] }, ...status.posts].slice(0, 3);
      status.terakhirHarian = hari;
      await simpan();
      return { ...hasil, soal: s.id, mediaId };
    },

    /** Dijalankan tiap 15 menit: balas komentar baru pada dua post soal terakhir. */
    async balas({ maks = 12, batasWaktu = 20_000 } = {}) {
      await siapkan();
      const mulai = Date.now();
      let dibalas = 0;
      for (const post of status.posts.slice(0, 2)) {
        const s = soalUntuk(post.tanggal);
        const pilihan = pilihanPolos(s);
        const daftar = await api.balasan(post.mediaId);
        for (const k of daftar) {
          if (dibalas >= maks || Date.now() - mulai > batasWaktu) return { dibalas, berhenti: true };
          if (k.is_reply_owned_by_me || k.username === status.username || post.ditangani.includes(k.id)) continue;
          post.ditangani = [...post.ditangani, k.id].slice(-500);
          const huruf = bacaJawaban(k.text ?? "", pilihan);
          if (huruf) {
            await api.posting(status.userId, teksBalasan(post, s, k.username, huruf), k.id);
            dibalas++;
          }
          await simpan();
        }
      }
      return { dibalas };
    },

    kuota: async () => (await siapkan(), api.kuota(status.userId)),
  };
}
