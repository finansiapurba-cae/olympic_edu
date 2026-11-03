import { useState } from "react";
import Lipat from "../components/Lipat";
import Tombol from "../components/Tombol";
import BarKemajuan from "../components/BarKemajuan";
import SampulLebah from "../components/SampulLebah";
import Ikon, { type NamaIkon } from "../components/Ikon";
import { meta, KATEGORI_OSN } from "../data/bank";
import { useBahasa } from "../i18n";
import { akurasi, kunciKelompok, salahUntukKelas } from "../lib/progres";
import type { KategoriPaket, Kelas, PengaturanSesi, PilihanTingkat, Progres } from "../types";

const KATEGORI: KategoriPaket[] = ["indonesia", "internasional", "standar"];
const IKON_KATEGORI: Record<KategoriPaket, NamaIkon> = { indonesia: "piala", internasional: "bola", standar: "buku" };
// Warna petak kategori, sama dengan desain aplikasi: madu, biru langit, hijau.
const WARNA_KATEGORI: Record<KategoriPaket, [string, string]> = {
  indonesia: ["bg-[#FFF4D6] text-[#92400E]", "ring-[#F2B53A]"],
  internasional: ["bg-[#E0F2FE] text-[#0369A1]", "ring-[#0EA5E9]"],
  standar: ["bg-[#DCFCE7] text-[#15803D]", "ring-[#22C55E]"],
};

const KELAS: Kelas[] = [1, 2, 3, 4, 5, 6];
const TINGKAT: PilihanTingkat[] = ["mudah", "sedang", "sulit", "campuran"];
const DURASI = [10, 15, 20, 30, 45, 60];
const TOTAL_BANK = KELAS.reduce((s, k) => s + meta.kelas[k].total, 0);
const TOTAL_PAKET = meta.paket.reduce((s, p) => s + p.total, 0);

const gulirKe = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function Beranda({ progres, awal, onMulai, onMasukan }: { progres: Progres; awal: PengaturanSesi; onMulai: (s: PengaturanSesi) => void; onMasukan?: () => void }) {
  const { t, bahasa, locale } = useBahasa();
  const [kelas, setKelas] = useState<Kelas>(awal.kelas);
  const [kategori, setKategori] = useState<KategoriPaket>("indonesia");
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

  // Paket yang sedang dikerjakan (sudah mulai, belum selesai), yang terakhir dibuka lebih dulu.
  const terakhir = progres.riwayat.find((r) => r.mode === "paket")?.paket;
  const belumSelesai = meta.paket.filter((p) => {
    const n = progres.sudahDikerjakan[`paket-${p.id}`]?.length ?? 0;
    return n > 0 && n < p.total;
  });
  const lanjutan = belumSelesai.find((p) => p.id === terakhir) ?? belumSelesai[0];
  const nLanjutan = lanjutan ? progres.sudahDikerjakan[`paket-${lanjutan.id}`]?.length ?? 0 : 0;

  return (
    <>
      {/* HP: sapaan ala aplikasi. Layar lebar: sampul lebah. */}
      <section className="bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9] px-4 pb-16 text-white sm:hidden" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)" }}>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0F1B33] text-xl font-extrabold text-[#F2B53A]" aria-hidden="true">
            Σ
          </span>
          <span className="text-base font-extrabold tracking-tight">Olympic Edu</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-[#DBEAFE]">{t.sapaHalo}</p>
            <p className="truncate text-xl font-extrabold">{progres.nama || "Olympic Edu"}</p>
          </div>
          {onMasukan && (
            <button type="button" onClick={onMasukan} aria-label={t.masukanJudul} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
              <Ikon nama="pesan" className="h-[22px] w-[22px]" />
            </button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            [String(progres.skor), t.poinMadu],
            [String(progres.streak), t.hariBeruntun],
            [`${akurasi(progres.totalBenar, progres.totalDijawab)}%`, t.ketepatanKecil],
          ].map(([v, k]) => (
            <div key={k} className="rounded-2xl bg-white/15 p-3">
              <p className="text-2xl font-extrabold tabular-nums">{v}</p>
              <p className="text-xs text-[#DBEAFE]">{k}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="hidden sm:block">
        <SampulLebah onMulai={() => gulirKe("pilih-latihan")} onPaket={() => gulirKe("paket-olimpiade")} jumlahSoal={TOTAL_BANK} jumlahPaket={TOTAL_PAKET} />
      </div>
      <main className="mx-auto w-full max-w-3xl px-4 pb-8 pt-0 sm:px-6 sm:pb-12 sm:pt-6">
        {lanjutan && (
          <section className="relative z-10 -mt-11 mb-5 grid gap-3 rounded-3xl bg-white p-5 shadow-kartu sm:mt-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#B7791F]">{t.lanjutkanLabel}</p>
                <p className="mt-0.5 text-lg font-extrabold text-tinta">{lanjutan.judul[bahasa]}</p>
              </div>
              <span className="shrink-0 text-sm font-bold tabular-nums text-redup">
                {nLanjutan}/{lanjutan.total}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
              <div className="h-full rounded-full bg-[#F2B53A]" style={{ width: `${(nLanjutan / lanjutan.total) * 100}%` }} />
            </div>
            <Tombol onClick={() => mulai("paket", lanjutan.id)} className="w-full">
              {t.lanjutKeSoal(nLanjutan + 1)}
            </Tombol>
          </section>
        )}
        <section id="pilih-latihan" className={`scroll-mt-4 rounded-3xl bg-white p-5 shadow-kartu sm:p-10 ${lanjutan ? "" : "relative z-10 -mt-11 sm:mt-0"}`}>
          <p className="hidden bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] bg-clip-text text-xs font-bold uppercase tracking-[0.18em] text-transparent sm:inline-block">{t.eyebrow}</p>
          <h2 className="text-balance text-xl font-extrabold leading-tight text-tinta sm:mt-3 sm:text-4xl">
            <span className="sm:hidden">{t.latihanAcak}</span>
            <span className="hidden sm:inline">{t.judul}</span>
          </h2>
          <p className="mt-3 hidden max-w-prose text-base leading-relaxed text-redup sm:block">{t.intro}</p>

          <div className="mt-5 grid gap-6 sm:mt-8">
            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-tinta">{t.kelas}</legend>
              <div className="grid grid-cols-6 gap-2">
                {KELAS.map((k) => (
                  <label
                    key={k}
                    title={`${t.kelasN(k)} · ${t.nSoal(meta.kelas[k].total)}`}
                    className={`grid h-12 cursor-pointer place-items-center rounded-2xl text-lg font-extrabold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-utama/25 ${
                      kelas === k ? "bg-[#1E40AF] text-white shadow-[0_8px_18px_-10px_rgba(30,64,175,.9)]" : "border-[1.5px] border-[#CBD5E1] bg-white text-tinta hover:border-utama/50"
                    }`}
                  >
                    <input type="radio" name="kelas" value={k} checked={kelas === k} onChange={() => setKelas(k)} className="sr-only" />
                    {k}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-redup">{t.tersedia(m.total, kelas, m.tingkat.mudah ?? 0, m.tingkat.sedang ?? 0, m.tingkat.sulit ?? 0)}</p>
            </fieldset>

            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-tinta">{t.tingkatKesulitan}</legend>
              <div className="flex flex-wrap gap-2">
                {TINGKAT.map((x) => (
                  <label
                    key={x}
                    className={`flex cursor-pointer items-baseline gap-1.5 rounded-full px-4 py-2 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-utama/20 ${
                      tingkat === x ? "bg-tinta text-white" : "border-[1.5px] border-[#CBD5E1] bg-white text-tinta hover:border-utama/50"
                    }`}
                  >
                    <input type="radio" name="tingkat" value={x} checked={tingkat === x} onChange={() => setTingkat(x)} className="sr-only" />
                    <span className="text-sm font-bold">{t.tingkat[x]}</span>
                    <span className="text-xs tabular-nums opacity-70">{jumlahTingkat(x)}</span>
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
          <section id="paket-olimpiade" className="mt-6 scroll-mt-4 rounded-3xl border-2 border-[#38BDF8]/30 bg-white p-6 shadow-kartu sm:p-8">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1E40AF] to-[#38BDF8] text-xl font-extrabold text-white" aria-hidden="true">
                ⬢
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-tinta">{t.paketJudul}</h2>
                <p className="mt-1 text-sm text-redup">{t.paketIsi}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2" role="tablist" aria-label={t.paketJudul}>
              {KATEGORI.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={kategori === k}
                  onClick={() => setKategori(k)}
                  className={`flex flex-col items-start gap-2 rounded-2xl p-3 text-left text-[13px] font-extrabold leading-tight transition sm:flex-row sm:items-center sm:text-sm ${WARNA_KATEGORI[k][0]} ${kategori === k ? `ring-2 ${WARNA_KATEGORI[k][1]}` : "opacity-80 hover:opacity-100"}`}
                >
                  <Ikon nama={IKON_KATEGORI[k]} className="h-6 w-6 shrink-0" />
                  {t.kategoriPaket[k][0]}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-redup">{t.kategoriPaket[kategori][1]}</p>
            <ul className="mt-3 grid gap-3">
              {meta.paket.filter((p) => p.kategori === kategori).map((p) => {
                const n = progres.sudahDikerjakan[`paket-${p.id}`]?.length ?? 0;
                return (
                  <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-br from-[#EFF6FF] via-white to-[#E0F2FE] p-4 ring-1 ring-[#38BDF8]/20">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-tinta">{p.judul[bahasa]}</h3>
                      <p className="text-sm text-redup">
                        {p.deskripsi[bahasa]} · {t.nSoal(p.total)} · {t.paketKelas(p.kelas)}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#1E40AF] to-[#38BDF8]" style={{ width: `${Math.round((n / p.total) * 100)}%` }} />
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
