import { useEffect } from "react";
import { useBahasa } from "../i18n";
import { alamatVideo, sampulVideo } from "../data/video";
import Ikon from "./Ikon";

/** Video pembahasan layar penuh (tegak, seperti video HP). */
export default function PemutarVideo({ soalId, onTutup }: { soalId: string; onTutup: () => void }) {
  const { t, bahasa } = useBahasa();
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onTutup();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onTutup]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1220]/95 p-3" role="dialog" aria-modal="true" aria-label={t.videoJudul}>
      <button
        type="button"
        onClick={onTutup}
        aria-label={t.masukanTutup}
        className="absolute right-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <Ikon nama="silang" className="h-6 w-6" tebal={2.5} />
      </button>
      <video
        key={bahasa}
        src={alamatVideo(soalId, bahasa)}
        poster={sampulVideo(soalId)}
        controls
        autoPlay
        playsInline
        className="max-h-[88vh] w-auto max-w-full rounded-3xl bg-black shadow-2xl"
        style={{ aspectRatio: "9 / 16" }}
      />
      <p className="mt-3 text-sm font-semibold text-white/70">{t.videoJudul}</p>
    </div>
  );
}
