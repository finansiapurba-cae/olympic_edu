import type { ButtonHTMLAttributes } from "react";

type Varian = "utama" | "kedua" | "bahaya" | "teks";
const GAYA: Record<Varian, string> = {
  utama: "bg-gradient-to-r from-utama via-[#2563EB] to-[#0891B2] text-white shadow-[0_8px_20px_-10px_rgba(33,74,155,.9)] hover:from-utama-gelap hover:via-utama hover:to-[#0E7490] disabled:opacity-45 disabled:shadow-none",
  kedua: "border border-garis bg-white text-tinta hover:border-utama/40 hover:bg-utama-muda disabled:text-redup/60 disabled:hover:bg-white",
  bahaya: "bg-salah text-white hover:bg-salah/90",
  teks: "text-utama hover:bg-utama-muda",
};

export default function Tombol({ varian = "utama", className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { varian?: Varian }) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-utama/30 disabled:cursor-not-allowed ${GAYA[varian]} ${className}`}
    />
  );
}
