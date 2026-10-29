import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import BarKemajuan from "../components/BarKemajuan";
import Dialog from "../components/Dialog";
import MathText from "../components/MathText";
import Tombol from "../components/Tombol";
import { KATEGORI_OSN, meta, muatPaket, muatSoal } from "../data/bank";
import { useBahasa, type Kamus } from "../i18n";
import { POIN, akurasi, catatJawaban, catatLewati, kunciKelompok, mulaiPutaranBaru, salahUntukKelas, simpanSesi } from "../lib/progres";
import { acak, formatWaktu, pecahDurasi } from "../lib/util";
import type { Huruf, PengaturanSesi, Progres, Soal } from "../types";

const HURUF: Huruf[] = ["A", "B", "C", "D"];

interface StatSesi {
  dijawab: number;
  benar: number;
  salah: number;
  dilewati: number;
  skor: number;
}

export default function Latihan({
  pengaturan,
  progres,
  ubah,
  onUlang,
  onPengaturan,
  keBeranda,
  keStatistik,
}: {
  pengaturan: PengaturanSesi;
  progres: Progres;
  ubah: (fn: (p: Progres) => Progres) => void;
  onUlang: () => void;
  onPengaturan: (s: PengaturanSesi) => void;
  keBeranda: () => void;
  keStatistik: () => void;
}) {
  const { t, bahasa } = useBahasa();
  const { kelas, tingkat, mode, durasiMenit } = pengaturan;
  const kelompok = kunciKelompok(pengaturan);
  const paketMeta = mode === "paket" ? meta.paket.find((p) => p.id === pengaturan.paket) : undefined;
  const [pool, setPool] = useState<Soal[] | null>(null);
  const [antrean, setAntrean] = useState<Soal[]>([]);
  const [idx, setIdx] = useState(0);
  const [pilihan, setPilihan] = useState<Huruf | null>(null);
  const [diperiksa, setDiperiksa] = useState(false);
  const [sesi, setSesi] = useState<StatSesi>({ dijawab: 0, benar: 0, salah: 0, dilewati: 0, skor: 0 });
  const [detik, setDetik] = useState(0);
  const [ringkasan, setRingkasan] = useState(false);
  const [selesai, setSelesai] = useState<null | { alasan: "manual" | "waktu" | "habis" }>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const tersimpan = useRef(false);
  const progresAwal = useRef(progres);
  const kartuRef = useRef<HTMLDivElement>(null);

  // Muat soal dan susun antrean. Latihan biasa diacak dan melewati soal yang sudah dikerjakan pada putaran ini;
  // paket olimpiade dikerjakan berurutan mulai dari soal yang belum dikerjakan.
  useEffect(() => {
    let batal = false;
    const p = progresAwal.current;
    const siapkan = (isi: Soal[]) => {
      if (batal) return;
      setPool(isi);
      if (mode === "ulang") return setAntrean(acak(isi));
      const sudah = new Set(p.sudahDikerjakan[kelompok] ?? []);
      let sisa = isi.filter((s) => !sudah.has(s.id));
      if (!sisa.length) {
        ubah((q) => mulaiPutaranBaru(q, kelompok, false));
        sisa = isi;
      }
      setAntrean(mode === "paket" ? sisa : acak(sisa));
    };
    if (mode === "paket") {
      muatPaket(pengaturan.paket ?? "").then((pk) => siapkan(pk?.soal ?? []));
    } else {
      muatSoal(kelas).then((bank) => {
        if (mode === "ulang") {
          const ids = new Set(salahUntukKelas(p, kelas));
          siapkan(bank.filter((s) => ids.has(s.id)));
        } else if (mode === "osn") siapkan(bank.filter((s) => s.kategori === KATEGORI_OSN));
        else siapkan(tingkat === "campuran" ? bank : bank.filter((s) => s.tingkat === tingkat));
      });
    }
    return () => {
      batal = true;
    };
  }, [kelas, tingkat, mode, kelompok, ubah, pengaturan.paket]);

  const soal: Soal | undefined = antrean[idx];
  const berjalan = !!pool && !!soal && !selesai && !ringkasan;
  const batasDetik = mode === "simulasi" ? durasiMenit * 60 : null;

  useEffect(() => {
    if (!berjalan) return;
    const timer = setInterval(() => setDetik((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [berjalan]);

  const akhiri = useCallback((alasan: "manual" | "waktu" | "habis") => {
    setRingkasan(false);
    setSelesai({ alasan });
  }, []);

  useEffect(() => {
    if (batasDetik !== null && detik >= batasDetik && !selesai) akhiri("waktu");
  }, [detik, batasDetik, selesai, akhiri]);

  // Simpan riwayat sekali saat sesi selesai, atau saat pindah halaman di tengah sesi.
  const dataSesi = useRef({ sesi, detik });
  dataSesi.current = { sesi, detik };
  const simpanRiwayat = useCallback(() => {
    const { sesi: s, detik: d } = dataSesi.current;
    if (tersimpan.current || s.dijawab + s.dilewati === 0) return;
    tersimpan.current = true;
    ubah((p) =>
      simpanSesi(p, {
        id: `${Date.now()}`,
        tanggal: new Date().toISOString(),
        kelas,
        tingkat: mode === "latihan" || mode === "simulasi" ? tingkat : "campuran",
        mode,
        paket: pengaturan.paket,
        ...s,
        durasiDetik: d,
      }),
    );
  }, [ubah, kelas, tingkat, mode, pengaturan.paket]);
  useEffect(() => {
    if (selesai) simpanRiwayat();
  }, [selesai, simpanRiwayat]);
  useEffect(() => () => simpanRiwayat(), [simpanRiwayat]);

  const periksa = useCallback(() => {
    if (!soal || !pilihan || diperiksa || !pool) return;
    const benar = pilihan === soal.kunci;
    setDiperiksa(true);
    setSesi((s) => ({
      ...s,
      dijawab: s.dijawab + 1,
      benar: s.benar + (benar ? 1 : 0),
      salah: s.salah + (benar ? 0 : 1),
      skor: s.skor + (benar ? POIN[soal.tingkat] : 0),
    }));
    const ukuran = pool.length;
    ubah((p) => {
      let n = catatJawaban(p, soal, benar, mode, kelompok);
      if (mode !== "ulang" && (n.sudahDikerjakan[kelompok]?.length ?? 0) >= ukuran) n = mulaiPutaranBaru(n, kelompok, true);
      return n;
    });
    if (mode !== "ulang" && mode !== "paket") {
      const sudah = new Set(progres.sudahDikerjakan[kelompok] ?? []);
      sudah.add(soal.id);
      if (sudah.size >= ukuran) setPesan(t.tuntas(ukuran));
    }
  }, [soal, pilihan, diperiksa, pool, ubah, mode, kelompok, progres.sudahDikerjakan, t]);

  const lanjut = useCallback(
    (tanpaRingkasan = false) => {
      if (!pool) return;
      if (!tanpaRingkasan && diperiksa && sesi.dijawab > 0 && sesi.dijawab % 10 === 0 && idx + 1 < antrean.length) {
        setRingkasan(true);
        return;
      }
      setPilihan(null);
      setDiperiksa(false);
      setPesan(null);
      if (idx + 1 < antrean.length) {
        setIdx(idx + 1);
      } else if (mode === "ulang" || mode === "paket") {
        akhiri("habis");
        return;
      } else {
        // Antrean habis: isi lagi dengan soal yang belum dikerjakan di putaran baru.
        const sudah = new Set(progres.sudahDikerjakan[kelompok] ?? []);
        let sisa = pool.filter((s) => !sudah.has(s.id));
        if (!sisa.length) sisa = pool;
        let baru = acak(sisa);
        if (baru.length > 1 && baru[0].id === soal?.id) baru = [...baru.slice(1), baru[0]];
        setAntrean((a) => [...a, ...baru]);
        setIdx(idx + 1);
      }
      kartuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [pool, diperiksa, sesi.dijawab, idx, antrean.length, mode, akhiri, progres.sudahDikerjakan, kelompok, soal],
  );

  const lewati = useCallback(() => {
    if (!soal || diperiksa) return;
    setSesi((s) => ({ ...s, dilewati: s.dilewati + 1 }));
    ubah(catatLewati);
    setPilihan(null);
    if (antrean.length - idx <= 1) return; // hanya tersisa soal ini
    setAntrean((a) => [...a.slice(0, idx), ...a.slice(idx + 1), a[idx]]);
  }, [soal, diperiksa, ubah, antrean.length, idx]);

  // Pintasan papan ketik: A–D atau 1–4 memilih, Enter memeriksa / lanjut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName) || ringkasan || selesai || !soal) return;
      const k = e.key.toUpperCase();
      const i = HURUF.indexOf(k as Huruf) >= 0 ? HURUF.indexOf(k as Huruf) : ["1", "2", "3", "4"].indexOf(k);
      if (i >= 0 && !diperiksa) setPilihan(HURUF[i]);
      else if (e.key === "Enter" && el.tagName !== "BUTTON") {
        if (diperiksa) lanjut();
        else periksa();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ringkasan, selesai, soal, diperiksa, lanjut, periksa]);

  const kemajuan = useMemo(() => {
    if (!pool) return { nilai: 0, maks: 0 };
    if (mode === "ulang") return { nilai: Math.min(sesi.dijawab, pool.length), maks: pool.length };
    return { nilai: progres.sudahDikerjakan[kelompok]?.length ?? 0, maks: pool.length };
  }, [pool, mode, sesi.dijawab, progres.sudahDikerjakan, kelompok]);

  const salahKelas = salahUntukKelas(progres, kelas).length;
  const label = paketMeta ? paketMeta.judul[bahasa] : t.kelasN(kelas);
  const labelMode = mode === "latihan" || mode === "simulasi" ? t.tingkat[tingkat] : t.modeNama[mode];

  if (!pool) return <Bingkai><p className="py-16 text-center text-redup">{t.menyiapkan}</p></Bingkai>;

  if (!pool.length)
    return (
      <Bingkai>
        <div className="py-10 text-center">
          <h1 className="text-2xl font-bold text-tinta">{t.kosongJudul}</h1>
          <p className="mt-2 text-redup">{mode === "ulang" ? t.kosongUlang(kelas) : t.kosongLain}</p>
          <Tombol className="mt-6" onClick={keBeranda}>
            {t.keBeranda}
          </Tombol>
        </div>
      </Bingkai>
    );

  if (selesai) {
    const a = akurasi(sesi.benar, sesi.dijawab);
    const judul = selesai.alasan === "waktu" ? t.waktuHabis : selesai.alasan === "habis" ? (mode === "paket" ? t.paketSelesai : t.semuaDiulang) : t.latihanSelesai;
    return (
      <Bingkai>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-utama">
          {label} · {labelMode}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-tinta">{judul}</h1>
        <p className="mt-2 text-redup">{sesi.dijawab === 0 ? t.belumMenjawab : a >= 80 ? t.pujianTinggi(progres.nama) : a >= 50 ? t.pujianSedang : t.pujianRendah}</p>
        <RingkasanAngka sesi={sesi} detik={detik} t={t} />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Tombol onClick={onUlang}>{t.latihanLagi}</Tombol>
          <Tombol varian="kedua" disabled={!salahKelas || mode === "paket"} onClick={() => onPengaturan({ ...pengaturan, mode: "ulang", paket: undefined })}>
            {salahKelas && mode !== "paket" ? t.ulangiSalahN(salahKelas) : t.ulangiSalah}
          </Tombol>
          <Tombol varian="kedua" onClick={keStatistik}>
            {t.lihatStatistik}
          </Tombol>
          <Tombol varian="kedua" onClick={keBeranda}>
            {t.keBeranda}
          </Tombol>
        </div>
      </Bingkai>
    );
  }

  if (!soal) return null;
  const teks = soal.teks[bahasa];
  const benar = pilihan === soal.kunci;
  const sisaWaktu = batasDetik !== null ? batasDetik - detik : null;
  const nomorPaket = mode === "paket" ? pool.findIndex((s) => s.id === soal.id) + 1 : 0;

  return (
    <Bingkai refKartu={kartuRef}>
      <div className="flex flex-wrap items-center gap-2">
        <Chip>{label}</Chip>
        <Chip>{labelMode}</Chip>
        {mode !== "paket" && <Chip halus>{t.gaya(soal.kategori)}</Chip>}
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
              sisaWaktu !== null && sisaWaktu <= 60 ? "bg-salah-muda text-salah" : "bg-halaman text-tinta"
            }`}
            aria-label={sisaWaktu !== null ? t.sisaWaktu : t.waktuBerjalan}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 101.06-1.06l-2.78-2.78V5z" clipRule="evenodd" />
            </svg>
            {sisaWaktu !== null ? formatWaktu(sisaWaktu) : formatWaktu(detik)}
          </span>
          <Tombol varian="teks" className="px-3 py-1.5 text-sm" onClick={() => akhiri("manual")}>
            {t.selesai}
          </Tombol>
        </div>
      </div>

      <div className="mt-5">
        <BarKemajuan nilai={kemajuan.nilai} maks={kemajuan.maks} label={mode === "ulang" ? t.kemajuanUlang : t.kemajuanPutaran} />
      </div>

      <dl className="mt-4 grid grid-cols-4 gap-2 rounded-xl bg-gradient-to-r from-utama-muda via-[#EEF6FF] to-[#E0F2FE] p-3 text-center tabular-nums ring-1 ring-garis">
        {[
          [t.soal, sesi.dijawab + (diperiksa ? 0 : 1)],
          [t.benar, sesi.benar],
          [t.salah, sesi.salah],
          [t.skor, sesi.skor],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-redup">{k}</dt>
            <dd className="text-lg font-extrabold text-tinta">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <p className="text-sm font-semibold text-redup">
          {nomorPaket ? `${t.nomorSoal(nomorPaket, pool.length)} · ` : ""}
          {soal.topik[bahasa]} · {t.tingkat[soal.tingkat]} ({t.poin(POIN[soal.tingkat])})
        </p>
        <h1 className="mt-2 text-xl font-bold leading-relaxed text-tinta sm:text-2xl">
          <MathText text={teks.pertanyaan} />
        </h1>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.pilihanJawaban}>
        {HURUF.map((h) => {
          const dipilih = pilihan === h;
          const kunci = soal.kunci === h;
          let gaya = "border-garis bg-white hover:border-utama/50 hover:bg-utama-muda/50";
          let bulat = "bg-halaman text-tinta";
          if (!diperiksa && dipilih) {
            gaya = "border-utama bg-utama-muda ring-2 ring-utama/20";
            bulat = "bg-utama text-white";
          }
          if (diperiksa) {
            if (kunci) {
              gaya = "border-benar bg-benar-muda";
              bulat = "bg-benar text-white";
            } else if (dipilih) {
              gaya = "border-salah bg-salah-muda";
              bulat = "bg-salah text-white";
            } else gaya = "border-garis bg-white opacity-60";
          }
          return (
            <button
              key={h}
              type="button"
              role="radio"
              aria-checked={dipilih}
              disabled={diperiksa}
              onClick={() => setPilihan(h)}
              className={`flex min-h-[64px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-base font-semibold text-tinta transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-utama/25 disabled:cursor-default ${gaya}`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-extrabold ${bulat}`}>{h}</span>
              <MathText text={teks.pilihan[h]} className="min-w-0" />
            </button>
          );
        })}
      </div>

      {diperiksa && (
        <div className={`mt-6 rounded-xl border-l-4 p-4 sm:p-5 ${benar ? "border-benar bg-benar-muda" : "border-salah bg-salah-muda"}`} aria-live="polite">
          <p className={`text-lg font-extrabold ${benar ? "text-benar" : "text-salah"}`}>{benar ? t.benarPoin(POIN[soal.tingkat]) : t.belumTepat}</p>
          <p className="mt-1 text-tinta">
            {t.jawabanBenar} <strong>{soal.kunci}.</strong> <MathText text={teks.pilihan[soal.kunci]} className="font-semibold" />
          </p>
          <h2 className="mt-4 text-sm font-bold uppercase tracking-wide text-tinta">{t.pembahasan}</h2>
          <ol className="mt-2 grid gap-2">
            {teks.pembahasan.map((l, i) => (
              <li key={i} className="flex gap-3 leading-relaxed text-tinta">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-redup">{i + 1}</span>
                <MathText text={l} className="min-w-0" />
              </li>
            ))}
          </ol>
          {soal.koreksi && (
            <p className="mt-4 rounded-lg bg-white px-3 py-2 text-sm text-redup">
              <strong className="text-tinta">{t.catatanPerbaikan}:</strong> <MathText text={soal.koreksi[bahasa]} />
            </p>
          )}
          {pesan && <p className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-utama">{pesan}</p>}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {!diperiksa ? (
          <Tombol key="lewati" varian="kedua" onClick={lewati} className="w-full sm:w-auto">
            {t.lewati}
          </Tombol>
        ) : (
          <span className="hidden text-sm text-redup sm:inline">{t.nDijawab(sesi.dijawab)}</span>
        )}
        {!diperiksa ? (
          <Tombol key="periksa" onClick={periksa} disabled={!pilihan} className="w-full sm:w-auto sm:min-w-[180px]">
            {t.periksa}
          </Tombol>
        ) : (
          <Tombol key="lanjut" onClick={() => lanjut()} className="w-full sm:w-auto sm:min-w-[180px]">
            {t.berikutnya}
          </Tombol>
        )}
      </div>
      <p className="mt-4 hidden text-center text-xs text-redup sm:block">{t.tips}</p>

      {ringkasan && (
        <Dialog
          judul={t.ringkasanJudul(sesi.dijawab)}
          onTutup={() => {
            setRingkasan(false);
            lanjut(true);
          }}
        >
          <p className="text-sm text-redup">{t.ringkasanIsi(sesi.dijawab)}</p>
          <RingkasanAngka sesi={sesi} detik={detik} t={t} kecil />
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Tombol
              onClick={() => {
                setRingkasan(false);
                lanjut(true);
              }}
            >
              {t.lanjut}
            </Tombol>
            <Tombol varian="kedua" onClick={() => akhiri("manual")}>
              {t.selesaiDulu}
            </Tombol>
          </div>
        </Dialog>
      )}
    </Bingkai>
  );
}

function Bingkai({ children, refKartu }: { children: ReactNode; refKartu?: Ref<HTMLDivElement> }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div ref={refKartu} className="scroll-mt-4 rounded-3xl bg-white p-5 shadow-kartu sm:p-8">
        {children}
      </div>
    </main>
  );
}

function Chip({ children, halus }: { children: ReactNode; halus?: boolean }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${halus ? "bg-halaman text-redup" : "bg-utama-muda text-utama"}`}>{children}</span>;
}

function RingkasanAngka({ sesi, detik, t, kecil }: { sesi: StatSesi; detik: number; t: Kamus; kecil?: boolean }) {
  const isi: [string, string][] = [
    [t.soalDikerjakan, String(sesi.dijawab)],
    [t.benar, String(sesi.benar)],
    [t.salah, String(sesi.salah)],
    [t.ketepatan, `${akurasi(sesi.benar, sesi.dijawab)}%`],
    [t.waktu, t.durasi(...pecahDurasi(detik))],
    [t.skor, String(sesi.skor)],
  ];
  return (
    <>
      <dl className={`mt-5 grid grid-cols-2 gap-3 ${kecil ? "" : "sm:grid-cols-3"}`}>
        {isi.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-halaman p-3">
            <dt className="text-xs font-semibold text-redup">{k}</dt>
            <dd className="mt-0.5 text-xl font-extrabold tabular-nums text-tinta">{v}</dd>
          </div>
        ))}
      </dl>
      {sesi.dilewati > 0 && <p className="mt-3 text-sm text-redup">{t.nDilewati(sesi.dilewati)}</p>}
    </>
  );
}
