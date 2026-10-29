import { BAHASA, useBahasa } from "../i18n";
import AdeganMurid from "./AdeganMurid";

// Foto sampul opsional: letakkan file src/assets/sampul.jpg (atau .jpeg/.png/.webp).
// Jika ada, foto itu dipakai di sisi kanan; jika tidak, maskot lebah yang tampil.
const FOTO = Object.values(import.meta.glob("../assets/sampul.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" }))[0] as string | undefined;

// Banner bergaya sampul promosi: panel navy dengan ikon garis di kiri, pemisah chevron kuning–oranye,
// dan maskot lebah di kanan. Di layar sempit panel navy berada di atas dengan chevron mengarah ke bawah.
const CHEVRON_NAVY = "md:[clip-path:polygon(0_0,47%_0,54%_50%,47%_100%,0_100%)]";
const CHEVRON_KUNING = "md:[clip-path:polygon(0_0,51%_0,58%_50%,51%_100%,0_100%)]";
const CHEVRON_JINGGA = "md:[clip-path:polygon(0_0,54.5%_0,61.5%_50%,54.5%_100%,0_100%)]";

function Ikon({ d, className }: { d: string; className: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`absolute h-12 w-12 text-white/15 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
// Ikon garis: bohlam, penggaris, busur, topi wisuda, jaringan titik, Σ, π
const IKON = [
  { d: "M18 34h12M19 39h10M24 6a12 12 0 00-7 21.7c1.3 1 2 2.4 2 4V34h10v-2.3c0-1.6.7-3.1 2-4A12 12 0 0024 6z", c: "left-[36%] top-3 rotate-12" },
  { d: "M6 34L34 6l8 8-28 28zM12 28l3 3M17 23l4 4M22 18l3 3M27 13l4 4", c: "left-[2%] bottom-2 -rotate-6" },
  { d: "M6 36a18 18 0 0136 0zM24 36V22M14 36a10 10 0 0120 0", c: "left-[28%] bottom-1" },
  { d: "M4 18l20-9 20 9-20 9zM12 22v9c0 3 5 6 12 6s12-3 12-6v-9M44 18v12", c: "left-[38%] top-[52%] -rotate-12" },
  { d: "M12 12a3 3 0 100 .1M36 10a3 3 0 100 .1M26 36a3 3 0 100 .1M14 14l10 20M33 12l-6 22M15 12h18", c: "left-[1%] top-1" },
  { d: "M34 8H12l12 16-12 16h22", c: "left-[26%] top-2 rotate-6" },
  { d: "M8 14h32M16 14v24M32 14v18c0 4 2 6 5 6", c: "left-[37%] bottom-4 rotate-6" },
];

export default function SampulLebah({ onMulai, onPaket, jumlahSoal, jumlahPaket }: { onMulai: () => void; onPaket: () => void; jumlahSoal: number; jumlahPaket: number }) {
  const { t } = useBahasa();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:px-6 sm:pt-12">
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] shadow-kartu">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-conic-gradient(from_0deg_at_78%_42%,rgba(255,255,255,.45)_0deg_7deg,transparent_7deg_18deg)] [mask-image:radial-gradient(circle_at_78%_42%,#000_0%,transparent_65%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(59,130,246,.18),transparent_42%),radial-gradient(circle_at_95%_95%,rgba(56,189,248,.32),transparent_40%)]" aria-hidden="true" />
      {/* lapisan chevron (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        {FOTO && <img src={FOTO} alt="" className="absolute inset-y-0 right-0 h-full w-[52%] object-cover object-[50%_30%]" />}
        <div className={`absolute inset-0 bg-gradient-to-b from-[#7DD3FC] to-[#0284C7] ${CHEVRON_JINGGA}`} />
        <div className={`absolute inset-0 bg-gradient-to-b from-[#F3D27A] to-[#C9A13B] ${CHEVRON_KUNING}`} />
        <div className={`absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9] ${CHEVRON_NAVY}`}>
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#7DD3FC]/25 blur-3xl" />
          <div className="absolute -top-20 left-1/3 h-56 w-56 rounded-full bg-[#60A5FA]/25 blur-3xl" />
          {IKON.map((i) => (
            <Ikon key={i.c} d={i.d} className={i.c} />
          ))}
        </div>
      </div>

      <div className="relative grid md:min-h-[400px] md:grid-cols-[47%_53%]">
        {/* panel kiri */}
        <div className="relative bg-gradient-to-r from-[#C9A13B] via-[#38BDF8] to-[#0284C7] pb-3 [clip-path:polygon(0_0,100%_0,100%_calc(100%-28px),50%_100%,0_calc(100%-28px))] md:bg-none md:pb-0 md:[clip-path:none]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9] px-6 pb-16 pt-10 [clip-path:polygon(0_0,100%_0,100%_calc(100%-40px),50%_calc(100%-6px),0_calc(100%-40px))] sm:px-10 md:h-full md:bg-none md:pb-12 md:pr-4 md:pt-12 md:[clip-path:none]">
            <div className="md:hidden" aria-hidden="true">
              {IKON.slice(0, 4).map((i, k) => (
                <Ikon key={i.c} d={i.d} className={["right-4 top-6", "right-20 bottom-14", "left-1/2 top-4", "right-6 top-1/2"][k]} />
              ))}
            </div>
            <div className="relative max-w-sm">
              <h1 className="font-extrabold uppercase leading-[0.95] tracking-tight">
                <span className="block text-5xl text-white md:text-[2.75rem]">{t.bannerBaris1}</span>
                <span className="block bg-gradient-to-r from-[#FDE68A] via-[#FEF9C3] to-[#E0F2FE] bg-clip-text pb-1 text-5xl text-transparent md:text-[2.75rem]">{t.bannerBaris2}</span>
              </h1>
              <p className="mt-3 text-lg font-semibold italic text-white/90">{t.bannerSub}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">{t.sampulIsi}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onMulai}
                  className="rounded-full bg-white px-7 py-3 text-base font-extrabold text-[#1E3A8A] shadow-[0_8px_24px_-10px_rgba(15,23,42,.6)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sigma/50"
                >
                  {t.bannerMulai}
                </button>
                {jumlahPaket > 0 && (
                  <button
                    type="button"
                    onClick={onPaket}
                    className="rounded-full border-2 border-white/70 bg-white/10 px-6 py-2.5 text-base font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-jingga/50"
                  >
                    {t.sampulPaket}
                  </button>
                )}
              </div>
              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-white">
                <li className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-navy" aria-hidden="true">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="10" cy="10" r="7.5" />
                      <path d="M2.5 10h15M10 2.5c2.2 2.2 2.2 12.8 0 15M10 2.5c-2.2 2.2-2.2 12.8 0 15" />
                    </svg>
                  </span>
                  olympicedu.netlify.app
                </li>
                <li className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#BAE6FD] to-[#38BDF8] text-[#0B1F4B]" aria-hidden="true">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M3 5h8M7 3v2M5 5c0 3 2 6 5 7M9 5c0 3-2 6-5 7M11 17l3.5-8 3.5 8M12.2 14.5h4.6" />
                    </svg>
                  </span>
                  {BAHASA.map((b) => b.label).join(" · ")}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* panel kanan: maskot */}
        <div className="relative flex items-center justify-center px-4 pb-8 pt-4 sm:px-6 md:pb-6 md:pl-14 md:pr-4 md:pt-20">
          <div className="absolute right-4 top-4 hidden items-center gap-2 rounded-full bg-white/80 py-1.5 pl-1.5 pr-4 shadow-kartu ring-1 ring-[#38BDF8]/30 sm:flex md:right-5 md:top-5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-navy to-utama text-lg font-extrabold text-sigma" aria-hidden="true">
              Σ
            </span>
            <span className="text-sm font-extrabold text-navy">Olympic Edu</span>
          </div>
          <div className="absolute left-4 top-2 z-10 grid h-24 w-24 place-items-center rounded-full bg-white text-center border-[5px] border-transparent shadow-kartu [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_180deg,#1E40AF,#38BDF8,#BAE6FD,#1E40AF)_border-box] md:left-0 md:top-6">
            <span>
              <span className="block bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] bg-clip-text text-3xl font-extrabold leading-none text-transparent tabular-nums">{jumlahSoal + jumlahPaket}</span>
              <span className="mt-1 block text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">{t.bannerSoal}</span>
            </span>
          </div>
          {FOTO ? (
            <img src={FOTO} alt={t.sampulFoto} className="aspect-[4/3] w-full rounded-2xl object-cover object-[50%_30%] md:sr-only" />
          ) : (
            <AdeganMurid label={t.sampulGambar} className="w-full max-w-[420px] md:max-w-none" />
          )}
        </div>
      </div>
    </section>
    </div>
  );
}
