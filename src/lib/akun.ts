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

export type GalatAkun = "formatUsername" | "sandiPendek" | "usernameDipakai" | "salahMasuk" | "jaringan" | "konfirmasiEmail" | "lain";
export class AkunError extends Error {
  constructor(public kode: GalatAkun) {
    super(kode);
  }
}

const KUNCI_SESI = "kms-sesi";
// Supabase memerlukan alamat email; username diubah menjadi alamat yang tidak pernah dikirimi email.
const emailDari = (username: string) => `${username}@siswa.olympicedu.app`;
export const rapikanUsername = (u: string) => u.trim().toLowerCase();
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

export async function daftar(username: string, sandi: string, nama: string, kelas: Kelas): Promise<Sesi> {
  const u = rapikanUsername(username);
  if (!usernameSah(u)) throw new AkunError("formatUsername");
  if (sandi.length < 6) throw new AkunError("sandiPendek");
  const r = await panggil("/auth/v1/signup", { method: "POST", body: JSON.stringify({ email: emailDari(u), password: sandi, data: { username: u, nama: nama.trim(), kelas } }) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const pesan = `${data.code ?? ""} ${data.error_code ?? ""} ${data.msg ?? data.message ?? ""}`;
    if (/already|exists|registered/i.test(pesan)) throw new AkunError("usernameDipakai");
    if (/password/i.test(pesan)) throw new AkunError("sandiPendek");
    throw new AkunError("lain");
  }
  // Bila "Confirm email" masih aktif di Supabase, pendaftaran tidak langsung memberi sesi.
  if (!data.access_token) throw new AkunError("konfirmasiEmail");
  const s = sesiDari(data);
  simpanSesi(s);
  return s;
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
