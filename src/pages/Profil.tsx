import Ikon from "../components/Ikon";
import { BAHASA, useBahasa } from "../i18n";
import { akurasi } from "../lib/progres";
import type { Progres } from "../types";

/** Halaman profil (terutama untuk HP): akun, bahasa, masukan, keluar. */
export default function Profil({
  progres,
  akun,
  onMasukan,
  onGuru,
}: {
  progres: Progres;
  akun?: { username: string; kelas: number; onKeluar: () => void };
  onMasukan?: () => void;
  onGuru?: () => void;
}) {
  const { t, bahasa, setBahasa } = useBahasa();
  const inisial = (progres.nama || akun?.username || "?").split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const baris = "flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-4 text-left text-base font-bold text-tinta shadow-kartu hover:bg-[#F8FAFF]";
  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-6 sm:pb-12">
      <section className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9] p-5 text-white">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/20 text-2xl font-extrabold">{inisial}</span>
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold">{progres.nama || akun?.username}</p>
          {akun && (
            <p className="text-sm text-white/80">
              @{akun.username} · {t.kelasN(akun.kelas)}
            </p>
          )}
          <p className="mt-1 text-sm text-white/80">
            {progres.skor} {t.poinMadu} · {akurasi(progres.totalBenar, progres.totalDijawab)}% {t.ketepatanKecil}
          </p>
        </div>
      </section>

      <h2 className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.14em] text-redup">{t.profilBahasa}</h2>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label={t.pilihBahasa}>
        {BAHASA.map((b) => (
          <button
            key={b.kode}
            type="button"
            aria-pressed={bahasa === b.kode}
            onClick={() => setBahasa(b.kode)}
            className={`rounded-2xl py-3 text-sm font-extrabold ${bahasa === b.kode ? "bg-utama text-white" : "bg-white text-tinta shadow-kartu"}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <h2 className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.14em] text-redup">{t.akunJudul}</h2>
      <div className="grid gap-2">
        {onMasukan && (
          <button type="button" className={baris} onClick={onMasukan}>
            <Ikon nama="pesan" className="h-5 w-5 text-utama" />
            {t.masukanJudul}
          </button>
        )}
        {onGuru && (
          <button type="button" className={baris} onClick={onGuru}>
            <Ikon nama="guru" className="h-5 w-5 text-utama" />
            {t.guru.judul}
          </button>
        )}
        {akun && (
          <button type="button" className={`${baris} text-salah`} onClick={akun.onKeluar}>
            <Ikon nama="keluar" className="h-5 w-5" />
            {t.akunKeluar}
          </button>
        )}
      </div>
    </main>
  );
}
