export function acak<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatWaktu(detik: number) {
  const d = Math.max(0, Math.floor(detik));
  const j = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), s = d % 60;
  const mm = String(m).padStart(2, "0"), ss = String(s).padStart(2, "0");
  return j ? `${j}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Memecah detik menjadi [jam, sisa menit, detik] untuk teks durasi di kamus bahasa. */
export function pecahDurasi(detik: number): [number, number, number] {
  const m = Math.floor(detik / 60);
  return [Math.floor(m / 60), m % 60, Math.floor(detik)];
}

export function formatTanggal(iso: string, locale: string) {
  return new Date(iso).toLocaleString(locale, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
