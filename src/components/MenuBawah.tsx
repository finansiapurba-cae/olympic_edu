import Ikon, { type NamaIkon } from "./Ikon";
import { useBahasa } from "../i18n";

export type TujuanMenu = "beranda" | "paket" | "statistik" | "guru" | "profil";

/** Menu bawah ala aplikasi Android, hanya di layar HP. */
export default function MenuBawah({ aktif, guru, onPilih }: { aktif: TujuanMenu | null; guru: boolean; onPilih: (t: TujuanMenu) => void }) {
  const { t } = useBahasa();
  const isi: [TujuanMenu, NamaIkon, string][] = [
    ["beranda", "rumah", t.menuLatihan],
    ["paket", "paket", t.menuPaket],
    ["statistik", "statistik", t.menuStatistik],
    ...(guru ? ([["guru", "guru", t.menuGuru]] as [TujuanMenu, NamaIkon, string][]) : []),
    ["profil", "profil", t.menuProfil],
  ];
  return (
    <nav
      aria-label="Menu"
      className="fixed inset-x-0 bottom-0 z-30 grid border-t border-garis bg-white/95 px-2 pt-1.5 backdrop-blur sm:hidden"
      style={{ gridTemplateColumns: `repeat(${isi.length}, minmax(0, 1fr))`, paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
    >
      {isi.map(([id, ikon, label]) => {
        const nyala = aktif === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onPilih(id)}
            aria-current={nyala ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-1 text-xs ${nyala ? "font-extrabold text-utama" : "font-semibold text-redup"}`}
          >
            <span className={`grid h-8 w-14 place-items-center rounded-full ${nyala ? "bg-[#DBEAFE]" : ""}`}>
              <Ikon nama={ikon} className="h-[22px] w-[22px]" tebal={nyala ? 2.3 : 2} />
            </span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
