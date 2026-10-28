import { useEffect, useRef, type ReactNode } from "react";

/** Jendela dialog sederhana di tengah layar. */
export default function Dialog({ judul, children, onTutup }: { judul: string; children: ReactNode; onTutup?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onTutup?.();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onTutup]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 p-4" role="dialog" aria-modal="true" aria-label={judul}>
      <div ref={ref} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-kartu">
        <h2 className="mb-3 text-xl font-bold text-tinta">{judul}</h2>
        {children}
      </div>
    </div>
  );
}
