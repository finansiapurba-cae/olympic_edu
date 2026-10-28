import { useState } from "react";
import Lipat from "../components/Lipat";
import Tombol from "../components/Tombol";
import BarKemajuan from "../components/BarKemajuan";
import SampulLebah from "../components/SampulLebah";
import { meta, KATEGORI_OSN } from "../data/bank";
import { useBahasa } from "../i18n";
import { kunciKelompok, salahUntukKelas } from "../lib/progres";
import type { Kelas, PengaturanSesi, PilihanTingkat, Progres } from "../types";

const KELAS: Kelas[] = [1, 2, 3, 4, 5, 6];
const TINGKAT: PilihanTingkat[] = ["mudah", "sedang", "sulit", "campuran"];
const DURASI = [10, 15, 20, 30, 45, 60];
const TOTAL_BANK = KELAS.reduce((s, k) => s + meta.kelas[k].total, 0);
const TOTAL_PAKET = meta.paket.reduce((s, p) => s + p.total, 0);

const gulirKe = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function Beranda({ progres, awal, onMulai }: { progres: Progres; awal: PengaturanSesi; onMulai: (s: PengaturanSesi) => void }) {
  const { t, bahasa, locale } = useBahasa();
  const [kelas, setKelas] = useState<Kelas>(awal.kelas);
  const [tingkat, setTingkat] = useState<PilihanTingkat>(awal.tingkat);
  const [pakaiTimer, setPakaiTimer] = useState(awal.mode === "simulasi");
  const [durasi, setDurasi] = useState(awal.durasiMenit);

  const m = meta.kelas[kelas];
  const jumlahTingkat = (x: PilihanTingkat) => (x === "campuran" ? m.total : m.tingkat[x] ?? 0);
  const tersedia = jumlahTingkat(tingkat);
  const mode = pakaiTimer ? "simulasi" : "latihan";
  const sudah = progres.sudahDikerjakan[kunciKelompok({ kelas, tingkat, mode })]?.length ?? 0;
  const salah = salahUntukKelas(progres, kelas).length;
  const osn = m.kategori[KATEGORI_OSN] ?? 0;
  const sudahOsn = progres.sudahDikerjakan[kunciKelompok({ kelas, tingkat, mode: "osn" })]?.length ?? 0;

  const mulai = (md: PengaturanSesi["mode"], paket?: string) => onMulai({ kelas, tingkat, mode: md, durasiMenit: durasi, paket });

  return (
    <>
      <SampulLebah onMulai={() => gulirKe("pilih-latihan")} onPaket={() => gulirKe("paket-olimpiade")} jumlahSoal={TOTAL_BANK} jumlahPaket={TOTAL_PAKET} />
      <main className="mx-auto w-full max-w-3xl px-4 pb-8 pt-6 sm:px-6 sm:pb-12">
        <section id="pilih-latihan" className="scroll-mt-4 rounded-3xl bg-white p-6 shadow-kartu sm:p-10">
          <p className="inline-block bg-gradient-to-r from-[#1E40AF] to-[#0D9488] bg-clip-text text-xs font-bold uppercase tracking-[0.18em] text-transparent">{t.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-tinta sm:text-4xl">{t.judul}</h2>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-redup">{t.intro}</p>

          <div className="mt-8 grid gap-6">
            <div>
              <label htmlFor="pilih-kelas" className="mb-2 block text-sm font-semibold text-tinta">
                {t.kelas}
              </label>
              <div className="relative">
                <select
                  id="pilih-kelas"
                  value={kelas}
                  onChange={(e) => setKelas(Number(e.target.value) as Kelas)}
                  className="w-full appearance-none rounded-xl border border-garis bg-halaman px-4 py-3.5 pr-12 text-base font-semibold text-tinta focus:border-utama focus:outline-none focus:ring-4 focus:ring-utama/15"
                >
                  {KELAS.map((k) => (
                    <option key={k} value={k}>
                      {t.kelasN(k)} · {t.nSoal(meta.kelas[k].total)}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-redup" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-redup">{t.tersedia(m.total, kelas, m.tingkat.mudah ?? 0, m.tingkat.sedang ?? 0, m.tingkat.sulit ?? 0)}</p>
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-tinta">{t.tingkatKesulitan}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TINGKAT.map((x) => (
                  <label
                    key={x}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-utama/20 ${
                      tingkat === x ? "border-utama bg-gradient-to-br from-utama-muda to-white text-utama shadow-[0_6px_16px_-10px_rgba(33,74,155,.8)]" : "border-garis bg-white text-tinta hover:border-utama/40"
                    }`}
                  >
                    <input type="radio" name="tingkat" value={x} checked={tingkat === x} onChange={() => setTingkat(x)} className="sr-only" />
                    <span className="block text-sm font-bold">{t.tingkat[x]}</span>
                    <span className="block text-xs tabular-nums opacity-80">{t.nSoal(jumlahTingkat(x))}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-tinta">{t.mode}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { v: false, judul: t.latihanBebas, ket: t.latihanBebasKet },
                  { v: true, judul: t.simulasi, ket: t.simulasiKet },
                ].map((o) => (
                  <label
                    key={String(o.v)}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-utama/20 ${
                      pakaiTimer === o.v ? "border-utama bg-gradient-to-br from-utama-muda to-white" : "border-garis hover:border-utama/40"
                    }`}
                  >
                    <input type="radio" name="mode" checked={pakaiTimer === o.v} onChange={() => setPakaiTimer(o.v)} className="mt-1 accent-utama" />
                    <span>
                      <span className="block text-sm font-bold text-tinta">{o.judul}</span>
                      <span className="block text-sm text-redup">{o.ket}</span>
                    </span>
                  </label>
                ))}
              </div>
              {pakaiTimer && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label htmlFor="durasi" className="text-sm font-medium text-tinta">
                    {t.lamaSimulasi}
                  </label>
                  <select
                    id="durasi"
                    value={durasi}
                    onChange={(e) => setDurasi(Number(e.target.value))}
                    className="rounded-lg border border-garis bg-halaman px-3 py-2 text-sm font-semibold focus:border-utama focus:outline-none"
                  >
                    {DURASI.map((d) => (
                      <option key={d} value={d}>
                        {t.nMenit(d)}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-redup">{t.waktuHabisOtomatis}</span>
                </div>
              )}
            </fieldset>

            <BarKemajuan nilai={sudah} maks={tersedia} label={t.sudahDikerjakanLabel(kelas, t.tingkat[tingkat])} />

            <div className="grid gap-3">
              <Tombol onClick={() => mulai(mode)} disabled={!tersedia} className="w-full py-4 text-lg">
                {t.mulai}
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.64l-4.22-4.22a.75.75 0 111.06-1.06l5.5 5.5a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 11-1.06-1.06l4.22-4.22H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Tombol>
              <Tombol varian="kedua" onClick={() => mulai("ulang")} disabled={!salah} className="w-full">
                {salah ? t.ulangiSalahN(salah) : t.ulangiSalah}
              </Tombol>
              {!salah && <p className="-mt-1 text-center text-xs text-redup">{t.belumAdaSalah(kelas)}</p>}
            </div>
          </div>
        </section>

        {meta.paket.length > 0 && (
          <section id="paket-olimpiade" className="mt-6 scroll-mt-4 rounded-3xl border-2 border-[#14B8A6]/30 bg-white p-6 shadow-kartu sm:p-8">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1E40AF] to-[#14B8A6] text-xl font-extrabold text-white" aria-hidden="true">
                ⬢
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-tinta">{t.paketJudul}</h2>
                <p className="mt-1 text-sm text-redup">{t.paketIsi}</p>
              </div>
            </div>
            <ul className="mt-5 grid gap-3">
              {meta.paket.map((p) => {
                const n = progres.sudahDikerjakan[`paket-${p.id}`]?.length ?? 0;
                return (
                  <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-br from-[#EFF6FF] via-white to-[#E6FFFB] p-4 ring-1 ring-[#14B8A6]/20">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-tinta">{p.judul[bahasa]}</h3>
                      <p className="text-sm text-redup">
                        {p.deskripsi[bahasa]} · {t.nSoal(p.total)} · {t.paketKelas(p.kelas)}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#1E40AF] to-[#14B8A6]" style={{ width: `${Math.round((n / p.total) * 100)}%` }} />
                      </div>
                      <p className="mt-1 text-xs tabular-nums text-redup">{t.paketSudah(n, p.total)}</p>
                    </div>
                    <Tombol onClick={() => mulai("paket", p.id)} className="w-full sm:w-auto">
                      {t.paketMulai}
                    </Tombol>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-6 grid gap-3">
          <Lipat judul={t.osnJudul} keterangan={t.osnKet(osn, kelas)}>
            <p>{t.osnIsi}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {m.topik.map((x) => (
                <li key={x.nama.id} className="rounded-full bg-halaman px-3 py-1 text-xs font-medium text-redup">
                  {x.nama[bahasa]}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Tombol onClick={() => mulai("osn")} disabled={!osn}>
                {t.osnMulai(kelas)}
              </Tombol>
              <span className="text-sm text-redup">{t.osnSudah(sudahOsn, osn)}</span>
            </div>
          </Lipat>

          <Lipat judul={t.cakupanJudul} keterangan={t.cakupanKet(TOTAL_BANK)}>
            <div className="-mx-4 overflow-x-auto px-4">
              <table className="w-full min-w-[480px] text-left text-sm tabular-nums">
                <thead className="text-xs uppercase tracking-wide text-redup">
                  <tr>
                    {[t.kolom.kelas, t.kolom.total, t.kolom.mudah, t.kolom.sedang, t.kolom.sulit, t.kolom.osn].map((h) => (
                      <th key={h} className="py-2 pr-3 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KELAS.map((k) => {
                    const x = meta.kelas[k];
                    return (
                      <tr key={k} className="border-t border-garis">
                        <td className="py-2 pr-3 font-semibold">{t.kelasN(k)}</td>
                        <td className="py-2 pr-3">{x.total}</td>
                        <td className="py-2 pr-3">{x.tingkat.mudah ?? 0}</td>
                        <td className="py-2 pr-3">{x.tingkat.sedang ?? 0}</td>
                        <td className="py-2 pr-3">{x.tingkat.sulit ?? 0}</td>
                        <td className="py-2">{x.kategori[KATEGORI_OSN] ?? 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <h3 className="mt-5 font-semibold">{t.topikKelas(kelas)}</h3>
            <p className="mt-1 text-redup">{m.topik.map((x) => `${x.nama[bahasa]} (${x.jumlah})`).join(" · ")}</p>
            <h3 className="mt-5 font-semibold">{t.tentangSumber}</h3>
            <p className="mt-1 text-redup">{t.sumberIsi(new Date(meta.dibuat).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }))}</p>
          </Lipat>
        </div>
      </main>
    </>
  );
}
