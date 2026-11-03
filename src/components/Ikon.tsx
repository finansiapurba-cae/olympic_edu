// Ikon garis sederhana yang dipakai di menu dan tombol (gaya desain aplikasi).
const JALUR = {
  rumah: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  paket: "M12 2l9 5v10l-9 5-9-5V7z",
  statistik: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  profil: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  guru: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6",
  kembali: "M15 18l-6-6 6-6",
  jam: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2 2M9 2h6",
  pesan: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  bendera: "M5 21V4h11l-1.5 4L16 12H5",
  centang: "M5 12l5 5 9-10",
  silang: "M6 6l12 12M18 6L6 18",
  piala: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3",
  bola: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  buku: "M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13",
  keluar: "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3",
  unduh: "M12 3v12M7 10l5 5 5-5M4 21h16",
  gambar: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6",
};
export type NamaIkon = keyof typeof JALUR;

export default function Ikon({ nama, className = "h-5 w-5", tebal = 2 }: { nama: NamaIkon; className?: string; tebal?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={JALUR[nama]} />
    </svg>
  );
}
