import { useState, type FormEvent, type ReactNode } from "react";
import Tombol from "../components/Tombol";
import Ikon from "../components/Ikon";
import { BAHASA, useBahasa } from "../i18n";
import { AkunError, masuk, simpanProfil, type Sesi } from "../lib/akun";
import type { Kelas } from "../types";

// Akun hanya dibuat oleh admin (lihat supabase/PANDUAN.md). Kontak ini ditampilkan untuk yang belum punya akun.
export const KONTAK_ADMIN = "";

const kolom = "h-[52px] w-full rounded-2xl border-[1.5px] border-[#CBD5E1] bg-white px-4 text-base font-medium text-tinta placeholder:text-redup/70 focus:border-utama focus:outline-none focus:ring-4 focus:ring-utama/15";

function LogoLebah() {
  return (
    <div className="relative grid h-32 w-32 place-items-center rounded-[40px] bg-white/15">
      <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
        <ellipse cx="34" cy="34" rx="16" ry="11" fill="#E0F2FE" opacity="0.9" transform="rotate(-25 34 34)" />
        <ellipse cx="60" cy="32" rx="16" ry="11" fill="#E0F2FE" opacity="0.9" transform="rotate(25 60 32)" />
        <ellipse cx="48" cy="58" rx="26" ry="20" fill="#F2B53A" />
        <rect x="38" y="39" width="7" height="38" rx="3" fill="#0F1B33" />
        <rect x="53" y="39" width="7" height="38" rx="3" fill="#0F1B33" />
        <circle cx="70" cy="54" r="3" fill="#0F1B33" />
        <path d="M66 63 q4 3 8 0" stroke="#0F1B33" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      <span className="absolute -right-2 -top-2 grid h-10 w-10 place-items-center rounded-xl bg-[#0F1B33] text-2xl font-extrabold text-[#F2B53A]" aria-hidden="true">
        Σ
      </span>
    </div>
  );
}

/** HP: logo di atas latar biru dan formulir di lembar putih bawah. Layar lebar: kartu di tengah. */
function Bingkai({ children }: { children: ReactNode }) {
  const { t, bahasa, setBahasa } = useBahasa();
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9]" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="flex flex-col items-center gap-3.5 px-6 pb-7 pt-12 text-white sm:pt-16">
        <LogoLebah />
        <div className="text-center">
          <p className="text-3xl font-extrabold tracking-tight">Olympic Edu</p>
          <p className="mt-1 text-sm text-[#DBEAFE]">{t.tagline}</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-white/15 p-1" role="group" aria-label={t.pilihBahasa}>
          {BAHASA.map((b) => (
            <button
              key={b.kode}
              type="button"
              title={b.nama}
              aria-pressed={bahasa === b.kode}
              onClick={() => setBahasa(b.kode)}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors ${bahasa === b.kode ? "bg-[#E0F2FE] text-[#0B1F4B]" : "text-white hover:bg-white/10"}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <main className="flex-1 rounded-t-[32px] bg-white px-6 pb-8 pt-7 sm:mx-auto sm:mb-16 sm:w-full sm:max-w-md sm:flex-none sm:rounded-3xl sm:p-8 sm:shadow-kartu" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)" }}>
        {children}
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
        <Tombol type="submit" disabled={proses} className="h-14 w-full rounded-2xl text-[17px] font-extrabold">
          {proses ? t.akunMenunggu : t.akunMasuk}
        </Tombol>
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#EFF6FF] p-4 text-sm text-tinta">
        <Ikon nama="pesan" className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#1E40AF]" />
        <div>
          <p className="font-bold">{t.akunBelumPunya}</p>
          <p className="mt-1 leading-relaxed text-[#334155]">{t.akunHubungiAdmin}</p>
          {KONTAK_ADMIN && <p className="mt-2 select-all font-bold text-utama">{KONTAK_ADMIN}</p>}
        </div>
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
        <Tombol type="submit" disabled={proses} className="h-14 w-full rounded-2xl text-[17px] font-extrabold">
          {proses ? t.akunMenunggu : t.akunSimpanProfil}
        </Tombol>
      </form>
      <button type="button" onClick={onKeluar} className="mt-4 w-full text-center text-sm font-semibold text-redup hover:text-tinta">
        {t.akunKeluar}
      </button>
    </Bingkai>
  );
}
