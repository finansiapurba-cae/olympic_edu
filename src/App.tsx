import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import IkonBadge from "./components/IkonBadge";
import Beranda from "./pages/Beranda";
import Latihan from "./pages/Latihan";
import Statistik from "./pages/Statistik";
import Masuk, { LengkapiProfil } from "./pages/Masuk";
import Masukan from "./components/Masukan";
import { AKUN_AKTIF, AkunError, ambilProgresAkun, keluar, muatSesi, simpanProgresAkun, type Sesi } from "./lib/akun";
import { periksaBadge, type Badge } from "./lib/badge";
import { PenyediaBahasa, useBahasa } from "./i18n";
import { muatProgres, progresBaru, simpanProgres } from "./lib/progres";
import { SHEET_URL } from "./lib/kirimHasil";
import type { PengaturanSesi, Progres } from "./types";

type Halaman = "beranda" | "latihan" | "statistik";

export default function App() {
  return (
    <PenyediaBahasa>
      <Gerbang />
    </PenyediaBahasa>
  );
}

const banyakKerja = (p: Progres) => p.totalDijawab + p.totalDilewati;

/** Bila fitur akun aktif, murid harus masuk (atau daftar) dulu sebelum berlatih. */
function Gerbang() {
  const { t } = useBahasa();
  const [sesi, setSesi] = useState<Sesi | null>(muatSesi);
  const [awal, setAwal] = useState<Progres | null>(null);

  // Ambil progres dari server: yang lebih banyak isinya (server atau perangkat ini) dipakai.
  const muatDariServer = useCallback(async (s: Sesi, lokal: Progres) => {
    try {
      const { sesi: segar, progres: server } = await ambilProgresAkun(s);
      // Nama yang baru saja diisi di "Lengkapi profil" tidak boleh tertimpa.
      setSesi((lama) => (lama && lama.nama ? { ...segar, nama: lama.nama, kelas: lama.kelas } : segar));
      const pakai = server && banyakKerja(server) >= banyakKerja(lokal) ? { ...lokal, ...server } : lokal;
      setAwal({ ...pakai, nama: segar.nama });
    } catch (e) {
      if (e instanceof AkunError && e.kode === "salahMasuk") {
        keluar(s);
        setSesi(null);
        setAwal(null);
      } else setAwal({ ...lokal, nama: s.nama }); // tanpa internet: lanjut dengan progres di perangkat
    }
  }, []);

  // Sudah masuk dari kunjungan sebelumnya: tunggu progres dari server dulu.
  const sudahCek = useRef(false);
  useEffect(() => {
    if (sudahCek.current || !sesi || awal) return;
    sudahCek.current = true;
    muatDariServer(sesi, muatProgres(sesi.id));
  }, [sesi, awal, muatDariServer]);

  if (!AKUN_AKTIF) return <Aplikasi />;
  if (!sesi)
    return (
      <Masuk
        onMasuk={(s) => {
          sudahCek.current = true;
          setSesi(s);
          setAwal(null);
          // Akun baru memakai progres yang sudah ada di perangkat ini (jika ada).
          const lokal = muatProgres(s.id);
          muatDariServer(s, banyakKerja(lokal) ? lokal : muatProgres());
        }}
      />
    );
  if (!sesi.nama)
    return (
      <LengkapiProfil
        sesi={sesi}
        onSelesai={(s) => {
          setSesi(s);
          setAwal((p) => (p ? { ...p, nama: s.nama } : p));
        }}
        onKeluar={() => {
          keluar(sesi);
          sudahCek.current = false;
          setSesi(null);
          setAwal(null);
        }}
      />
    );
  if (!awal)
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9] text-lg font-bold text-white">
        <span>
          <span aria-hidden="true">🐝 </span>
          {t.akunMemuat}
        </span>
      </div>
    );
  return (
    <Aplikasi
      key={sesi.id}
      sesi={sesi}
      awal={awal}
      onSesi={setSesi}
      onKeluar={() => {
        keluar(sesi);
        sudahCek.current = false;
        setSesi(null);
        setAwal(null);
      }}
    />
  );
}

function Aplikasi({ sesi, awal, onSesi, onKeluar }: { sesi?: Sesi; awal?: Progres; onSesi?: (s: Sesi) => void; onKeluar?: () => void } = {}) {
  const { t } = useBahasa();
  const [progres, setProgres] = useState<Progres>(() => awal ?? muatProgres());
  const [gagalSimpan, setGagalSimpan] = useState(false);
  const [masukan, setMasukan] = useState<{ soalId?: string } | null>(null);
  const [halaman, setHalaman] = useState<Halaman>("beranda");
  const [pengaturan, setPengaturan] = useState<PengaturanSesi>({ kelas: 1, tingkat: "campuran", mode: "latihan", durasiMenit: 20 });
  const [kunciSesi, setKunciSesi] = useState(0);
  const [badgeBaru, setBadgeBaru] = useState<Badge[]>([]);

  const ubah = useCallback((fn: (p: Progres) => Progres) => setProgres(fn), []);
  // Nama di progres selalu mengikuti nama akun.
  useEffect(() => {
    if (sesi?.nama) setProgres((p) => (p.nama === sesi.nama ? p : { ...p, nama: sesi.nama }));
  }, [sesi?.nama]);

  // Simpan setiap perubahan dan periksa badge baru.
  useEffect(() => {
    const { progres: n, baru } = periksaBadge(progres);
    if (baru.length) {
      setProgres(n);
      setBadgeBaru((b) => [...b, ...baru]);
      return;
    }
    simpanProgres(progres, sesi?.id);
  }, [progres, sesi?.id]);

  // Progres akun dikirim ke server 1,5 detik setelah perubahan terakhir, dan saat tab ditutup/disembunyikan.
  const sesiRef = useRef(sesi);
  sesiRef.current = sesi;
  const progresRef = useRef(progres);
  progresRef.current = progres;
  const tertunda = useRef(false);
  const kirimKeServer = useCallback(() => {
    const s = sesiRef.current;
    if (!s || !tertunda.current) return;
    tertunda.current = false;
    simpanProgresAkun(s, progresRef.current)
      .then((baru) => {
        setGagalSimpan(false);
        if (baru !== s) onSesi?.(baru);
      })
      .catch(() => {
        tertunda.current = true;
        setGagalSimpan(true);
      });
  }, [onSesi]);
  const pertama = useRef(true);
  useEffect(() => {
    if (!sesi) return;
    if (pertama.current) {
      pertama.current = false;
      return;
    }
    tertunda.current = true;
    const id = setTimeout(kirimKeServer, 1500);
    return () => clearTimeout(id);
  }, [progres, sesi, kirimKeServer]);
  useEffect(() => {
    if (!sesi) return;
    const sembunyi = () => document.visibilityState === "hidden" && kirimKeServer();
    document.addEventListener("visibilitychange", sembunyi);
    window.addEventListener("pagehide", kirimKeServer);
    return () => {
      document.removeEventListener("visibilitychange", sembunyi);
      window.removeEventListener("pagehide", kirimKeServer);
    };
  }, [sesi, kirimKeServer]);

  useEffect(() => {
    if (!badgeBaru.length) return;
    const t = setTimeout(() => setBadgeBaru((b) => b.slice(1)), 4000);
    return () => clearTimeout(t);
  }, [badgeBaru]);

  const pindah = (h: Halaman) => {
    setHalaman(h);
    window.scrollTo({ top: 0 });
  };
  const mulai = (s: PengaturanSesi) => {
    setPengaturan(s);
    setKunciSesi((k) => k + 1);
    pindah("latihan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-halaman to-[#E6F4FF] font-sans text-tinta">
      <Navbar
        nama={progres.nama}
        onNama={(nama) => ubah((p) => ({ ...p, nama }))}
        akun={sesi ? { username: sesi.username, onKeluar: () => { kirimKeServer(); onKeluar?.(); }, onMasukan: () => setMasukan({}) } : undefined}
        halaman={halaman}
        onPindah={pindah}
      />
      {gagalSimpan && <p className="bg-[#FEF3C7] px-4 py-2 text-center text-sm font-semibold text-[#92400E]">{t.akunGagalSimpan}</p>}
      {halaman === "beranda" && <Beranda progres={progres} awal={pengaturan} onMulai={mulai} />}
      {halaman === "latihan" && (
        <Latihan
          key={kunciSesi}
          pengaturan={pengaturan}
          progres={progres}
          ubah={ubah}
          onUlang={() => mulai(pengaturan.mode === "ulang" ? { ...pengaturan, mode: "latihan" } : pengaturan)}
          onPengaturan={mulai}
          keBeranda={() => pindah("beranda")}
          keStatistik={() => pindah("statistik")}
          onLaporkan={sesi ? (soalId) => setMasukan({ soalId }) : undefined}
        />
      )}
      {halaman === "statistik" && <Statistik progres={progres} onReset={() => setProgres(progresBaru(progres.nama))} keBeranda={() => pindah("beranda")} />}

      <footer className="px-4 pb-10 pt-4 text-center text-xs text-redup">
        <span className="font-semibold text-tinta">Olympic Edu</span> · olympicedu.netlify.app · {SHEET_URL ? t.footerKirim : t.footer}
      </footer>

      {masukan && sesi && <Masukan sesi={sesi} soalId={masukan.soalId} halaman={halaman} onTutup={() => setMasukan(null)} />}

      {badgeBaru[0] && (
        <div
          className="fixed right-4 z-40 flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9] p-4 text-white shadow-kartu ring-2 ring-[#7DD3FC]"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
          role="status"
        >
          <IkonBadge badge={badgeBaru[0]} aktif kecil />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-sigma">{t.badgeBaru}</p>
            <p className="font-bold">{t.badge[badgeBaru[0].id][0]}</p>
            <p className="text-sm text-white/75">{t.badge[badgeBaru[0].id][1]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
