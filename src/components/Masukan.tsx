import { useState } from "react";
import Dialog from "./Dialog";
import Tombol from "./Tombol";
import { useBahasa } from "../i18n";
import { kirimMasukan, type JenisMasukan, type Sesi } from "../lib/akun";

const JENIS: JenisMasukan[] = ["saran", "masalah", "soal", "lainnya"];
const WAJAH = ["😞", "🙁", "😐", "🙂", "😍"];

/** Jendela untuk mengirim saran, laporan masalah, atau laporan soal yang salah. */
export default function Masukan({ sesi, soalId, halaman, onTutup }: { sesi: Sesi; soalId?: string; halaman: string; onTutup: () => void }) {
  const { t, bahasa } = useBahasa();
  const [jenis, setJenis] = useState<JenisMasukan>(soalId ? "soal" : "saran");
  const [nilai, setNilai] = useState<number | null>(null);
  const [pesan, setPesan] = useState("");
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState(false);
  const [terkirim, setTerkirim] = useState(false);

  const kirim = async () => {
    setGalat("");
    if (!pesan.trim()) return setGalat(t.masukanKosong);
    setProses(true);
    try {
      await kirimMasukan(sesi, { jenis, nilai, pesan, soalId, halaman, bahasa });
      setTerkirim(true);
    } catch {
      setGalat(t.masukanGagal);
    } finally {
      setProses(false);
    }
  };

  if (terkirim)
    return (
      <Dialog judul={t.masukanJudul} onTutup={onTutup}>
        <p className="text-center text-4xl" aria-hidden="true">
          🐝💛
        </p>
        <p className="mt-3 text-center font-semibold text-tinta">{t.masukanTerima}</p>
        <Tombol className="mt-5 w-full" onClick={onTutup}>
          {t.masukanTutup}
        </Tombol>
      </Dialog>
    );

  return (
    <Dialog judul={t.masukanJudul} onTutup={onTutup}>
      <p className="text-sm text-redup">{t.masukanIsi}</p>
      <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label={t.masukanJudul}>
        {JENIS.map((j) => (
          <button
            key={j}
            type="button"
            role="radio"
            aria-checked={jenis === j}
            onClick={() => setJenis(j)}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${jenis === j ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white" : "bg-halaman text-tinta hover:bg-[#E0F2FE]"}`}
          >
            {t.masukanJenis[j]}
          </button>
        ))}
      </div>
      {soalId && <p className="mt-3 rounded-lg bg-halaman px-3 py-2 text-xs font-semibold text-redup">{t.masukanSoal(soalId)}</p>}

      <p className="mt-4 text-sm font-semibold text-tinta">{t.masukanNilai}</p>
      <div className="mt-2 flex justify-between gap-1" role="radiogroup" aria-label={t.masukanNilai}>
        {WAJAH.map((w, i) => (
          <button
            key={w}
            type="button"
            role="radio"
            aria-checked={nilai === i + 1}
            aria-label={`${i + 1}/5`}
            onClick={() => setNilai(nilai === i + 1 ? null : i + 1)}
            className={`grid h-11 flex-1 place-items-center rounded-xl text-2xl transition ${nilai === i + 1 ? "bg-[#FEF3C7] ring-2 ring-sigma" : "bg-halaman opacity-70 hover:opacity-100"}`}
          >
            {w}
          </button>
        ))}
      </div>

      <label className="mt-4 grid gap-1.5">
        <span className="text-sm font-semibold text-tinta">{t.masukanPesan}</span>
        <textarea
          value={pesan}
          onChange={(e) => setPesan(e.target.value.slice(0, 2000))}
          rows={4}
          placeholder={t.masukanContoh}
          className="w-full resize-y rounded-xl border border-garis bg-white px-4 py-3 text-base text-tinta placeholder:text-redup/70 focus:border-utama focus:outline-none focus:ring-4 focus:ring-utama/15"
        />
        <span className="text-right text-xs text-redup">{pesan.length}/2000</span>
      </label>

      {galat && (
        <p role="alert" className="mt-2 rounded-xl bg-salah-muda px-4 py-3 text-sm font-semibold text-salah">
          {galat}
        </p>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Tombol varian="kedua" onClick={onTutup}>
          {t.batal}
        </Tombol>
        <Tombol onClick={kirim} disabled={proses}>
          {proses ? t.akunMenunggu : t.masukanKirim}
        </Tombol>
      </div>
    </Dialog>
  );
}
