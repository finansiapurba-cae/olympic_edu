// Setiap pagi 07.00 WIB (00.00 UTC): jawaban soal kemarin, lalu "Soal Hari Ini".
import { getStore } from "@netlify/blobs";
import { buatBot } from "../lib/bot.mjs";

export default async () => {
  if (process.env.THREADS_AKTIF !== "ya") return new Response("Bot Threads mati (THREADS_AKTIF belum 'ya').");
  try {
    const hasil = await buatBot({ store: getStore("threads-bot") }).harian();
    console.log("threads-harian", JSON.stringify(hasil));
    return Response.json(hasil);
  } catch (e) {
    console.error("threads-harian gagal:", e.message);
    return new Response(e.message, { status: 500 });
  }
};

export const config = { schedule: "0 0 * * *" };
