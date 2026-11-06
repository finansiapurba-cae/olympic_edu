// Tiap 15 menit: membalas komentar jawaban (A–D) pada post soal.
import { getStore } from "@netlify/blobs";
import { buatBot } from "../lib/bot.mjs";

export default async () => {
  if (process.env.THREADS_AKTIF !== "ya") return new Response("Bot Threads mati (THREADS_AKTIF belum 'ya').");
  try {
    const hasil = await buatBot({ store: getStore("threads-bot") }).balas();
    console.log("threads-balas", JSON.stringify(hasil));
    return Response.json(hasil);
  } catch (e) {
    console.error("threads-balas gagal:", e.message);
    return new Response(e.message, { status: 500 });
  }
};

export const config = { schedule: "*/15 * * * *" };
