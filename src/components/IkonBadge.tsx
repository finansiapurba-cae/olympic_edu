import type { Badge } from "../lib/badge";

export default function IkonBadge({ badge, aktif, kecil }: { badge: Badge; aktif: boolean; kecil?: boolean }) {
  const ukuran = kecil ? "h-10 w-10 text-sm" : "h-14 w-14 text-lg";
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-extrabold ${ukuran} ${aktif ? "text-white" : "bg-garis text-redup/60"}`}
      style={aktif ? { background: badge.warna, boxShadow: `0 0 0 3px #fff, 0 0 0 5px ${badge.warna}55` } : undefined}
      aria-hidden="true"
    >
      {badge.simbol}
    </span>
  );
}
