import { useState, type FormEvent, type ReactNode } from "react";
import Tombol from "../components/Tombol";
import { BAHASA, useBahasa } from "../i18n";
import { AkunError, masuk, simpanProfil, type Sesi } from "../lib/akun";
import type { Kelas } from "../types";

// Akun hanya dibuat oleh admin (lihat supabase/PANDUAN.md). Kontak ini ditampilkan untuk yang belum punya akun.
export const KONTAK_ADMIN = "";

const kolom = "w-full rounded-xl border border-garis bg-white px-4 py-3 text-base text-tinta placeholder:text-redup/70 focus:border-utama focus:outline-none focus:ring-4 focus:ring-utama/15";

function Bingkai({ children }: { children: ReactNode }) {
  const { t, bahasa, setBahasa } = useBahasa();
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9] px-4 py-8">
      <div className="mx-auto flex w-full max-w-md justify-end">
        <div className="flex rounded-lg bg-white/10 p-0.5" role="group" aria-label={t.pilihBahasa}>
          {BAHASA.map((b) => (
            <button
              key={b.kode}
              type="button"
              title={b.nama}
              aria-pressed={bahasa === b.kode}
              onClick={() => setBahasa(b.kode)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${bahasa === b.kode ? "bg-gradient-to-r from-[#E0F2FE] to-[#7DD3FC] text-[#0B1F4B]" : "text-white/80 hover:bg-white/10"}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <main className="mx-auto mt-6 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 text-white">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-navy-700 to-utama text-3xl font-extrabold text-sigma ring-1 ring-white/20" aria-hidden="true">
            Σ
          </span>
          <span className="leading-tight">
            <span className="block text-2xl font-extrabold tracking-tight">Olympic Edu</span>
            <span className="block text-sm text-white/70">{t.tagline}</span>
          </span>
        </div>
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-kartu sm:p-8">{children}</div>
      </main>
    </div>
  );
}

function Galat({ pesan }: { pesan: string }) {
  if (!pesan) return null;
  return (
    <p role="alert" className="rounded-xl bg-salah-muda px-4 py-3 text-sm font-semibold text-salah">
      {pesan}
    </p>
  );
}

export default function Masuk({ onMasuk }: { onMasuk: (s: Sesi) => void }) {
  const { t } = useBahasa();
  const [username, setUsername] = useState("");
  const [sandi, setSandi] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState(false);

  const kirim = async (e: FormEvent) => {
    e.preventDefault();
    setGalat("");
    if (!username.trim() || !sandi) return setGalat(t.akunGalat.kosong);
    setProses(true);
    try {
      onMasuk(await masuk(username, sandi));
    } catch (err) {
      setGalat(t.akunGalat[err instanceof AkunError ? err.kode : "lain"]);
    } finally {
      setProses(false);
    }
  };

  return (
    <Bingkai>
      <h1 className="text-2xl font-extrabold text-tinta">
        <span aria-hidden="true">🐝 </span>
        {t.akunJudulMasuk}
      </h1>
      <p className="mt-1 text-sm text-redup">{t.akunIsiMasuk}</p>

      <form className="mt-5 grid gap-4" onSubmit={kirim} noValidate>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-tinta">{t.akunUsername}</span>
          <input className={kolom} value={username} onChange={(e) => setUsername(e.target.value.slice(0, 40))} autoComplete="username" autoCapitalize="none" spellCheck={false} name="username" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-tinta">{t.akunSandi}</span>
          <div className="relative">
            <input className={`${kolom} pr-20`} type={lihat ? "text" : "password"} value={sandi} onChange={(e) => setSandi(e.target.value)} autoComplete="current-password" name="password" />
            <button type="button" onClick={() => setLihat((v) => !v)} className="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-2 text-xs font-bold text-utama hover:bg-halaman">
              {lihat ? t.akunSembunyi : t.akunLihat}
            </button>
          </div>
        </label>
        <Galat pesan={galat} />
        <Tombol type="submit" disabled={proses} className="w-full py-3.5 text-base">
          {proses ? t.akunMenunggu : t.akunMasuk}
        </Tombol>
      </form>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#E0F2FE] p-4 text-sm text-tinta ring-1 ring-[#BFDBFE]">
        <p className="font-bold">{t.akunBelumPunya}</p>
        <p className="mt-1 text-redup">{t.akunHubungiAdmin}</p>
        {KONTAK_ADMIN && <p className="mt-2 font-bold text-utama">{KONTAK_ADMIN}</p>}
      </div>
      <p className="mt-3 text-center text-xs text-redup">{t.akunLupa}</p>
    </Bingkai>
  );
}

/** Pertama kali masuk: murid menulis nama lengkap dan kelasnya. */
export function LengkapiProfil({ sesi, onSelesai, onKeluar }: { sesi: Sesi; onSelesai: (s: Sesi) => void; onKeluar: () => void }) {
  const { t } = useBahasa();
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState<Kelas>(sesi.kelas);
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState(false);

  const kirim = async (e: FormEvent) => {
    e.preventDefault();
    setGalat("");
    if (!nama.trim()) return setGalat(t.akunGalat.namaKosong);
    setProses(true);
    try {
      onSelesai(await simpanProfil(sesi, nama, kelas));
    } catch (err) {
      setGalat(t.akunGalat[err instanceof AkunError ? err.kode : "lain"]);
    } finally {
      setProses(false);
    }
  };

  return (
    <Bingkai>
      <h1 className="text-2xl font-extrabold text-tinta">
        <span aria-hidden="true">👋 </span>
        {t.akunJudulProfil}
      </h1>
      <p className="mt-1 text-sm text-redup">{t.akunIsiProfil(sesi.username)}</p>
      <form className="mt-5 grid gap-4" onSubmit={kirim} noValidate>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-tinta">{t.akunNama}</span>
          <input className={kolom} value={nama} onChange={(e) => setNama(e.target.value.slice(0, 40))} autoComplete="name" placeholder={t.akunNamaContoh} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-tinta">{t.akunKelas}</span>
          <select className={kolom} value={kelas} onChange={(e) => setKelas(Number(e.target.value) as Kelas)}>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <option key={k} value={k}>
                {t.kelasN(k)}
              </option>
            ))}
          </select>
        </label>
        <Galat pesan={galat} />
        <Tombol type="submit" disabled={proses} className="w-full py-3.5 text-base">
          {proses ? t.akunMenunggu : t.akunSimpanProfil}
        </Tombol>
      </form>
      <button type="button" onClick={onKeluar} className="mt-4 w-full text-center text-sm font-semibold text-redup hover:text-tinta">
        {t.akunKeluar}
      </button>
    </Bingkai>
  );
}
