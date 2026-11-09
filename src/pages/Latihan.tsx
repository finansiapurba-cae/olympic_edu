import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import BarKemajuan from "../components/BarKemajuan";
import Dialog from "../components/Dialog";
import MathText from "../components/MathText";
import Tombol from "../components/Tombol";
import Visualisasi from "../components/Visualisasi";
import Ikon from "../components/Ikon";
import PemutarVideo from "../components/PemutarVideo";
import { punyaVideo } from "../data/video";
import { KATEGORI_OSN, meta, muatPaket, muatSoal } from "../data/bank";
import { useBahasa, type Kamus } from "../i18n";
import { POIN, akurasi, catatJawaban, catatLewati, kunciKelompok, mulaiPutaranBaru, salahUntukKelas, simpanSesi } from "../lib/progres";
import { acak, formatWaktu, pecahDurasi } from "../lib/util";
import { kirimHasil } from "../lib/kirimHasil";
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
  onLaporkan,
  onJawab,
}: {
  pengaturan: PengaturanSesi;
  progres: Progres;
  ubah: (fn: (p: Progres) => Progres) => void;
  onUlang: () => void;
  onPengaturan: (s: PengaturanSesi) => void;
  keBeranda: () => void;
  keStatistik: () => void;
  /** membuka jendela masukan untuk melaporkan soal ini (hanya bila murid masuk dengan akun) */
  onLaporkan?: (soalId: string) => void;
  /** dipanggil setiap jawaban diperiksa, untuk catatan dashboard guru */
  onJawab?: (soal: Soal, pilihan: Huruf, benar: boolean) => void;
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
  const [video, setVideo] = useState<string | null>(null);
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
  const dataSesi = useRef({ sesi, detik, nama: progres.nama, bahasa });
  dataSesi.current = { sesi, detik, nama: progres.nama, bahasa };
  const simpanRiwayat = useCallback(() => {
    const { sesi: s, detik: d, nama, bahasa: b } = dataSesi.current;
    if (tersimpan.current || s.dijawab + s.dilewati === 0) return;
    tersimpan.current = true;
    const r = {
      id: `${Date.now()}`,
      tanggal: new Date().toISOString(),
      kelas,
      tingkat: mode === "latihan" || mode === "simulasi" ? tingkat : ("campuran" as const),
      mode,
      paket: pengaturan.paket,
      ...s,
      durasiDetik: d,
    };
    ubah((p) => simpanSesi(p, r));
    kirimHasil(r, nama, b);
  }, [ubah, kelas, tingkat, mode, pengaturan.paket]);
  useEffect(() => {
    if (selesai) simpanRiwayat();
  }, [selesai, simpanRiwayat]);
  useEffect(() => () => simpanRiwayat(), [simpanRiwayat]);

  // Satu soal hanya boleh diperiksa sekali, walau Enter ditekan dua kali sebelum layar sempat diperbarui.
  const terakhirDiperiksa = useRef<string | null>(null);
  const periksa = useCallback(() => {
    if (!soal || !pilihan || diperiksa || !pool) return;
    const giliran = `${idx}:${soal.id}`;
    if (terakhirDiperiksa.current === giliran) return;
    terakhirDiperiksa.current = giliran;
    const benar = pilihan === soal.kunci;
    setDiperiksa(true);
    onJawab?.(soal, pilihan, benar);
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
  }, [soal, pilihan, diperiksa, pool, ubah, mode, kelompok, progres.sudahDikerjakan, t, onJawab, idx]);

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
      if (e.repeat || ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName) || ringkasan || selesai || !soal) return;
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

  // Jawaban pendek (angka, pecahan) muat dua kolom di HP; kalimat panjang satu kolom.
  const pendek = HURUF.every((h) => teks.pilihan[h].replace(/\$[^$]*\$/g, "xxxxx").length <= 14);

  return (
    <BingkaiSoal refKartu={kartuRef}>
      <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-garis bg-white px-4 pb-3 sm:static sm:mx-0 sm:mb-5 sm:border-0 sm:bg-transparent sm:p-0" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={keBeranda} aria-label={t.kembali} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F1F5F9] text-tinta hover:bg-[#E2E8F0]">
            <Ikon nama="kembali" className="h-[22px] w-[22px]" tebal={2.3} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-redup">
              {label} · {labelMode}
            </p>
            <p className="truncate text-base font-extrabold text-tinta">{nomorPaket ? t.nomorSoal(nomorPaket, pool.length) : `${t.soal} ${sesi.dijawab + (diperiksa ? 0 : 1)}`}</p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-extrabold tabular-nums ${
              sisaWaktu !== null && sisaWaktu <= 60 ? "bg-salah-muda text-salah" : "bg-[#F1F5F9] text-tinta"
            }`}
            aria-label={sisaWaktu !== null ? t.sisaWaktu : t.waktuBerjalan}
          >
            <Ikon nama="jam" className="h-4 w-4" tebal={2.3} />
            {sisaWaktu !== null ? formatWaktu(sisaWaktu) : formatWaktu(detik)}
          </span>
          <Tombol varian="teks" className="shrink-0 px-2.5 py-2 text-sm" onClick={() => akhiri("manual")}>
            {t.selesai}
          </Tombol>
        </div>
        <div className="mt-3">
          <BarKemajuan nilai={kemajuan.nilai} maks={kemajuan.maks} label={mode === "ulang" ? t.kemajuanUlang : t.kemajuanPutaran} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip>{soal.topik[bahasa]}</Chip>
        <span className="rounded-full bg-[#FFF4D6] px-3 py-1 text-xs font-extrabold text-[#92400E]">
          {t.tingkat[soal.tingkat]} · {t.poin(POIN[soal.tingkat])}
        </span>
        {mode !== "paket" && <Chip halus>{t.gaya(soal.kategori)}</Chip>}
        <span className="ml-auto text-xs font-bold tabular-nums text-redup" aria-label={`${t.benar} ${sesi.benar}, ${t.salah} ${sesi.salah}, ${t.skor} ${sesi.skor}`}>
          <span className="text-benar">✓ {sesi.benar}</span> · <span className="text-salah">✗ {sesi.salah}</span> · {sesi.skor}
        </span>
      </div>

      <h1 className="mt-3 text-xl font-extrabold leading-snug tracking-[-0.01em] text-tinta sm:text-2xl">
        <MathText text={teks.pertanyaan} />
      </h1>
      {(teks.visual ?? soal.visual) && <Visualisasi spes={(teks.visual ?? soal.visual)!} tampil={diperiksa} />}

      {diperiksa && (
        <div className={`mt-5 flex items-center gap-3 rounded-2xl p-3.5 ${benar ? "bg-benar-muda" : "bg-salah-muda"}`} aria-live="polite">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white ${benar ? "bg-benar" : "bg-salah"}`}>
            <Ikon nama={benar ? "centang" : "silang"} className="h-6 w-6" tebal={3} />
          </span>
          <div className="min-w-0">
            <p className={`text-lg font-extrabold ${benar ? "text-benar" : "text-salah"}`}>{benar ? t.benarHebat : t.belumTepat}</p>
            <p className="text-sm text-tinta">{benar ? (progres.streak > 1 ? t.beruntunN(progres.streak) : t.benarPoin(POIN[soal.tingkat])) : t.belumTepatSub}</p>
          </div>
        </div>
      )}

      {diperiksa && punyaVideo(soal.id) && (
        <button
          type="button"
          onClick={() => setVideo(soal.id)}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-tinta p-3 text-left text-white shadow-kartu hover:bg-[#16243F]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F2B53A] text-[#3B2600]">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg>
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold">{t.videoTonton}</span>
            <span className="block text-sm text-white/70">{t.videoKet}</span>
          </span>
        </button>
      )}
      <div className={`mt-5 grid gap-2.5 ${pendek ? "grid-cols-2" : "sm:grid-cols-2"}`} role="radiogroup" aria-label={t.pilihanJawaban}>
        {HURUF.map((h) => {
          const dipilih = pilihan === h;
          const kunci = soal.kunci === h;
          let gaya = "border-[1.5px] border-[#CBD5E1] bg-white hover:border-utama/50 hover:bg-utama-muda/40";
          let bulat = "bg-[#F1F5F9] text-tinta";
          if (!diperiksa && dipilih) {
            gaya = "border-[2.5px] border-[#2563EB] bg-[#EFF6FF]";
            bulat = "bg-[#2563EB] text-white";
          }
          if (diperiksa) {
            if (kunci) {
              gaya = "border-[2.5px] border-benar bg-benar-muda";
              bulat = "bg-benar text-white";
            } else if (dipilih) {
              gaya = "border-[2.5px] border-salah bg-salah-muda";
              bulat = "bg-salah text-white";
            } else gaya = "border-[1.5px] border-garis bg-white opacity-60";
          }
          return (
            <button
              key={h}
              type="button"
              role="radio"
              aria-checked={dipilih}
              disabled={diperiksa}
              onClick={() => setPilihan(h)}
              className={`flex min-h-[60px] items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-base font-bold text-tinta transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-utama/25 disabled:cursor-default ${gaya}`}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-sm font-extrabold ${bulat}`}>{h}</span>
              <MathText text={teks.pilihan[h]} className="min-w-0" />
            </button>
          );
        })}
      </div>

      {video && <PemutarVideo soalId={video} onTutup={() => setVideo(null)} />}

      {diperiksa && (
        <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-garis sm:p-5">
          {!benar && (
            <p className="mb-3 text-tinta">
              {t.jawabanBenar} <strong>{soal.kunci}.</strong> <MathText text={teks.pilihan[soal.kunci]} className="font-semibold" />
            </p>
          )}
          <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-redup">{t.pembahasan}</h2>
          <ol className="mt-3 grid gap-2.5">
            {teks.pembahasan.map((l, i) => (
              <li key={i} className="flex gap-3 leading-relaxed text-tinta">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-xs font-extrabold text-utama">{i + 1}</span>
                <MathText text={l} className="min-w-0" />
              </li>
            ))}
          </ol>
          {soal.koreksi && (
            <p className="mt-4 rounded-lg bg-halaman px-3 py-2 text-sm text-redup">
              <strong className="text-tinta">{t.catatanPerbaikan}:</strong> <MathText text={soal.koreksi[bahasa]} />
            </p>
          )}
          {pesan && <p className="mt-4 rounded-lg bg-halaman px-3 py-2 text-sm font-semibold text-utama">{pesan}</p>}
        </div>
      )}

      <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex items-center gap-2.5 border-t border-garis bg-white px-4 pt-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
        {!diperiksa ? (
          <>
            <Tombol key="lewati" varian="kedua" onClick={lewati} className="h-14 rounded-2xl px-5">
              {t.lewati}
            </Tombol>
            <Tombol key="periksa" onClick={periksa} disabled={!pilihan} className="h-14 flex-1 rounded-2xl text-base font-extrabold sm:ml-auto sm:max-w-[240px]">
              {t.periksa}
            </Tombol>
          </>
        ) : (
          <>
            {onLaporkan && (
              <button type="button" onClick={() => onLaporkan(soal.id)} aria-label={t.laporkanSoal} title={t.laporkanSoal} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-[1.5px] border-[#CBD5E1] bg-white text-[#475569] hover:bg-halaman">
                <Ikon nama="bendera" className="h-[22px] w-[22px]" />
              </button>
            )}
            <span className="hidden text-sm text-redup sm:inline">{t.nDijawab(sesi.dijawab)}</span>
            <Tombol key="lanjut" onClick={() => lanjut()} className="h-14 flex-1 rounded-2xl text-base font-extrabold sm:ml-auto sm:max-w-[240px]">
              {t.berikutnya}
            </Tombol>
          </>
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
    </BingkaiSoal>
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

/** Layar soal: di HP tanpa kartu (layar penuh seperti aplikasi), di layar lebar tetap kartu putih. */
function BingkaiSoal({ children, refKartu }: { children: ReactNode; refKartu?: Ref<HTMLDivElement> }) {
  return (
    <main className="mx-auto w-full max-w-3xl sm:px-6 sm:py-10">
      <div ref={refKartu} className="scroll-mt-4 bg-halaman px-4 sm:rounded-3xl sm:bg-white sm:p-8 sm:shadow-kartu">
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
