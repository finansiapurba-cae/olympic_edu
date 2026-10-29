import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import IkonBadge from "./components/IkonBadge";
import Beranda from "./pages/Beranda";
import Latihan from "./pages/Latihan";
import Statistik from "./pages/Statistik";
import { periksaBadge, type Badge } from "./lib/badge";
import { PenyediaBahasa, useBahasa } from "./i18n";
import { muatProgres, progresBaru, simpanProgres } from "./lib/progres";
import type { PengaturanSesi, Progres } from "./types";

type Halaman = "beranda" | "latihan" | "statistik";

export default function App() {
  return (
    <PenyediaBahasa>
      <Aplikasi />
    </PenyediaBahasa>
  );
}

function Aplikasi() {
  const { t } = useBahasa();
  const [progres, setProgres] = useState<Progres>(muatProgres);
  const [halaman, setHalaman] = useState<Halaman>("beranda");
  const [pengaturan, setPengaturan] = useState<PengaturanSesi>({ kelas: 1, tingkat: "campuran", mode: "latihan", durasiMenit: 20 });
  const [kunciSesi, setKunciSesi] = useState(0);
  const [badgeBaru, setBadgeBaru] = useState<Badge[]>([]);

  const ubah = useCallback((fn: (p: Progres) => Progres) => setProgres(fn), []);

  // Simpan setiap perubahan dan periksa badge baru.
  useEffect(() => {
    const { progres: n, baru } = periksaBadge(progres);
    if (baru.length) {
      setProgres(n);
      setBadgeBaru((b) => [...b, ...baru]);
      return;
    }
    simpanProgres(progres);
  }, [progres]);

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
      <Navbar nama={progres.nama} onNama={(nama) => ubah((p) => ({ ...p, nama }))} halaman={halaman} onPindah={pindah} />
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
        />
      )}
      {halaman === "statistik" && <Statistik progres={progres} onReset={() => setProgres(progresBaru(progres.nama))} keBeranda={() => pindah("beranda")} />}

      <footer className="px-4 pb-10 pt-4 text-center text-xs text-redup">
        <span className="font-semibold text-tinta">Olympic Edu</span> · olympicedu.netlify.app · {t.footer}
      </footer>

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
