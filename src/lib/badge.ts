import type { Progres } from "../types";

export interface Badge {
  id: string;
  simbol: string;
  warna: string;
  tercapai: (p: Progres) => boolean;
}

export const DAFTAR_BADGE: Badge[] = [
  { id: "pertama", simbol: "1", warna: "#3B82F6", tercapai: (p) => p.totalDijawab >= 1 },
  { id: "benar10", simbol: "10", warna: "#0EA5E9", tercapai: (p) => p.totalBenar >= 10 },
  { id: "benar50", simbol: "50", warna: "#14B8A6", tercapai: (p) => p.totalBenar >= 50 },
  { id: "benar100", simbol: "100", warna: "#F59E0B", tercapai: (p) => p.totalBenar >= 100 },
  { id: "beruntun5", simbol: "5×", warna: "#F97316", tercapai: (p) => p.streakTerbaik >= 5 },
  { id: "beruntun10", simbol: "10×", warna: "#EF4444", tercapai: (p) => p.streakTerbaik >= 10 },
  { id: "sulit10", simbol: "S", warna: "#8B5CF6", tercapai: (p) => p.benarSulit >= 10 },
  { id: "sempurna", simbol: "★", warna: "#EAB308", tercapai: (p) => p.sesiSempurna >= 1 },
  { id: "simulasi", simbol: "⏱", warna: "#214A9B", tercapai: (p) => p.simulasiSelesai >= 1 },
  { id: "bangkit", simbol: "↻", warna: "#10B981", tercapai: (p) => p.diperbaiki >= 5 },
  { id: "jelajah", simbol: "3", warna: "#EC4899", tercapai: (p) => p.kelasDicoba.length >= 3 },
  { id: "tuntas", simbol: "✓", warna: "#142849", tercapai: (p) => p.poolTuntas >= 1 },
];

/** Memberi badge yang baru tercapai. Mengembalikan progres baru dan daftar badge yang baru didapat. */
export function periksaBadge(p: Progres): { progres: Progres; baru: Badge[] } {
  const baru = DAFTAR_BADGE.filter((b) => !p.badge[b.id] && b.tercapai(p));
  if (!baru.length) return { progres: p, baru };
  const badge = { ...p.badge };
  const now = new Date().toISOString();
  baru.forEach((b) => (badge[b.id] = now));
  return { progres: { ...p, badge }, baru };
}
