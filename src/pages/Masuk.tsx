import { useState, type FormEvent } from "react";
import Tombol from "../components/Tombol";
import { BAHASA, useBahasa } from "../i18n";
import { AkunError, daftar, masuk, rapikanUsername, usernameSah, type Sesi } from "../lib/akun";
import type { Kelas } from "../types";

type Mode = "masuk" | "daftar";

export default function Masuk({ onMasuk }: { onMasuk: (s: Sesi) => void }) {
  const { t, bahasa, setBahasa } = useBahasa();
  const [mode, setMode] = useState<Mode>("masuk");
  const [username, setUsername] = useState("");
  const [sandi, setSandi] = useState("");
  const [sandi2, setSandi2] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState<Kelas>(1);
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState(false);

  const ganti = (m: Mode) => {
    setMode(m);
    setGalat("");
  };

  const kirim = async (e: FormEvent) => {
    e.preventDefault();
    setGalat("");
    const u = rapikanUsername(username);
    if (mode === "daftar") {
      if (!usernameSah(u)) return setGalat(t.akunGalat.formatUsername);
      if (!nama.trim()) return setGalat(t.akunGalat.namaKosong);
      if (sandi.length < 6) return setGalat(t.akunGalat.sandiPendek);
      if (sandi !== sandi2) return setGalat(t.akunGalat.sandiBeda);
    }
    setProses(true);
    try {
      onMasuk(mode === "daftar" ? await daftar(u, sandi, nama, kelas) : await masuk(u, sandi));
    } catch (err) {
      setGalat(t.akunGalat[err instanceof AkunError ? err.kode : "lain"]);
    } finally {
      setProses(false);
    }
  };

  const kolom = "w-full rounded-xl border border-garis bg-white px-4 py-3 text-base text-tinta placeholder:text-redup/70 focus:border-utama focus:outline-none focus:ring-4 focus:ring-utama/15";

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

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-kartu sm:p-8">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-halaman p-1" role="tablist">
            {(["masuk", "daftar"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => ganti(m)}
                className={`rounded-lg py-2 text-sm font-bold transition-colors ${mode === m ? "bg-white text-utama shadow" : "text-redup hover:text-tinta"}`}
              >
                {m === "masuk" ? t.akunMasuk : t.akunDaftar}
              </button>
            ))}
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-tinta">
            <span aria-hidden="true">🐝 </span>
            {mode === "masuk" ? t.akunJudulMasuk : t.akunJudulDaftar}
          </h1>
          <p className="mt-1 text-sm text-redup">{mode === "masuk" ? t.akunIsiMasuk : t.akunIsiDaftar}</p>

          <form className="mt-5 grid gap-4" onSubmit={kirim} noValidate>
            {mode === "daftar" && (
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-tinta">{t.akunNama}</span>
                <input className={kolom} value={nama} onChange={(e) => setNama(e.target.value.slice(0, 40))} autoComplete="name" placeholder={t.akunNamaContoh} />
              </label>
            )}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-tinta">{t.akunUsername}</span>
              <input
                className={kolom}
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="budi.4a"
                name="username"
              />
              {mode === "daftar" && <span className="text-xs text-redup">{t.akunUsernameAturan}</span>}
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-tinta">{t.akunSandi}</span>
              <div className="relative">
                <input
                  className={`${kolom} pr-20`}
                  type={lihat ? "text" : "password"}
                  value={sandi}
                  onChange={(e) => setSandi(e.target.value)}
                  autoComplete={mode === "masuk" ? "current-password" : "new-password"}
                  name="password"
                />
                <button type="button" onClick={() => setLihat((v) => !v)} className="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-2 text-xs font-bold text-utama hover:bg-halaman">
                  {lihat ? t.akunSembunyi : t.akunLihat}
                </button>
              </div>
              {mode === "daftar" && <span className="text-xs text-redup">{t.akunSandiAturan}</span>}
            </label>
            {mode === "daftar" && (
              <>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold text-tinta">{t.akunSandi2}</span>
                  <input className={kolom} type={lihat ? "text" : "password"} value={sandi2} onChange={(e) => setSandi2(e.target.value)} autoComplete="new-password" />
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
              </>
            )}

            {galat && (
              <p role="alert" className="rounded-xl bg-salah-muda px-4 py-3 text-sm font-semibold text-salah">
                {galat}
              </p>
            )}

            <Tombol type="submit" disabled={proses} className="w-full py-3.5 text-base">
              {proses ? t.akunMenunggu : mode === "masuk" ? t.akunMasuk : t.akunDaftar}
            </Tombol>
          </form>

          <p className="mt-5 text-center text-sm text-redup">
            {mode === "masuk" ? t.akunBelumPunya : t.akunSudahPunya}{" "}
            <button type="button" className="font-bold text-utama hover:underline" onClick={() => ganti(mode === "masuk" ? "daftar" : "masuk")}>
              {mode === "masuk" ? t.akunDaftar : t.akunMasuk}
            </button>
          </p>
          {mode === "masuk" && <p className="mt-2 text-center text-xs text-redup">{t.akunLupa}</p>}
        </div>
      </main>
    </div>
  );
}
