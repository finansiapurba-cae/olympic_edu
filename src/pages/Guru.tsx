import { useCallback, useEffect, useMemo, useState } from "react";
import MathText from "../components/MathText";
import Ikon from "../components/Ikon";
import { meta, muatPaket, muatSoal } from "../data/bank";
import { useBahasa } from "../i18n";
import { ambilDataGuru, type BarisJawaban, type BarisMasukan, type BarisProgres, type Sesi } from "../lib/akun";
import type { Huruf, Kelas, Soal } from "../types";

type Periode = "7" | "30" | "semua";
type Tab = "murid" | "soal" | "masukan";

interface RingkasMurid {
  user_id: string;
  username: string;
  nama: string;
  kelas: number | null;
  dijawab: number;
  benar: number;
  salah: number;
  terakhir: string | null;
}

const persen = (b: number, n: number) => (n ? Math.round((b / n) * 100) : 0);
// Excel tidak menyimpan zona waktu: geser ke jam lokal agar sama dengan yang terlihat di dashboard.
const waktuLokal = (w: string) => {
  const d = new Date(w);
  return { value: new Date(d.getTime() - d.getTimezoneOffset() * 60_000), format: "dd/mm/yyyy hh:mm" };
};

/** Rumus KaTeX menjadi teks biasa untuk Excel. */
function polos(s: string) {
  return s
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdots|\\ldots/g, "…")
    .replace(/\\pi/g, "π")
    .replace(/\\square/g, "□")
    .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
    .replace(/\^\{([^{}]*)\}/g, "^$1")
    .replace(/\{,\}/g, ",")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}$]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Guru({ sesi, onSesi }: { sesi: Sesi; onSesi: (s: Sesi) => void }) {
  const { t, bahasa, locale } = useBahasa();
  const g = t.guru;
  const [periode, setPeriode] = useState<Periode>("30");
  const [kelasFilter, setKelasFilter] = useState<number | "semua">("semua");
  const [cari, setCari] = useState("");
  const [tab, setTab] = useState<Tab>("murid");
  const [dipilih, setDipilih] = useState<string | null>(null);
  const [data, setData] = useState<{ murid: BarisProgres[]; jawaban: BarisJawaban[]; masukan: BarisMasukan[] } | null>(null);
  const [galat, setGalat] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [soalMap, setSoalMap] = useState<Map<string, Soal>>(new Map());
  const [mengekspor, setMengekspor] = useState(false);

  const muat = useCallback(async () => {
    setMemuat(true);
    setGalat("");
    try {
      const sejak = periode === "semua" ? null : new Date(Date.now() - Number(periode) * 86_400_000).toISOString();
      const hasil = await ambilDataGuru(sesi, sejak);
      if (hasil.sesi !== sesi) onSesi(hasil.sesi);
      setData({ murid: hasil.murid, jawaban: hasil.jawaban, masukan: hasil.masukan });
    } catch {
      setGalat(g.gagalMuat);
    } finally {
      setMemuat(false);
    }
  }, [periode, sesi, onSesi, g.gagalMuat]);

  useEffect(() => {
    muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periode]);

  // Muat teks soal yang muncul di catatan jawaban (per kelas dan per paket).
  useEffect(() => {
    if (!data) return;
    const kelasPerlu = new Set<Kelas>(), paketPerlu = new Set<string>();
    for (const j of data.jawaban) {
      if (soalMap.has(j.soal_id)) continue;
      if (j.paket) paketPerlu.add(j.paket);
      else if (j.soal_kelas >= 1 && j.soal_kelas <= 6) kelasPerlu.add(j.soal_kelas as Kelas);
    }
    if (!kelasPerlu.size && !paketPerlu.size) return;
    (async () => {
      const baru = new Map(soalMap);
      for (const k of kelasPerlu) for (const s of await muatSoal(k)) baru.set(s.id, s);
      for (const p of paketPerlu) for (const s of (await muatPaket(p))?.soal ?? []) baru.set(s.id, s);
      setSoalMap(baru);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const cocokFilter = useCallback(
    (kelas: number | null, nama: string, username: string) =>
      (kelasFilter === "semua" || kelas === kelasFilter) && (!cari.trim() || `${nama} ${username}`.toLowerCase().includes(cari.trim().toLowerCase())),
    [kelasFilter, cari],
  );

  const jawaban = useMemo(() => (data?.jawaban ?? []).filter((j) => cocokFilter(j.kelas, j.nama ?? "", j.username)), [data, cocokFilter]);

  const murid = useMemo<RingkasMurid[]>(() => {
    const peta = new Map<string, RingkasMurid>();
    for (const m of data?.murid ?? []) {
      peta.set(m.user_id, { user_id: m.user_id, username: m.username, nama: m.nama || m.username, kelas: m.kelas, dijawab: 0, benar: 0, salah: 0, terakhir: null });
    }
    for (const j of data?.jawaban ?? []) {
      let m = peta.get(j.user_id);
      if (!m) peta.set(j.user_id, (m = { user_id: j.user_id, username: j.username, nama: j.nama || j.username, kelas: j.kelas, dijawab: 0, benar: 0, salah: 0, terakhir: null }));
      m.dijawab++;
      if (j.benar) m.benar++;
      else m.salah++;
      if (!m.terakhir || j.waktu > m.terakhir) m.terakhir = j.waktu;
    }
    return [...peta.values()].filter((m) => cocokFilter(m.kelas, m.nama, m.username)).sort((a, b) => b.salah - a.salah || a.nama.localeCompare(b.nama));
  }, [data, cocokFilter]);

  const soalSalah = useMemo(() => {
    const peta = new Map<string, { soal_id: string; dijawab: number; salah: number; murid: Map<string, string>; topik: string; kunci: string }>();
    for (const j of jawaban) {
      let s = peta.get(j.soal_id);
      if (!s) peta.set(j.soal_id, (s = { soal_id: j.soal_id, dijawab: 0, salah: 0, murid: new Map(), topik: j.topik, kunci: j.kunci }));
      s.dijawab++;
      if (!j.benar) {
        s.salah++;
        s.murid.set(j.user_id, j.nama || j.username);
      }
    }
    return [...peta.values()].filter((s) => s.salah > 0).sort((a, b) => b.salah - a.salah || b.murid.size - a.murid.size);
  }, [jawaban]);

  const masukan = useMemo(() => (data?.masukan ?? []).filter((m) => cocokFilter(m.kelas, m.nama ?? "", m.username ?? "")), [data, cocokFilter]);

  const total = jawaban.length, totalBenar = jawaban.filter((j) => j.benar).length;
  const aktif = new Set(jawaban.map((j) => j.user_id)).size;
  const fmtWaktu = (w: string | null) => (w ? new Date(w).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "–");
  const teksSoal = (id: string) => soalMap.get(id)?.teks[bahasa];
  const opsi = (id: string, h: string) => {
    const tx = teksSoal(id)?.pilihan[h as Huruf];
    return tx ? `${h}. ${tx}` : h;
  };
  const namaPaket = (id: string | null) => (id ? meta.paket.find((p) => p.id === id)?.judul[bahasa] ?? id : "");

  const unduhExcel = async () => {
    setMengekspor(true);
    try {
      const { default: writeXlsxFile } = await import("write-excel-file/browser");
      const kepala = (xs: string[]) => xs.map((value) => ({ value, fontWeight: "bold" as const, backgroundColor: "#DBEAFE" }));
      const teksP = (id: string) => polos(teksSoal(id)?.pertanyaan ?? "");
      const opsiP = (id: string, h: string) => polos(opsi(id, h));
      const barisJawaban = (xs: BarisJawaban[]) => [
        kepala(g.xJawabanKolom),
        ...xs.map((j) => [
          waktuLokal(j.waktu),
          j.nama || j.username,
          j.username,
          j.kelas ?? "",
          j.soal_id,
          namaPaket(j.paket),
          j.topik,
          t.tingkat[j.tingkat as "mudah"] ?? j.tingkat,
          teksP(j.soal_id),
          opsiP(j.soal_id, j.pilihan),
          opsiP(j.soal_id, j.kunci),
          j.benar ? g.benar : g.salah,
        ]),
      ];
      const sheets = [
        {
          sheet: g.xMurid,
          data: [kepala(g.xMuridKolom), ...murid.map((m) => [m.nama, m.username, m.kelas ?? "", m.dijawab, m.benar, m.salah, persen(m.benar, m.dijawab), m.terakhir ? waktuLokal(m.terakhir) : ""])],
          columns: [{ width: 24 }, { width: 16 }, { width: 7 }, { width: 10 }, { width: 9 }, { width: 9 }, { width: 13 }, { width: 18 }],
          stickyRowsCount: 1,
        },
        { sheet: g.xSalah, data: barisJawaban(jawaban.filter((j) => !j.benar)), columns: KOLOM_JAWABAN, stickyRowsCount: 1 },
        { sheet: g.xSemua, data: barisJawaban(jawaban), columns: KOLOM_JAWABAN, stickyRowsCount: 1 },
        {
          sheet: g.xSoal,
          data: [kepala(g.xSoalKolom), ...soalSalah.map((s) => [s.soal_id, s.topik, teksP(s.soal_id), opsiP(s.soal_id, s.kunci), s.salah, s.dijawab, [...s.murid.values()].join(", ")])],
          columns: [{ width: 14 }, { width: 18 }, { width: 60 }, { width: 24 }, { width: 10 }, { width: 10 }, { width: 40 }],
          stickyRowsCount: 1,
        },
        {
          sheet: g.xMasukan,
          data: [kepala(g.xMasukanKolom), ...masukan.map((m) => [waktuLokal(m.dibuat), m.nama ?? "", m.username ?? "", m.kelas ?? "", t.masukanJenis[m.jenis as "saran"] ?? m.jenis, m.nilai ?? "", m.soal_id ?? "", m.pesan])],
          columns: [{ width: 18 }, { width: 22 }, { width: 16 }, { width: 7 }, { width: 16 }, { width: 8 }, { width: 14 }, { width: 60 }],
          stickyRowsCount: 1,
        },
      ];
      const tgl = new Date().toISOString().slice(0, 10);
      await writeXlsxFile(sheets).toFile(`olympic-edu-${tgl}.xlsx`);
    } finally {
      setMengekspor(false);
    }
  };

  const terpilih = murid.find((m) => m.user_id === dipilih);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl bg-tinta p-5 text-white sm:p-7">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#F2B53A]">{g.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{g.judul}</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/70">{g.isi}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={muat} disabled={memuat} className="h-11 rounded-xl border border-white/25 px-4 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50">
            ↻ {memuat ? t.akunMenunggu : g.muatUlang}
          </button>
          <button type="button" onClick={unduhExcel} disabled={!data || mengekspor} className="flex h-11 items-center gap-2 rounded-xl bg-[#F2B53A] px-4 text-sm font-extrabold text-[#3B2600] hover:bg-[#F5C25A] disabled:opacity-50">
            <Ikon nama="unduh" className="h-[18px] w-[18px]" tebal={2.4} />
            {mengekspor ? t.akunMenunggu : g.unduh}
          </button>
        </div>
      </div>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-kartu">
        <div className="flex rounded-xl bg-halaman p-1" role="group" aria-label={g.periode}>
          {(["7", "30", "semua"] as Periode[]).map((p) => (
            <button key={p} type="button" aria-pressed={periode === p} onClick={() => setPeriode(p)} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${periode === p ? "bg-white text-utama shadow" : "text-redup"}`}>
              {g.periodeNama[p]}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-tinta">
          {t.akunKelas}
          <select id="guru-kelas" value={kelasFilter} onChange={(e) => setKelasFilter(e.target.value === "semua" ? "semua" : Number(e.target.value))} className="rounded-lg border border-garis bg-white px-3 py-1.5 text-sm">
            <option value="semua">{g.semua}</option>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <input id="guru-cari" value={cari} onChange={(e) => setCari(e.target.value)} placeholder={g.cari} className="min-w-0 flex-1 rounded-lg border border-garis bg-white px-3 py-2 text-sm sm:max-w-xs" />
      </section>

      {galat && <p className="mt-4 rounded-xl bg-salah-muda px-4 py-3 text-sm font-semibold text-salah">{galat}</p>}

      <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [g.kartuMurid, String(murid.length)],
          [g.kartuAktif, String(aktif)],
          [g.kartuJawaban, String(total)],
          [g.kartuKetepatan, `${persen(totalBenar, total)}%`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white p-4 shadow-kartu">
            <p className="text-sm font-semibold text-redup">{k}</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-tinta">{v}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 flex gap-2 border-b border-garis" role="tablist">
        {(["murid", "soal", "masukan"] as Tab[]).map((x) => (
          <button key={x} type="button" role="tab" aria-selected={tab === x} onClick={() => setTab(x)} className={`-mb-px border-b-2 px-4 py-2 text-sm font-bold ${tab === x ? "border-utama text-utama" : "border-transparent text-redup hover:text-tinta"}`}>
            {g.tab[x]}
            {x === "masukan" && masukan.length ? ` (${masukan.length})` : ""}
          </button>
        ))}
      </div>

      {!data && !galat && <p className="mt-6 text-sm text-redup">{t.akunMemuat}</p>}

      {data && tab === "murid" && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="overflow-x-auto rounded-2xl bg-white shadow-kartu">
            <table className="w-full min-w-[480px] text-left text-sm tabular-nums">
              <thead className="text-xs uppercase tracking-wide text-redup">
                <tr>
                  {g.kolomMurid.map((h) => (
                    <th key={h} className="px-3 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {murid.map((m) => (
                  <tr key={m.user_id} onClick={() => setDipilih(m.user_id)} className={`cursor-pointer border-t border-garis hover:bg-halaman ${dipilih === m.user_id ? "bg-[#EFF6FF]" : ""}`}>
                    <td className="px-3 py-2.5">
                      <button type="button" className="text-left font-bold text-tinta hover:text-utama" onClick={() => setDipilih(m.user_id)}>
                        {m.nama}
                      </button>
                      <span className="block text-xs text-redup">@{m.username}</span>
                    </td>
                    <td className="px-3 py-2.5">{m.kelas ?? "–"}</td>
                    <td className="px-3 py-2.5">{m.dijawab}</td>
                    <td className={`px-3 py-2.5 font-bold ${m.salah ? "text-salah" : "text-redup"}`}>{m.salah}</td>
                    <td className="px-3 py-2.5">{m.dijawab ? `${persen(m.benar, m.dijawab)}%` : "–"}</td>
                    <td className="px-3 py-2.5 text-xs text-redup">{fmtWaktu(m.terakhir)}</td>
                  </tr>
                ))}
                {!murid.length && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-redup">
                      {g.kosongMurid}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-kartu">
            {!terpilih ? (
              <p className="text-sm text-redup">{g.pilihMurid}</p>
            ) : (
              <DetailMurid
                m={terpilih}
                jawaban={jawaban.filter((j) => j.user_id === terpilih.user_id)}
                teksSoal={teksSoal}
                opsi={opsi}
                fmtWaktu={fmtWaktu}
              />
            )}
          </div>
        </div>
      )}

      {data && tab === "soal" && (
        <div className="mt-4 grid gap-3">
          {!soalSalah.length && <p className="text-sm text-redup">{g.kosongSoal}</p>}
          {soalSalah.slice(0, 100).map((s) => (
            <article key={s.soal_id} className="rounded-2xl bg-white p-5 shadow-kartu">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-redup">
                <span className="rounded-full bg-salah-muda px-2.5 py-1 text-salah">{g.nSalah(s.salah, s.dijawab)}</span>
                <span>{s.soal_id}</span>
                <span>· {s.topik}</span>
              </div>
              <p className="mt-2 font-semibold text-tinta">{teksSoal(s.soal_id) ? <MathText text={teksSoal(s.soal_id)!.pertanyaan} /> : s.soal_id}</p>
              <p className="mt-2 text-sm text-benar">
                {g.kunci}: <MathText text={opsi(s.soal_id, s.kunci)} />
              </p>
              <p className="mt-1 text-sm text-redup">
                {g.muridSalah}: {[...s.murid.values()].join(", ")}
              </p>
            </article>
          ))}
        </div>
      )}

      {data && tab === "masukan" && (
        <div className="mt-4 grid gap-3">
          {!masukan.length && <p className="text-sm text-redup">{g.kosongMasukan}</p>}
          {masukan.map((m) => (
            <article key={m.id} className="rounded-2xl bg-white p-5 shadow-kartu">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-redup">
                <span className="rounded-full bg-halaman px-2.5 py-1 text-tinta">{t.masukanJenis[m.jenis as "saran"] ?? m.jenis}</span>
                <span>
                  {m.nama} @{m.username}
                </span>
                {m.nilai ? <span>· {"★".repeat(m.nilai)}</span> : null}
                {m.soal_id ? <span>· {m.soal_id}</span> : null}
                <span>· {fmtWaktu(m.dibuat)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-tinta">{m.pesan}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

const KOLOM_JAWABAN = [{ width: 17 }, { width: 22 }, { width: 16 }, { width: 7 }, { width: 14 }, { width: 22 }, { width: 18 }, { width: 9 }, { width: 60 }, { width: 24 }, { width: 24 }, { width: 9 }];

function DetailMurid({
  m,
  jawaban,
  teksSoal,
  opsi,
  fmtWaktu,
}: {
  m: RingkasMurid;
  jawaban: BarisJawaban[];
  teksSoal: (id: string) => Soal["teks"]["id"] | undefined;
  opsi: (id: string, h: string) => string;
  fmtWaktu: (w: string | null) => string;
}) {
  const { t } = useBahasa();
  const g = t.guru;
  const topik = useMemo(() => {
    const peta = new Map<string, { n: number; salah: number }>();
    for (const j of jawaban) {
      const x = peta.get(j.topik) ?? { n: 0, salah: 0 };
      x.n++;
      if (!j.benar) x.salah++;
      peta.set(j.topik, x);
    }
    return [...peta.entries()].filter(([, x]) => x.salah > 0).sort((a, b) => b[1].salah - a[1].salah).slice(0, 8);
  }, [jawaban]);
  const salah = jawaban.filter((j) => !j.benar);
  // Soal yang sama dijawab salah berkali-kali (misalnya lewat "Ulangi yang salah") cukup tampil sekali, dengan jumlahnya.
  const salahPerSoal = useMemo(() => {
    const peta = new Map<string, { j: BarisJawaban; kali: number; pilihan: Set<string> }>();
    for (const j of salah) {
      const x = peta.get(j.soal_id);
      if (x) {
        x.kali++;
        x.pilihan.add(j.pilihan);
      } else peta.set(j.soal_id, { j, kali: 1, pilihan: new Set([j.pilihan]) });
    }
    return [...peta.values()];
  }, [salah]);

  return (
    <div>
      <h2 className="text-xl font-extrabold text-tinta">{m.nama}</h2>
      <p className="text-sm text-redup">
        @{m.username} · {t.akunKelas} {m.kelas ?? "–"} · {g.ringkas(m.dijawab, m.benar, m.salah)}
      </p>

      {topik.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-redup">{g.topikLemah}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {topik.map(([nama, x]) => (
              <li key={nama} className="rounded-full bg-salah-muda px-3 py-1 text-xs font-bold text-salah">
                {nama}: {x.salah}/{x.n}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-redup">{g.daftarSalah(salahPerSoal.length, salah.length)}</h3>
      {!salah.length && <p className="mt-2 text-sm text-redup">{g.belumSalah}</p>}
      <ol className="mt-2 grid gap-3">
        {salahPerSoal.slice(0, 60).map(({ j, kali, pilihan }) => {
          const tx = teksSoal(j.soal_id);
          return (
            <li key={j.soal_id} className="rounded-xl border border-garis p-3">
              <p className="flex flex-wrap items-center gap-x-1.5 text-xs font-semibold text-redup">
                {fmtWaktu(j.waktu)} · {j.soal_id} · {j.topik}
                {kali > 1 && <span className="rounded-full bg-salah-muda px-2 py-0.5 font-extrabold text-salah">{g.kaliSalah(kali)}</span>}
              </p>
              <p className="mt-1 text-sm font-semibold text-tinta">{tx ? <MathText text={tx.pertanyaan} /> : j.soal_id}</p>
              <p className="mt-2 text-sm text-salah">
                ✗ {g.jawabanMurid}:{" "}
                {[...pilihan].map((h, i) => (
                  <span key={h}>
                    {i > 0 && ", "}
                    <MathText text={opsi(j.soal_id, h)} />
                  </span>
                ))}
              </p>
              <p className="text-sm text-benar">
                ✓ {g.kunci}: <MathText text={opsi(j.soal_id, j.kunci)} />
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
