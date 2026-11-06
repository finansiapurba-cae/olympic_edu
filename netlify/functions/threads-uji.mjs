// Halaman uji untuk pemilik: /.netlify/functions/threads-uji?kunci=...&aksi=contoh|status|kuota|harian|balas
// "contoh" hanya menampilkan teks (tidak memposting); "harian" dan "balas" menjalankan bot sekarang juga.
import { getStore } from "@netlify/blobs";
import { buatBot, tanggalWIB, teksSoal, teksJawaban } from "../lib/bot.mjs";
import { soalUntuk } from "../lib/soal.mjs";

export default async (req) => {
  const url = new URL(req.url);
  const kunci = process.env.THREADS_BOT_KEY;
  if (!kunci || url.searchParams.get("kunci") !== kunci) return new Response("Tidak diizinkan.", { status: 401 });
  const aksi = url.searchParams.get("aksi") ?? "contoh";
  try {
    if (aksi === "contoh") {
      const hari = url.searchParams.get("tanggal") ?? tanggalWIB();
      const s = soalUntuk(hari);
      return new Response(`Tanggal ${hari} · soal ${s.id}\n\n--- POST SOAL ---\n${teksSoal(s)}\n\n--- BALASAN JAWABAN (besoknya) ---\n${teksJawaban(s)}`, { headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    const bot = buatBot({ store: getStore("threads-bot") });
    const hasil = aksi === "status" ? await bot.status() : aksi === "kuota" ? await bot.kuota() : aksi === "harian" ? await bot.harian() : aksi === "balas" ? await bot.balas() : { galat: "aksi tidak dikenal" };
    if (hasil && hasil.token) hasil.token = "(tersimpan)";
    return Response.json(hasil);
  } catch (e) {
    return Response.json({ galat: e.message }, { status: 500 });
  }
};
