export default function BarKemajuan({ nilai, maks, label }: { nilai: number; maks: number; label: string }) {
  const persen = maks ? Math.min(100, Math.round((nilai / maks) * 100)) : 0;
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs font-medium text-redup">
        <span>{label}</span>
        <span className="tabular-nums">
          {nilai} / {maks}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-utama-muda" role="progressbar" aria-valuemin={0} aria-valuemax={maks} aria-valuenow={nilai} aria-label={label}>
        <div className="h-full rounded-full bg-gradient-to-r from-[#1E40AF] to-[#38BDF8] transition-[width] duration-500" style={{ width: `${persen}%` }} />
      </div>
    </div>
  );
}
