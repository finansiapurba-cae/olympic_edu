import type { Kelas, Progres } from "../types";

// Akun murid (username + kata sandi) memakai Supabase Auth, dan progres disimpan di tabel "progres".
// Panduan pemasangan: supabase/PANDUAN.md. Kosong = fitur akun mati, progres hanya di perangkat.
// Kunci "publishable" memang untuk dipakai di browser; keamanan data dijaga oleh aturan RLS di supabase/setup.sql.
export const SUPABASE_URL: string = (import.meta.env.VITE_SUPABASE_URL ?? "https://fcxjxgvsmgyptnvdbarn.supabase.co").replace(/\/$/, "");
export const SUPABASE_KEY: string = import.meta.env.VITE_SUPABASE_KEY ?? "sb_publishable_XgV-Tm0IkcRSsKEixGZuaA_7-zgduFp";
export const AKUN_AKTIF = Boolean(SUPABASE_URL && SUPABASE_KEY);

export interface Sesi {
  token: string;
  refresh: string;
  kedaluwarsa: number; // ms
  id: string;
  username: string;
  nama: string;
  kelas: Kelas;
}

export type GalatAkun = "salahMasuk" | "jaringan" | "konfirmasiEmail" | "lain";
export class AkunError extends Error {
  constructor(public kode: GalatAkun) {
    super(kode);
  }
}

const KUNCI_SESI = "kms-sesi";
// Supabase memerlukan alamat email; username diubah menjadi alamat yang tidak pernah dikirimi email.
const emailDari = (username: string) => `${username}@siswa.olympicedu.app`;
// Bila yang diketik alamat lengkap (budi@siswa.olympicedu.app), cukup ambil bagian username-nya.
export const rapikanUsername = (u: string) => u.trim().toLowerCase().replace(/@siswa\.olympicedu\.app$/, "");
export const usernameSah = (u: string) => /^[a-z0-9._]{3,20}$/.test(u);

function simpanSesi(s: Sesi | null) {
  try {
    if (s) localStorage.setItem(KUNCI_SESI, JSON.stringify(s));
    else localStorage.removeItem(KUNCI_SESI);
  } catch {
    /* abaikan */
  }
}
export function muatSesi(): Sesi | null {
  if (!AKUN_AKTIF) return null;
  try {
    const raw = localStorage.getItem(KUNCI_SESI);
    return raw ? (JSON.parse(raw) as Sesi) : null;
  } catch {
    return null;
  }
}

async function panggil(path: string, init: RequestInit & { token?: string } = {}) {
  const { token, headers, ...rest } = init;
  try {
    return await fetch(`${SUPABASE_URL}${path}`, {
      ...rest,
      // Kunci publishable hanya boleh di header apikey; Authorization hanya berisi token murid yang sudah masuk.
      headers: { apikey: SUPABASE_KEY, ...(token ? { Authorization: `Bearer ${token}` } : {}), "Content-Type": "application/json", ...headers },
    });
  } catch {
    throw new AkunError("jaringan");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sesiDari(data: any): Sesi {
  const meta = data.user?.user_metadata ?? {};
  return {
    token: data.access_token,
    refresh: data.refresh_token,
    kedaluwarsa: Date.now() + (data.expires_in ?? 3600) * 1000,
    id: data.user.id,
    username: meta.username ?? String(data.user.email ?? "").split("@")[0],
    nama: meta.nama ?? "",
    kelas: (Number(meta.kelas) || 1) as Kelas,
  };
}

/** Akun dibuat oleh admin di Supabase; saat pertama masuk murid melengkapi nama dan kelasnya sendiri. */
export async function simpanProfil(s: Sesi, nama: string, kelas: Kelas): Promise<Sesi> {
  const sesi = await sesiSegar(s);
  const r = await panggil("/auth/v1/user", { method: "PUT", token: sesi.token, body: JSON.stringify({ data: { username: sesi.username, nama: nama.trim(), kelas } }) });
  if (!r.ok) throw new AkunError(r.status === 401 ? "salahMasuk" : "jaringan");
  const baru = { ...sesi, nama: nama.trim(), kelas };
  simpanSesi(baru);
  return baru;
}

export async function masuk(username: string, sandi: string): Promise<Sesi> {
  const u = rapikanUsername(username);
  if (!usernameSah(u)) throw new AkunError("salahMasuk");
  const r = await panggil("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: emailDari(u), password: sandi }) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new AkunError(/confirm/i.test(`${data.error_code ?? ""} ${data.msg ?? data.error_description ?? ""}`) ? "konfirmasiEmail" : "salahMasuk");
  const s = sesiDari(data);
  simpanSesi(s);
  return s;
}

export async function keluar(s: Sesi) {
  simpanSesi(null);
  panggil("/auth/v1/logout", { method: "POST", token: s.token }).catch(() => {});
}

/** Token berlaku sekitar 1 jam; perbarui bila hampir habis. */
async function sesiSegar(s: Sesi): Promise<Sesi> {
  if (s.kedaluwarsa - Date.now() > 60_000) return s;
  const r = await panggil("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: s.refresh }) });
  if (!r.ok) throw new AkunError("salahMasuk");
  const baru = { ...sesiDari(await r.json()), nama: s.nama, kelas: s.kelas, username: s.username };
  simpanSesi(baru);
  return baru;
}

/** Progres milik akun ini di server, atau null bila belum pernah disimpan. */
export async function ambilProgresAkun(s: Sesi): Promise<{ sesi: Sesi; progres: Progres | null }> {
  const sesi = await sesiSegar(s);
  const r = await panggil(`/rest/v1/progres?user_id=eq.${sesi.id}&select=data`, { token: sesi.token });
  if (r.status === 401) throw new AkunError("salahMasuk");
  if (!r.ok) throw new AkunError("jaringan");
  const baris = (await r.json()) as { data: Progres }[];
  return { sesi, progres: baris[0]?.data ?? null };
}

export async function simpanProgresAkun(s: Sesi, p: Progres): Promise<Sesi> {
  const sesi = await sesiSegar(s);
  const body = JSON.stringify({ user_id: sesi.id, username: sesi.username, nama: sesi.nama, kelas: sesi.kelas, skor: p.skor, dijawab: p.totalDijawab, benar: p.totalBenar, data: p, diperbarui: new Date().toISOString() });
  const r = await panggil("/rest/v1/progres", {
    method: "POST",
    token: sesi.token,
    // keepalive (agar tetap terkirim saat tab ditutup) hanya boleh untuk isi di bawah 64 KB.
    keepalive: body.length < 60_000,
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body,
  });
  if (!r.ok) throw new AkunError(r.status === 401 ? "salahMasuk" : "jaringan");
  return sesi;
}

export type JenisMasukan = "saran" | "masalah" | "soal" | "lainnya";

/** Masukan murid disimpan di tabel "masukan"; murid hanya bisa mengirim, admin membacanya di Supabase. */
export async function kirimMasukan(s: Sesi, isi: { jenis: JenisMasukan; nilai: number | null; pesan: string; soalId?: string; halaman: string; bahasa: string }) {
  const sesi = await sesiSegar(s);
  const r = await panggil("/rest/v1/masukan", {
    method: "POST",
    token: sesi.token,
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      user_id: sesi.id,
      username: sesi.username,
      nama: sesi.nama,
      kelas: sesi.kelas,
      jenis: isi.jenis,
      nilai: isi.nilai,
      pesan: isi.pesan.trim().slice(0, 2000),
      soal_id: isi.soalId ?? null,
      halaman: isi.halaman,
      bahasa: isi.bahasa,
    }),
  });
  if (!r.ok) throw new AkunError(r.status === 401 ? "salahMasuk" : "jaringan");
  return sesi;
}

/* ---------------- Catatan jawaban per soal (untuk dashboard guru) ---------------- */

export interface CatatanJawaban {
  soal_id: string;
  soal_kelas: number;
  paket: string | null;
  topik: string;
  tingkat: string;
  mode: string;
  pilihan: string;
  kunci: string;
  benar: boolean;
  waktu: string;
}
export interface BarisJawaban extends CatatanJawaban {
  user_id: string;
  username: string;
  nama: string | null;
  kelas: number | null;
}

const KUNCI_ANTRIAN = "kms-antrian-jawaban";
function bacaAntrian(): BarisJawaban[] {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_ANTRIAN) || "[]");
  } catch {
    return [];
  }
}
function tulisAntrian(a: BarisJawaban[]) {
  try {
    // Batasi agar penyimpanan tidak penuh bila lama tanpa internet.
    localStorage.setItem(KUNCI_ANTRIAN, JSON.stringify(a.slice(-500)));
  } catch {
    /* abaikan */
  }
}

let mengirim = false;
/** Setiap jawaban yang diperiksa dikirim ke tabel "jawaban". Bila gagal (tanpa internet), disimpan dan dikirim ulang nanti. */
export async function kirimJawaban(s: Sesi, c: CatatanJawaban) {
  const antrian = bacaAntrian();
  antrian.push({ ...c, user_id: s.id, username: s.username, nama: s.nama, kelas: s.kelas });
  tulisAntrian(antrian);
  if (mengirim) return;
  mengirim = true;
  try {
    const sesi = await sesiSegar(s);
    const kirim = bacaAntrian().filter((b) => b.user_id === sesi.id);
    if (!kirim.length) return;
    // Jawaban yang sama (murid, soal, waktu) tidak boleh tercatat dua kali, misalnya bila dikirim ulang
    // setelah koneksi putus. Perlu indeks unik "jawaban_unik" di Supabase; tanpa itu, kirim biasa.
    const body = JSON.stringify(kirim);
    let r = await panggil("/rest/v1/jawaban?on_conflict=user_id,soal_id,waktu", { method: "POST", token: sesi.token, keepalive: body.length < 60_000, headers: { Prefer: "return=minimal,resolution=ignore-duplicates" }, body });
    if (r.status === 400) r = await panggil("/rest/v1/jawaban", { method: "POST", token: sesi.token, keepalive: body.length < 60_000, headers: { Prefer: "return=minimal" }, body });
    if (r.ok) {
      const terkirim = new Set(kirim.map((b) => `${b.waktu}|${b.soal_id}`));
      tulisAntrian(bacaAntrian().filter((b) => !terkirim.has(`${b.waktu}|${b.soal_id}`)));
    }
  } catch {
    /* coba lagi pada jawaban berikutnya */
  } finally {
    mengirim = false;
  }
}

/** Apakah akun ini guru? Ditentukan oleh tabel "guru" di Supabase (lihat supabase/setup.sql). */
export async function cekGuru(s: Sesi): Promise<boolean> {
  try {
    const sesi = await sesiSegar(s);
    const r = await panggil("/rest/v1/rpc/is_guru", { method: "POST", token: sesi.token, body: "{}" });
    return r.ok && (await r.json()) === true;
  } catch {
    return false;
  }
}

export interface BarisProgres {
  user_id: string;
  username: string;
  nama: string | null;
  kelas: number | null;
  skor: number | null;
  dijawab: number | null;
  benar: number | null;
  diperbarui: string;
}
export interface BarisMasukan {
  id: number;
  dibuat: string;
  username: string | null;
  nama: string | null;
  kelas: number | null;
  jenis: string;
  nilai: number | null;
  pesan: string;
  soal_id: string | null;
}

/** Ambil semua baris (Supabase memberi paling banyak 1.000 baris per permintaan). */
async function ambilSemua<T>(s: Sesi, path: string): Promise<T[]> {
  const hasil: T[] = [];
  for (let dari = 0; dari < 100_000; dari += 1000) {
    const r = await panggil(path, { token: s.token, headers: { Range: `${dari}-${dari + 999}`, "Range-Unit": "items" } });
    if (r.status === 401) throw new AkunError("salahMasuk");
    if (!r.ok && r.status !== 206) throw new AkunError("jaringan");
    const bagian = (await r.json()) as T[];
    hasil.push(...bagian);
    if (bagian.length < 1000) break;
  }
  return hasil;
}

export async function ambilDataGuru(s: Sesi, sejak: string | null) {
  const sesi = await sesiSegar(s);
  const filter = sejak ? `&waktu=gte.${encodeURIComponent(sejak)}` : "";
  const [murid, jawaban, masukan] = await Promise.all([
    ambilSemua<BarisProgres>(sesi, "/rest/v1/progres?select=user_id,username,nama,kelas,skor,dijawab,benar,diperbarui&order=nama.asc"),
    ambilSemua<BarisJawaban>(sesi, `/rest/v1/jawaban?select=user_id,username,nama,kelas,soal_id,soal_kelas,paket,topik,tingkat,mode,pilihan,kunci,benar,waktu&order=waktu.desc${filter}`),
    ambilSemua<BarisMasukan>(sesi, "/rest/v1/masukan?select=id,dibuat,username,nama,kelas,jenis,nilai,pesan,soal_id&order=dibuat.desc"),
  ]);
  return { sesi, murid, jawaban, masukan };
}
