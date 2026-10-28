import { useState } from "react";
import Dialog from "../components/Dialog";
import IkonBadge from "../components/IkonBadge";
import Tombol from "../components/Tombol";
import { DAFTAR_BADGE } from "../lib/badge";
import { akurasi } from "../lib/progres";
import { formatTanggal, pecahDurasi } from "../lib/util";
import { meta } from "../data/bank";
import { useBahasa } from "../i18n";
import type { Progres, Tingkat } from "../types";

export default function Statistik({ progres, onReset, keBeranda }: { progres: Progres; onReset: () => void; keBeranda: () => void }) {
  const { t, bahasa, locale } = useBahasa();
  const [konfirmasi, setKonfirmasi] = useState(false);
  const dur = (d: number) => t.durasi(...pecahDurasi(d));
  const p = progres;
  const dapat = DAFTAR_BADGE.filter((b) => p.badge[b.id]).length;

  const kartu: [string, string, string?][] = [
    [t.soalDikerjakan, String(p.totalDijawab), p.totalDilewati ? t.nDilewatiPendek(p.totalDilewati) : undefined],
    [t.jawabanBenarLabel, String(p.totalBenar)],
    [t.jawabanSalahLabel, String(p.totalSalah), p.salahIds.length ? t.belumDiperbaiki(p.salahIds.length) : undefined],
    [t.ketepatan, `${akurasi(p.totalBenar, p.totalDijawab)}%`],
    [t.waktuLatihan, dur(p.waktuDetik)],
    [t.totalSkor, String(p.skor), t.beruntunTerbaik(p.streakTerbaik)],
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-block bg-gradient-to-r from-[#1E40AF] to-[#0D9488] bg-clip-text text-xs font-bold uppercase tracking-[0.18em] text-transparent">{t.statEyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-tinta">{t.statJudul(p.nama)}</h1>
        </div>
        <Tombol onClick={keBeranda}>{t.mulaiLatihan}</Tombol>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {kartu.map(([k, v, ket]) => (
          <div key={k} className="rounded-2xl bg-white p-4 shadow-kartu sm:p-5">
            <div className="mb-3 h-1.5 w-10 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0D9488]" aria-hidden="true" />
            <p className="text-sm font-semibold text-redup">{k}</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-tinta">{v}</p>
            {ket && <p className="mt-1 text-xs text-redup">{ket}</p>}
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-kartu sm:p-6">
          <h2 className="text-lg font-bold text-tinta">{t.ketepatanTingkat}</h2>
          <div className="mt-4 grid gap-4">
            {(["mudah", "sedang", "sulit"] as Tingkat[]).map((x) => {
              const h = p.perTingkat[x];
              const a = akurasi(h.benar, h.dijawab);
              return (
                <div key={x}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-tinta">{t.tingkat[x]}</span>
                    <span className="tabular-nums text-redup">
                      {t.nBenarDari(h.benar, h.dijawab, a)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-halaman">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#1E40AF] to-[#14B8A6]" style={{ width: `${a}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="mt-8 text-lg font-bold text-tinta">{t.perKelas}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="text-xs uppercase tracking-wide text-redup">
                <tr>
                  <th className="py-2 font-semibold">{t.kolom.kelas}</th>
                  <th className="py-2 font-semibold">{t.dikerjakan}</th>
                  <th className="py-2 font-semibold">{t.benar}</th>
                  <th className="py-2 font-semibold">{t.ketepatan}</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((k) => {
                  const h = p.perKelas[k] ?? { dijawab: 0, benar: 0 };
                  return (
                    <tr key={k} className="border-t border-garis">
                      <td className="py-2 font-semibold">{t.kelasN(k)}</td>
                      <td className="py-2">{h.dijawab}</td>
                      <td className="py-2">{h.benar}</td>
                      <td className="py-2">{h.dijawab ? `${akurasi(h.benar, h.dijawab)}%` : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-kartu sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-tinta">{t.badgeJudul}</h2>
            <span className="text-sm tabular-nums text-redup">
              {t.nDari(dapat, DAFTAR_BADGE.length)}
            </span>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DAFTAR_BADGE.map((b) => {
              const aktif = !!p.badge[b.id];
              return (
                <li key={b.id} className={`flex items-center gap-3 rounded-xl border p-3 ${aktif ? "border-garis" : "border-dashed border-garis"}`}>
                  <IkonBadge badge={b} aktif={aktif} kecil />
                  <span className="min-w-0">
                    <span className={`block text-sm font-bold ${aktif ? "text-tinta" : "text-redup"}`}>{t.badge[b.id][0]}</span>
                    <span className="block text-xs text-redup">{aktif ? t.didapat(new Date(p.badge[b.id]).toLocaleDateString(locale)) : t.badge[b.id][1]}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-kartu sm:p-6">
        <h2 className="text-lg font-bold text-tinta">{t.riwayat}</h2>
        {p.riwayat.length === 0 ? (
          <p className="mt-3 text-sm text-redup">{t.riwayatKosong}</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm tabular-nums">
              <thead className="text-xs uppercase tracking-wide text-redup">
                <tr>
                  {t.kolomRiwayat.map((h) => (
                    <th key={h} className="py-2 pr-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.riwayat.map((r) => (
                  <tr key={r.id} className="border-t border-garis">
                    <td className="py-2 pr-3 whitespace-nowrap">{formatTanggal(r.tanggal, locale)}</td>
                    <td className="py-2 pr-3">{r.kelas}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{r.mode === "paket" ? (meta.paket.find((x) => x.id === r.paket)?.judul[bahasa] ?? t.modeNama.paket) : t.modeNama[r.mode]}</td>
                    <td className="py-2 pr-3">{t.tingkat[r.tingkat]}</td>
                    <td className="py-2 pr-3">{r.dijawab}</td>
                    <td className="py-2 pr-3 text-benar">{r.benar}</td>
                    <td className="py-2 pr-3 text-salah">{r.salah}</td>
                    <td className="py-2 pr-3">{akurasi(r.benar, r.dijawab)}%</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{dur(r.durasiDetik)}</td>
                    <td className="py-2 font-bold">{r.skor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-salah/30 bg-white p-5 sm:p-6">
        <div>
          <h2 className="font-bold text-tinta">{t.reset}</h2>
          <p className="text-sm text-redup">{t.resetKet}</p>
        </div>
        <Tombol varian="kedua" className="border-salah/40 text-salah hover:bg-salah-muda" onClick={() => setKonfirmasi(true)}>
          {t.reset}
        </Tombol>
      </section>

      {konfirmasi && (
        <Dialog judul={t.resetTanya} onTutup={() => setKonfirmasi(false)}>
          <p className="text-sm text-redup">
            {t.resetIsi}
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Tombol varian="kedua" onClick={() => setKonfirmasi(false)}>
              {t.batal}
            </Tombol>
            <Tombol
              varian="bahaya"
              onClick={() => {
                onReset();
                setKonfirmasi(false);
              }}
            >
              {t.yaHapus}
            </Tombol>
          </div>
        </Dialog>
      )}
    </main>
  );
}
