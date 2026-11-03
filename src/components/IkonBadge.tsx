import type { Badge } from "../lib/badge";

// Badge berbentuk sel sarang lebah (segi enam), seperti desain aplikasi.
const SEGI_ENAM = "polygon(50% 0, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)";

export default function IkonBadge({ badge, aktif, kecil }: { badge: Badge; aktif: boolean; kecil?: boolean }) {
  const ukuran = kecil ? "h-11 w-10 text-sm" : "h-16 w-14 text-lg";
  return (
    <span
      className={`grid shrink-0 place-items-center font-extrabold ${ukuran} ${aktif ? "text-white" : "bg-[#E2E8F0] text-[#94A3B8]"}`}
      style={{ clipPath: SEGI_ENAM, ...(aktif ? { background: badge.warna } : {}) }}
      aria-hidden="true"
    >
      {aktif ? badge.simbol : "🔒"}
    </span>
  );
}
