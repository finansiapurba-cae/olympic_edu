import { BAHASA, useBahasa } from "../i18n";

type Halaman = "beranda" | "statistik";

export default function Navbar({
  nama,
  onNama,
  halaman,
  onPindah,
}: {
  nama: string;
  onNama: (v: string) => void;
  halaman: Halaman | "latihan";
  onPindah: (h: Halaman) => void;
}) {
  const { t, bahasa, setBahasa } = useBahasa();
  const link = (h: Halaman, label: string) => (
    <button
      type="button"
      onClick={() => onPindah(h)}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
        halaman === h ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
      aria-current={halaman === h ? "page" : undefined}
    >
      {label}
    </button>
  );
  return (
    <header className="bg-gradient-to-r from-[#1E3A8A] via-[#1D5FA6] to-[#0D9488] text-white" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <button type="button" onClick={() => onPindah("beranda")} className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-navy-700 to-utama text-2xl font-extrabold leading-none text-sigma ring-1 ring-white/15" aria-hidden="true">
            Σ
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight sm:text-lg">Olympic Edu</span>
            <span className="block text-xs font-medium text-white/60">{t.tagline}</span>
          </span>
        </button>
        <nav className="flex items-center gap-1" aria-label="Menu">
          {link("beranda", t.menuLatihan)}
          {link("statistik", t.menuStatistik)}
        </nav>
        <div className="ml-auto flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="flex rounded-lg bg-white/10 p-0.5" role="group" aria-label={t.pilihBahasa}>
            {BAHASA.map((b) => (
              <button
                key={b.kode}
                type="button"
                lang={b.kode === "zh" ? "zh-Hant" : b.kode}
                title={b.nama}
                aria-pressed={bahasa === b.kode}
                onClick={() => setBahasa(b.kode)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${
                  bahasa === b.kode ? "bg-gradient-to-r from-[#99F6E4] to-[#2DD4BF] text-[#0B1F4B]" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
            <span className="text-sm font-medium text-white/75">{t.namaPeserta}</span>
            <input
              id="nama-peserta"
              value={nama}
              onChange={(e) => onNama(e.target.value.slice(0, 40))}
              placeholder={t.tulisNama}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-sigma focus:outline-none focus:ring-2 focus:ring-sigma/40 sm:w-44 sm:flex-none"
            />
          </label>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-[#3B82F6] via-[#2DD4BF] to-[#C9A13B]" aria-hidden="true" />
    </header>
  );
}
