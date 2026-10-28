import type { Kelas, MetaBank, Paket, Soal } from "../../types";
import metaJson from "./meta.json";

export const meta = metaJson as MetaBank;

// Setiap kelas dimuat terpisah agar bank soal bisa tumbuh sampai ribuan soal
// tanpa memperlambat halaman awal. Tambah soal: edit scripts/soal/kelasN.mjs lalu `npm run gen`,
// atau tambahkan objek baru langsung ke kelas-N.json dengan format yang sama.
const loaders: Record<Kelas, () => Promise<{ default: unknown }>> = {
  1: () => import("./kelas-1.json"),
  2: () => import("./kelas-2.json"),
  3: () => import("./kelas-3.json"),
  4: () => import("./kelas-4.json"),
  5: () => import("./kelas-5.json"),
  6: () => import("./kelas-6.json"),
};

const cache = new Map<Kelas, Soal[]>();

export async function muatSoal(kelas: Kelas): Promise<Soal[]> {
  const ada = cache.get(kelas);
  if (ada) return ada;
  const mod = await loaders[kelas]();
  const soal = mod.default as Soal[];
  cache.set(kelas, soal);
  return soal;
}

export const KATEGORI_OSN = "OSN/KSN";

let paketCache: Paket[] | null = null;
/** Paket soal olimpiade (soal kiriman pemilik website), dimuat saat dibutuhkan. */
export async function muatPaket(id: string): Promise<Paket | undefined> {
  if (!paketCache) paketCache = (await import("./paket.json")).default as unknown as Paket[];
  return paketCache.find((p) => p.id === id);
}
