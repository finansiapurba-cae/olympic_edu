import { useId, useState, type ReactNode } from "react";

/** Bagian yang bisa dibuka dan ditutup. */
export default function Lipat({ judul, keterangan, children }: { judul: string; keterangan?: string; children: ReactNode }) {
  const [buka, setBuka] = useState(false);
  const id = useId();
  return (
    <div className="rounded-xl border border-garis bg-white">
      <button
        type="button"
        aria-expanded={buka}
        aria-controls={id}
        onClick={() => setBuka(!buka)}
        className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left hover:bg-halaman"
      >
        <span>
          <span className="block font-semibold text-tinta">{judul}</span>
          {keterangan && <span className="block text-sm text-redup">{keterangan}</span>}
        </span>
        <svg className={`h-5 w-5 shrink-0 text-redup transition-transform ${buka ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      <div id={id} hidden={!buka} className="border-t border-garis px-4 py-4 text-sm leading-relaxed text-tinta">
        {children}
      </div>
    </div>
  );
}
