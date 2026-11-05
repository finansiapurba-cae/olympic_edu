import type { Bahasa } from "../types";

// Soal yang punya video pembahasan (animasi + suara). File: public/video/<id soal>-<bahasa>.mp4 dan <id soal>.jpg (sampul).
const ADA_VIDEO = new Set<string>(["osn-latihan-2-04"]);

export const punyaVideo = (soalId: string) => ADA_VIDEO.has(soalId);
export const alamatVideo = (soalId: string, bahasa: Bahasa) => `video/${soalId}-${bahasa}.mp4`;
export const sampulVideo = (soalId: string) => `video/${soalId}.jpg`;
