/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { useBahasa } from "../i18n";
import MathText from "./MathText";
import type { SpesVisual } from "../types";

// Gambar bantu untuk setiap soal. Setiap soal membawa "spesifikasi" kecil ({ j: jenis, ...data }),
// dan komponen ini menggambarnya. Sebelum jawaban diperiksa gambar hanya membantu memahami soal
// (bagian yang ditanyakan ditandai "?"); sesudahnya gambar menunjukkan penyelesaiannya.

const BIRU = "#2563EB";
const BIRU_MUDA = "#38BDF8";
const JINGGA = "#F97316";
const EMAS = "#FACC15";
const HIJAU = "#10B981";
const GARIS = "#1E293B";
const REDUP = "#94A3B8";

type P = { s: SpesVisual; tampil: boolean };

/* ---------- potongan kecil ---------- */

function Tanya({ tampil, nilai, className = "" }: { tampil: boolean; nilai: ReactNode; className?: string }) {
  return tampil ? (
    <span className={`font-extrabold text-jingga-tua ${className}`}>{nilai}</span>
  ) : (
    <span className={`font-extrabold text-utama ${className}`}>?</span>
  );
}
function Hasil({ tampil, children }: { tampil: boolean; children: ReactNode }) {
  if (!tampil || children === undefined || children === null || children === "") return null;
  return (
    <div className="mt-3 flex justify-center">
      <span className="rounded-full bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] px-4 py-1 text-base font-extrabold text-jingga-tua ring-1 ring-jingga/30">
        = <MathText text={String(children)} />
      </span>
    </div>
  );
}
const ganti = (label: any, tampil: boolean, jawab: any) => (label === "?" ? (tampil ? String(jawab) : "?") : String(label));
const Lbl = ({ t }: { t: any }) => <MathText text={String(t)} />;

/* ---------- jenis-jenis gambar ---------- */

function Hitung({ s, tampil }: P) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {s.grup.map((g: any, gi: number) => (
          <div key={gi} className="flex items-center gap-2">
            {gi > 0 && s.op && <span className="text-2xl font-extrabold text-utama">{s.op === "-" ? "−" : s.op}</span>}
            <div className="flex max-w-[260px] flex-wrap justify-center gap-1 rounded-xl bg-white/80 p-2 ring-1 ring-garis">
              {Array.from({ length: g.n }, (_, i) => {
                const dicoret = g.coret && i >= g.n - g.coret;
                return (
                  <span key={i} className={`relative text-2xl leading-none ${dicoret ? "opacity-35" : ""}`}>
                    {g.e}
                    {dicoret && <span className="absolute inset-0 grid place-items-center text-xl font-black text-salah">✕</span>}
                  </span>
                );
              })}
              <span className="w-full text-center text-xs font-bold text-redup">{g.n}</span>
            </div>
          </div>
        ))}
      </div>
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Kelompok({ s, tampil }: P) {
  const hewan = s.grup.every((g: any) => !g.titik);
  const total = s.grup.reduce((a: number, g: any) => a + g.n * g.isi, 0) + (s.sisa ?? 0);
  if (s.sembunyi && !tampil) {
    if (hewan) {
      const kepala = s.grup.reduce((a: number, g: any) => a + g.n, 0);
      return (
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-1 text-2xl">{Array.from({ length: kepala }, (_, i) => <span key={i}>❔</span>)}</div>
          <p className="mt-2 text-sm font-bold text-redup">
            {kepala} 🙂 · {total} 🦶
          </p>
        </div>
      );
    }
    const titik = s.grup[0].titik;
    return (
      <div className="text-center">
        <div className="mx-auto flex max-w-md flex-wrap justify-center gap-1 text-xl leading-none">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={titik === "●" ? "text-utama" : ""}>
              {titik}
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm font-bold text-redup">{total}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-start justify-center gap-2">
        {s.grup.map((g: any, gi: number) =>
          Array.from({ length: g.n }, (_, k) =>
            hewan ? (
              <div key={`${gi}-${k}`} className="flex flex-col items-center rounded-xl bg-white/80 px-2 py-1 ring-1 ring-garis">
                <span className="text-2xl leading-none">{g.e}</span>
                <span className="mt-1 flex gap-0.5">
                  {Array.from({ length: g.isi }, (_, i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-utama" />
                  ))}
                </span>
              </div>
            ) : (
              <div key={`${gi}-${k}`} className="relative flex max-w-[130px] flex-wrap justify-center gap-0.5 rounded-xl border-2 border-dashed border-utama/40 bg-white/80 p-2 pt-4">
                <span className="absolute -top-3 left-1 text-lg leading-none">{g.e}</span>
                {Array.from({ length: g.isi }, (_, i) => (
                  <span key={i} className={`text-lg leading-none ${g.titik === "●" ? "text-utama" : ""}`}>
                    {g.titik}
                  </span>
                ))}
              </div>
            ),
          ),
        )}
        {s.sisa ? (
          <div className="flex flex-wrap gap-0.5 rounded-xl bg-[#FFEDD5] p-2 ring-2 ring-jingga">
            {Array.from({ length: s.sisa }, (_, i) => (
              <span key={i} className="text-lg leading-none text-jingga">
                ●
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Susunan({ s, tampil }: P) {
  const baris = tampil && s.ubah ? s.ubah : s.baris;
  const kolom = tampil && s.ubah ? (s.baris * s.kolom) / s.ubah : s.kolom;
  const kecil = baris * kolom > 120;
  return (
    <div className="text-center">
      {s.eBaris ? (
        <div className="inline-block overflow-x-auto">
          <table className="mx-auto border-separate border-spacing-1">
            <tbody>
              <tr>
                <td />
                {Array.from({ length: s.kolom }, (_, c) => (
                  <td key={c} className="text-xl">
                    {s.eKolom}
                  </td>
                ))}
              </tr>
              {Array.from({ length: s.baris }, (_, r) => (
                <tr key={r}>
                  <td className="text-xl">{s.eBaris}</td>
                  {Array.from({ length: s.kolom }, (_, c) => (
                    <td key={c}>
                      <span className={`block h-4 w-4 rounded-full ${tampil ? "bg-utama" : "bg-garis"}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {s.kali > 1 && <p className="text-sm font-bold text-redup">× {s.kali} 🧢</p>}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${kolom}, minmax(0, 1fr))` }}>
            {Array.from({ length: baris * kolom }, (_, i) => (
              <span key={i} className={`${kecil ? "h-2 w-2" : "h-3.5 w-3.5"} rounded-full bg-utama`} />
            ))}
          </div>
          {s.tambah ? (
            <>
              <span className="text-2xl font-extrabold text-utama">+</span>
              <div className="flex max-w-[160px] flex-wrap gap-1">
                {Array.from({ length: s.tambah }, (_, i) => (
                  <span key={i} className="h-3.5 w-3.5 rounded-full bg-jingga" />
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
      {!s.eBaris && (
        <p className="mt-2 text-sm font-bold text-redup">
          {s.tanya === "kolom" ? (
            <>
              {baris} × <Tanya tampil={tampil} nilai={kolom} />
            </>
          ) : (
            `${baris} × ${kolom}`
          )}
          {s.tambah ? ` + ${s.tambah}` : ""}
        </p>
      )}
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Garis({ s, tampil }: P) {
  const { min, max } = s;
  const W = 640, x0 = 30, x1 = W - 30, y = 92;
  const X = (v: number) => x0 + ((v - min) / (max - min || 1)) * (x1 - x0);
  const rentang = max - min;
  const langkah = s.langkah ?? (rentang <= 24 ? 1 : rentang <= 60 ? 5 : rentang <= 150 ? 10 : rentang <= 600 ? 50 : 100);
  const ticks: number[] = [];
  for (let v = Math.ceil(min / langkah) * langkah; v <= max; v += langkah) ticks.push(v);
  const titik = new Set<number>([...(s.titik ?? []), ...(s.mulai !== undefined ? [s.mulai] : [])]);
  const lompat: { dari: number; ke: number; label: string }[] = [];
  let pos = s.mulai;
  for (const l of s.lompat ?? []) {
    lompat.push({ dari: pos, ke: l.ke, label: l.label });
    pos = l.ke;
  }
  const label = (v: number) => (v < 0 ? `−${Math.abs(v)}` : String(v));
  return (
    <svg viewBox={`0 0 ${W} 130`} className="mx-auto w-full max-w-xl">
      <line x1={x0 - 10} y1={y} x2={x1 + 10} y2={y} stroke={GARIS} strokeWidth="3" strokeLinecap="round" />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={y - 6} x2={X(v)} y2={y + 6} stroke={GARIS} strokeWidth="2" />
          {(rentang <= 24 || v % (langkah * (rentang > 150 ? 2 : 1)) === 0) && (
            <text x={X(v)} y={y + 24} textAnchor="middle" fontSize="13" fill={REDUP} fontWeight="600">
              {label(v)}
            </text>
          )}
        </g>
      ))}
      {[...titik].map((v) => (
        <g key={`t${v}`}>
          <circle cx={X(v)} cy={y} r="7" fill={BIRU} />
          <text x={X(v)} y={y + 24} textAnchor="middle" fontSize="14" fill={BIRU} fontWeight="800">
            {label(v)}
          </text>
        </g>
      ))}
      {lompat.map((l, i) => {
        const a = X(l.dari), b = X(l.ke), mid = (a + b) / 2, h = Math.min(60, 18 + Math.abs(b - a) / 4);
        return (
          <g key={i}>
            <path d={`M ${a} ${y - 4} Q ${mid} ${y - 4 - h * 2} ${b} ${y - 4}`} fill="none" stroke={i % 2 ? JINGGA : BIRU_MUDA} strokeWidth="3" markerEnd="url(#panah)" />
            <text x={mid} y={y - 4 - h - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill={i % 2 ? JINGGA : BIRU}>
              {l.label}
            </text>
          </g>
        );
      })}
      {s.tanya !== undefined && s.tanya !== null && (tampil || !s.tanyaNanti) && (
        <g>
          <circle cx={X(s.tanya)} cy={y} r="9" fill={tampil ? JINGGA : "#FFFFFF"} stroke={JINGGA} strokeWidth="3" />
          <text x={X(s.tanya)} y={y + 26} textAnchor="middle" fontSize="15" fontWeight="900" fill={JINGGA}>
            {tampil ? label(s.tanya) : "?"}
          </text>
        </g>
      )}
      <defs>
        <marker id="panah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={GARIS} />
        </marker>
      </defs>
    </svg>
  );
}

function Pola({ s, tampil }: P) {
  const suku: any[] = s.suku.includes("?") ? s.suku : s.ke ? s.suku : [...s.suku, "?"];
  const beda = (i: number) => (Array.isArray(s.beda) ? s.beda[i] : s.beda);
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {suku.map((v, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && (
            <span className="flex flex-col items-center px-0.5">
              <span className="text-xs font-extrabold text-jingga">{beda(i - 1) ?? ""}</span>
              <span className="text-lg leading-none text-redup">→</span>
            </span>
          )}
          <span className={`grid h-12 min-w-12 place-items-center rounded-xl px-2 text-lg font-extrabold ${v === "?" ? "bg-[#FFF7ED] ring-2 ring-jingga" : "bg-white ring-1 ring-garis"}`}>
            {v === "?" ? <Tanya tampil={tampil} nilai={s.jawab} /> : v}
          </span>
        </div>
      ))}
      {s.ke && (
        <>
          <span className="px-1 text-xl font-bold text-redup">⋯</span>
          <span className="flex flex-col items-center">
            <span className="grid h-12 min-w-12 place-items-center rounded-xl bg-[#FFF7ED] px-2 text-lg font-extrabold ring-2 ring-jingga">
              <Tanya tampil={tampil} nilai={s.jawab} />
            </span>
            <span className="text-xs font-bold text-redup">#{s.ke}</span>
          </span>
        </>
      )}
      {s.catatan && tampil && (
        <p className="mt-2 w-full text-center text-sm font-bold text-jingga-tua">
          <Lbl t={s.catatan} />
        </p>
      )}
    </div>
  );
}

function Model({ s, tampil }: P) {
  let k = 0;
  const gantiQ = (label: any) => {
    if (label !== "?") return String(label);
    if (!tampil) return "?";
    if (s.jawabList) return String(s.jawabList[k++]);
    return String(s.jawab);
  };
  const bagian: any[] = s.sembunyi && !tampil ? [s.bagian[0], { nilai: s.bagian.slice(1).reduce((a: number, b: any) => a + b.nilai, 0), label: "…", kosong: true }] : s.bagian;
  const jumlah = bagian.reduce((a, b) => a + b.nilai, 0);
  const warna = ["#DBEAFE", "#E0F2FE", "#FEF3C7", "#DCFCE7", "#FCE7F3"];
  return (
    <div>
      {s.total !== undefined && (
        <div className="mb-1 flex flex-col items-center">
          <span className="text-sm font-extrabold text-tinta">
            <Lbl t={s.total === "?" ? (tampil ? s.jawab : "?") : s.total} />
          </span>
          <span className="h-3 w-full rounded-t-lg border-x-2 border-t-2 border-redup/60" />
        </div>
      )}
      <div className="flex w-full overflow-hidden rounded-xl ring-2 ring-garis">
        {bagian.map((b, i) => {
          const tanya = b.label === "?";
          return (
            <div
              key={i}
              className={`flex min-h-[48px] ${bagian.length > 8 ? "min-w-[22px]" : "min-w-[44px]"} items-center justify-center border-r-2 border-white px-1 text-center text-sm font-extrabold last:border-r-0 ${b.kosong ? "border-dashed bg-[repeating-linear-gradient(45deg,#F1F5F9,#F1F5F9_6px,#E2E8F0_6px,#E2E8F0_12px)] text-redup" : ""}`}
              style={{ flexGrow: Math.max(b.nilai / jumlah, 0.06), flexBasis: 0, background: b.kosong ? undefined : tanya ? "#FFF7ED" : b.warna ? "#FED7AA" : warna[i % warna.length] }}
            >
              <span className={tanya ? "text-jingga-tua" : "text-tinta"}>
                <Lbl t={gantiQ(b.label)} />
              </span>
            </div>
          );
        })}
      </div>
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Banding({ s, tampil }: P) {
  const maks = Math.max(...s.baris.map((b: any) => b.nilai + (s.tambah ?? 0)));
  const min = Math.min(...s.baris.map((b: any) => b.nilai));
  return (
    <div className="grid gap-2">
      {s.baris.map((b: any, i: number) => {
        const lebar = s.sembunyi && !tampil ? 12 : (b.nilai / maks) * 100;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate text-right text-sm font-bold text-tinta">
              <Lbl t={b.label} />
            </span>
            <div className="relative h-9 flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center justify-end rounded-lg bg-gradient-to-r from-[#BFDBFE] to-[#60A5FA] pr-2 text-sm font-extrabold text-tinta" style={{ width: `${lebar}%` }}>
                {b.tanya ? <Tanya tampil={tampil} nilai={b.nilai} /> : b.nilai}
              </div>
              {s.selisih !== undefined && b.nilai > min && (
                <div className="absolute inset-y-0 rounded-r-lg border-2 border-dashed border-jingga bg-[#FFEDD5]/70" style={{ left: `${(min / maks) * 100}%`, width: `${((b.nilai - min) / maks) * 100}%` }}>
                  <span className="absolute inset-0 grid place-items-center text-xs font-extrabold text-jingga-tua">{ganti(s.selisih, tampil, s.jawab)}</span>
                </div>
              )}
              {s.pindah && tampil && b.nilai > min && (
                <div className="absolute inset-y-0 rounded-r-lg border-2 border-dashed border-benar bg-[#DCFCE7]" style={{ left: `${((b.nilai - s.pindah) / maks) * 100}%`, width: `${(s.pindah / maks) * 100}%` }}>
                  <span className="absolute inset-0 grid place-items-center text-xs font-extrabold text-benar">−{s.pindah}</span>
                </div>
              )}
              {s.pindah && tampil && b.nilai === min && (
                <div className="absolute inset-y-0 rounded-r-lg border-2 border-dashed border-benar bg-[#DCFCE7]" style={{ left: `${lebar}%`, width: `${(s.pindah / maks) * 100}%` }}>
                  <span className="absolute inset-0 grid place-items-center text-xs font-extrabold text-benar">+{s.pindah}</span>
                </div>
              )}
              {s.tambah && tampil && (
                <div className="absolute inset-y-1 rounded-r-lg bg-[#BAE6FD]/80" style={{ left: `${lebar}%`, width: `${(s.tambah / maks) * 100}%` }}>
                  <span className="absolute inset-0 grid place-items-center text-[11px] font-bold text-utama">+{s.tambah}</span>
                </div>
              )}
              {s.garis !== undefined && tampil && <div className="absolute -inset-y-1 w-0.5 bg-jingga" style={{ left: `${(s.garis / maks) * 100}%` }} />}
            </div>
          </div>
        );
      })}
      {s.total !== undefined && (
        <p className="text-center text-sm font-bold text-redup">
          Σ = <Lbl t={s.total} />
        </p>
      )}
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Bagian({ s, tampil }: P) {
  return (
    <div>
      <div className="grid gap-2">
        {s.baris.map((b: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate text-right text-sm font-bold text-tinta">
              <Lbl t={b.label} />
            </span>
            <div className="flex flex-1 flex-wrap gap-1">
              {Array.from({ length: b.n }, (_, k) => (
                <span key={k} className="grid h-9 min-w-[2.25rem] flex-1 place-items-center rounded-lg bg-gradient-to-b from-[#DBEAFE] to-[#BFDBFE] px-1 text-xs font-extrabold text-utama ring-1 ring-[#93C5FD]" style={{ maxWidth: 72 }}>
                  {b.tetap ? <Lbl t={b.nilai} /> : b.nilai !== undefined || s.nilai !== undefined ? <Tanya tampil={tampil} nilai={<Lbl t={b.nilai ?? s.nilai} />} /> : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {s.total !== undefined && (
        <p className="mt-2 text-center text-sm font-bold text-redup">
          Σ = <Lbl t={s.total} />
        </p>
      )}
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Jam({ s, tampil }: P) {
  const { bahasa } = useBahasa();
  const fmt = (h: number, m: number) => `${String(h).padStart(2, "0")}${bahasa === "id" ? "." : ":"}${String(m).padStart(2, "0")}`;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {s.waktu.map(([h, m]: number[], i: number) => {
        const sembunyi = s.tanya === i && !tampil;
        const am = (m / 60) * 360, aj = (((h % 12) + m / 60) / 12) * 360;
        const ujung = (a: number, r: number) => [60 + r * Math.sin((a * Math.PI) / 180), 60 - r * Math.cos((a * Math.PI) / 180)];
        const [xm, ym] = ujung(am, 40), [xj, yj] = ujung(aj, 26);
        const besar = Math.min(Math.abs(am - aj), 360 - Math.abs(am - aj));
        return (
          <div key={i} className="flex items-center gap-4">
            {i > 0 && (
              <span className="text-center text-sm font-extrabold text-jingga">
                →{s.durasi && tampil ? <span className="block">{s.durasi}′</span> : null}
              </span>
            )}
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 120 120" className="h-28 w-28">
                <circle cx="60" cy="60" r="54" fill="#FFFFFF" stroke={GARIS} strokeWidth="4" />
                {Array.from({ length: 12 }, (_, k) => {
                  const [x, y] = ujung(k * 30, 44);
                  return (
                    <text key={k} x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={REDUP}>
                      {k === 0 ? 12 : k}
                    </text>
                  );
                })}
                {s.sudut && tampil && <path d={`M 60 60 L ${ujung(am, 34).join(" ")} A 34 34 0 0 ${aj > am ? 1 : 0} ${ujung(aj, 34).join(" ")} Z`} fill={JINGGA} opacity=".3" />}
                {!sembunyi && (
                  <>
                    <line x1="60" y1="60" x2={xj} y2={yj} stroke={GARIS} strokeWidth="5" strokeLinecap="round" />
                    <line x1="60" y1="60" x2={xm} y2={ym} stroke={BIRU} strokeWidth="3.5" strokeLinecap="round" />
                  </>
                )}
                {sembunyi && (
                  <text x="60" y="70" textAnchor="middle" fontSize="34" fontWeight="900" fill={JINGGA}>
                    ?
                  </text>
                )}
                <circle cx="60" cy="60" r="4" fill={GARIS} />
              </svg>
              <span className="rounded-md bg-navy px-2 py-0.5 font-mono text-sm font-bold text-white">{sembunyi ? "??" : fmt(h, m)}</span>
              {s.sudut && tampil && <span className="mt-1 text-sm font-extrabold text-jingga-tua">{besar}°</span>}
            </div>
          </div>
        );
      })}
      {s.putaran && <span className="rounded-full bg-[#FFEDD5] px-3 py-1 text-sm font-extrabold text-jingga-tua">↻ × {tampil ? s.putaran : "?"}</span>}
    </div>
  );
}

function Kalender({ s, tampil }: P) {
  const { t } = useBahasa();
  const hari = t.hariPendek;
  if (s.bulan) {
    const target = s.maju + 1;
    return (
      <div className="mx-auto max-w-sm">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-redup">
          {hari.map((h) => (
            <span key={h}>{h}</span>
          ))}
          {Array.from({ length: s.mulai }, (_, i) => (
            <span key={`k${i}`} />
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const tgl = i + 1;
            const awal = tgl === 1, akhir = tgl === target;
            return (
              <span key={tgl} className={`rounded-md py-1 text-sm ${awal ? "bg-utama font-extrabold text-white" : akhir && tampil ? "bg-jingga font-extrabold text-white" : akhir ? "bg-[#FFF7ED] font-extrabold text-jingga ring-2 ring-jingga" : "bg-white text-tinta ring-1 ring-garis"}`}>
                {tgl}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
  const q = Math.floor(s.maju / 7), r = s.maju % 7, tujuan = (s.mulai + s.maju) % 7;
  return (
    <div className="text-center">
      <div className="mx-auto grid max-w-md grid-cols-7 gap-1">
        {hari.map((h, i) => (
          <span key={h} className={`rounded-lg py-2 text-sm font-extrabold ${i === s.mulai ? "bg-utama text-white" : i === tujuan && tampil ? "bg-jingga text-white" : "bg-white text-tinta ring-1 ring-garis"}`}>
            {h}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-redup">
        +{s.maju} = 7 × {q} + {r} {tampil ? "✓" : ""}
      </p>
    </div>
  );
}

function PersegiPanjang({ s, tampil }: P) {
  const skala = Math.min(220 / s.p, 140 / s.l);
  const w = s.p * skala, h = s.l * skala, x = (300 - w) / 2, y = 24;
  const sisiP = s.tanyaSisi ? (tampil ? s.p : "?") : s.p;
  const sisiL = s.tanyaSisi || s.tanyaL ? (tampil ? s.l : "?") : s.l;
  return (
    <svg viewBox={`0 0 300 ${h + 70}`} className="mx-auto w-full max-w-sm">
      <rect x={x} y={y} width={w} height={h} fill={tampil && s.ukur === "luas" ? "#FED7AA" : "#DBEAFE"} stroke={tampil && s.ukur === "keliling" ? JINGGA : BIRU} strokeWidth={tampil && s.ukur === "keliling" ? 5 : 3} rx="3" />
      {s.grid && s.p <= 20 && s.l <= 20 && (
        <g stroke="#FFFFFF" strokeWidth="1">
          {Array.from({ length: s.p - 1 }, (_, i) => (
            <line key={`v${i}`} x1={x + (i + 1) * skala} y1={y} x2={x + (i + 1) * skala} y2={y + h} />
          ))}
          {Array.from({ length: s.l - 1 }, (_, i) => (
            <line key={`h${i}`} x1={x} y1={y + (i + 1) * skala} x2={x + w} y2={y + (i + 1) * skala} />
          ))}
        </g>
      )}
      {s.potong && (
        <rect x={x + w - s.potong[0] * skala} y={y} width={s.potong[0] * skala} height={s.potong[1] * skala} fill="#E0F2FE" stroke={BIRU_MUDA} strokeWidth="2" strokeDasharray="5 4" />
      )}
      {s.potong && (
        <text x={x + w - (s.potong[0] * skala) / 2} y={y + (s.potong[1] * skala) / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill={BIRU}>
          {s.potong[0]}×{s.potong[1]}
        </text>
      )}
      <text x={x + w / 2} y={y + h + 22} textAnchor="middle" fontSize="15" fontWeight="800" fill={GARIS}>
        {sisiP} {s.satuan}
      </text>
      <text x={x - 8} y={y + h / 2 + 5} textAnchor="end" fontSize="15" fontWeight="800" fill={GARIS}>
        {sisiL}
      </text>
      {s.label && (
        <text x={x + w / 2} y={y + h / 2 + 6} textAnchor="middle" fontSize="16" fontWeight="900" fill={BIRU}>
          {s.label}
        </text>
      )}
    </svg>
  );
}

function Lingkaran({ s, tampil }: P) {
  const ukuran = s.r ?? s.d / 2;
  return (
    <svg viewBox="0 0 240 200" className="mx-auto w-full max-w-xs">
      <circle cx="120" cy="100" r="80" fill={tampil && s.ukur === "luas" ? "#FED7AA" : "#DBEAFE"} stroke={tampil && s.ukur === "keliling" ? JINGGA : BIRU} strokeWidth={tampil && s.ukur === "keliling" ? 6 : 3} />
      <circle cx="120" cy="100" r="4" fill={GARIS} />
      {s.r !== undefined ? (
        <>
          <line x1="120" y1="100" x2="200" y2="100" stroke={GARIS} strokeWidth="3" />
          <text x="160" y="92" textAnchor="middle" fontSize="15" fontWeight="800" fill={GARIS}>
            r = {ukuran} {s.satuan}
          </text>
        </>
      ) : (
        <>
          <line x1="40" y1="100" x2="200" y2="100" stroke={GARIS} strokeWidth="3" />
          <text x="120" y="92" textAnchor="middle" fontSize="15" fontWeight="800" fill={GARIS}>
            d = {s.d} {s.satuan}
          </text>
        </>
      )}
      {s.persegi && <rect x="120" y="20" width="80" height="80" fill={EMAS} opacity=".5" stroke={GARIS} strokeWidth="2" />}
    </svg>
  );
}

function Balok({ s, tampil }: P) {
  const mx = Math.max(s.p, s.l, s.t);
  const p = (s.p / mx) * 130, t = (s.t / mx) * 110, l = (s.l / mx) * 60;
  const ox = 40, oy = 40 + l * 0.6;
  const dx = l * 0.8, dy = -l * 0.6;
  const A = [ox, oy + t], B = [ox + p, oy + t], C = [ox + p, oy], D = [ox, oy];
  const pt = (q: number[]) => `${q[0]},${q[1]}`;
  const geser = (q: number[]) => [q[0] + dx, q[1] + dy];
  const lab = (v: any, teks?: string) => (s.tanyaSisi && !tampil ? "?" : (teks ?? v));
  return (
    <svg viewBox="0 0 280 220" className="mx-auto w-full max-w-xs">
      <polygon points={[D, C, geser(C), geser(D)].map(pt).join(" ")} fill="#BFDBFE" stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points={[C, B, geser(B), geser(C)].map(pt).join(" ")} fill="#93C5FD" stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points={[A, B, C, D].map(pt).join(" ")} fill="#DBEAFE" stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
      <text x={ox + p / 2} y={oy + t + 22} textAnchor="middle" fontSize="15" fontWeight="800" fill={GARIS}>
        {lab(s.p, s.lp)} {s.satuan}
      </text>
      <text x={ox - 8} y={oy + t / 2 + 5} textAnchor="end" fontSize="15" fontWeight="800" fill={GARIS}>
        {lab(s.t, s.lt)}
      </text>
      <text x={ox + p + dx / 2 + 10} y={oy + t + dy / 2 + 8} fontSize="15" fontWeight="800" fill={GARIS}>
        {lab(s.l, s.ll)}
      </text>
    </svg>
  );
}

function Tabung({ s }: P) {
  const t = Math.min(150, Math.max(60, (s.t / s.r) * 45));
  return (
    <svg viewBox="0 0 240 230" className="mx-auto w-full max-w-[220px]">
      <path d={`M 50 40 L 50 ${40 + t} A 70 18 0 0 0 190 ${40 + t} L 190 40`} fill="#DBEAFE" stroke={GARIS} strokeWidth="3" />
      <ellipse cx="120" cy="40" rx="70" ry="18" fill="#BFDBFE" stroke={GARIS} strokeWidth="3" />
      {s.kerucut && <path d={`M 50 ${40 + t} L 120 40 L 190 ${40 + t}`} fill="#FED7AA" stroke={JINGGA} strokeWidth="2.5" strokeDasharray="6 4" opacity=".9" />}
      <line x1="120" y1="40" x2="190" y2="40" stroke={GARIS} strokeWidth="2.5" />
      <text x="155" y="16" textAnchor="middle" fontSize="14" fontWeight="800" fill={GARIS}>
        r = {s.r} {s.satuan}
      </text>
      <line x1="206" y1="40" x2="206" y2={40 + t} stroke={REDUP} strokeWidth="2" strokeDasharray="4 3" />
      <text x="212" y={40 + t / 2} fontSize="14" fontWeight="800" fill={GARIS}>
        {s.t}
      </text>
    </svg>
  );
}

function poligonTitik(n: number, cx: number, cy: number, r: number, fy = 1) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a) * fy];
  });
}

function Prisma({ s, tampil }: P) {
  const atas = poligonTitik(s.n, 120, 50, 70, 0.32), bawah = atas.map(([x, y]) => [x, y + 110]);
  const pt = (q: number[]) => `${q[0]},${q[1]}`;
  return (
    <svg viewBox="0 0 240 200" className="mx-auto w-full max-w-[240px]">
      {tampil && s.tanya === 1 && atas.map((q, i) => {
        const k = (i + 1) % s.n;
        return <polygon key={`f${i}`} points={[q, atas[k], bawah[k], bawah[i]].map(pt).join(" ")} fill={[JINGGA, EMAS, BIRU_MUDA][i % 3]} opacity=".45" />;
      })}
      {(() => {
        const sisi = tampil && s.tanya === 0 ? JINGGA : GARIS;
        return (
          <>
            <polygon points={bawah.map(pt).join(" ")} fill={tampil && s.tanya === 1 ? "#FED7AA" : "#BFDBFE"} fillOpacity={tampil && s.tanya === 1 ? 0.6 : 1} stroke={sisi} strokeWidth="2.5" />
            {atas.map((q, i) => (
              <line key={i} x1={q[0]} y1={q[1]} x2={bawah[i][0]} y2={bawah[i][1]} stroke={sisi} strokeWidth="2.5" />
            ))}
            <polygon points={atas.map(pt).join(" ")} fill={tampil && s.tanya === 1 ? "#FDE68A" : "#DBEAFE"} fillOpacity=".85" stroke={sisi} strokeWidth="2.5" />
          </>
        );
      })()}
      {tampil && s.tanya === 2 && [...atas, ...bawah].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r="5" fill={JINGGA} />)}
    </svg>
  );
}

function Poligon({ s, tampil }: P) {
  const v = poligonTitik(s.n, 120, 105, 90);
  return (
    <svg viewBox="0 0 240 210" className="mx-auto w-full max-w-[240px]">
      <polygon points={v.map((q) => q.join(",")).join(" ")} fill="#DBEAFE" stroke={GARIS} strokeWidth="3" />
      {tampil &&
        v.flatMap((a, i) =>
          v.map((b, k) => (k > i + 1 && !(i === 0 && k === s.n - 1) ? <line key={`${i}-${k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={JINGGA} strokeWidth="1.5" opacity=".8" /> : null)),
        )}
      {v.map((q, i) => (
        <circle key={i} cx={q[0]} cy={q[1]} r="5" fill={BIRU} />
      ))}
    </svg>
  );
}

function Catur({ s, tampil }: P) {
  const n = s.n, c = 160 / n;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <svg viewBox="0 0 170 170" className="h-40 w-40">
        {Array.from({ length: n * n }, (_, i) => (
          <rect key={i} x={5 + (i % n) * c} y={5 + Math.floor(i / n) * c} width={c} height={c} fill={((i % n) + Math.floor(i / n)) % 2 ? "#DBEAFE" : "#FFFFFF"} stroke={GARIS} strokeWidth="1.5" />
        ))}
        {tampil && <rect x="5" y="5" width={c * 2} height={c * 2} fill="none" stroke={JINGGA} strokeWidth="4" />}
      </svg>
      {tampil && (
        <ul className="text-sm font-bold text-tinta">
          {Array.from({ length: n }, (_, i) => (
            <li key={i}>
              {i + 1}×{i + 1}: {(n - i) ** 2}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Jabat({ s, tampil }: P) {
  const v = poligonTitik(s.n, 120, 105, 82);
  return (
    <svg viewBox="0 0 240 210" className="mx-auto w-full max-w-[240px]">
      {tampil && v.flatMap((a, i) => v.slice(i + 1).map((b, k) => <line key={`${i}-${k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={JINGGA} strokeWidth="2" opacity=".7" />))}
      {v.map((q, i) => (
        <text key={i} x={q[0]} y={q[1] + 9} textAnchor="middle" fontSize="26">
          🧒
        </text>
      ))}
    </svg>
  );
}

function Tiang({ s, tampil }: P) {
  const n = s.celah, W = 600, x0 = 30, langkahX = (W - 60) / n;
  return (
    <svg viewBox={`0 0 ${W} 120`} className="mx-auto w-full max-w-xl">
      <line x1={x0} y1="90" x2={W - 30} y2="90" stroke={REDUP} strokeWidth="6" strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => (
        <text key={`j${i}`} x={x0 + (i + 0.5) * langkahX} y="112" textAnchor="middle" fontSize="12" fontWeight="700" fill={REDUP}>
          {s.jarak}
        </text>
      ))}
      {Array.from({ length: n + 1 }, (_, i) => (
        <g key={i}>
          <line x1={x0 + i * langkahX} y1="90" x2={x0 + i * langkahX} y2="30" stroke={GARIS} strokeWidth="3" />
          <path d={`M ${x0 + i * langkahX} 30 l 18 6 l -18 6 z`} fill={MERAH_BENDERA(i)} />
          {tampil && (
            <text x={x0 + i * langkahX} y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill={JINGGA}>
              {i + 1}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
const MERAH_BENDERA = (i: number) => (i % 2 ? "#DC2626" : "#EF4444");

function Antrian({ s, tampil }: P) {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {Array.from({ length: s.total }, (_, i) => {
        const dia = i + 1 === s.posisi;
        return (
          <div key={i} className={`flex flex-col items-center rounded-lg px-1 py-1 ${dia ? "bg-[#FFF7ED] ring-2 ring-jingga" : ""}`}>
            <span className="text-2xl leading-none">{dia ? "🧑‍🎓" : "🧒"}</span>
            <span className="text-[11px] font-bold text-redup">{tampil || s.belakang || i < s.posisi ? i + 1 : "·"}</span>
            {s.belakang && tampil && <span className="text-[11px] font-extrabold text-jingga">{s.total - i}</span>}
          </div>
        );
      })}
      <p className="w-full text-center text-sm font-bold text-redup">
        → {s.belakang ? "" : <Tanya tampil={tampil} nilai={s.total} />}
      </p>
    </div>
  );
}

function NilaiTempat({ s, tampil }: P) {
  const digit = String(s.angka).split("").map(Number);
  const tempat = digit.length === 3 ? [100, 10, 1] : [10, 1];
  return (
    <div className="text-center">
      <div className="flex flex-wrap items-end justify-center gap-4">
        {digit.map((d, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 rounded-xl p-2 ${s.sorot === i ? "bg-[#FFF7ED] ring-2 ring-jingga" : ""}`}>
            <div className="flex max-w-[170px] flex-wrap items-end justify-center gap-1">
              {Array.from({ length: d }, (_, k) =>
                tempat[i] === 100 ? (
                  <span key={k} className="grid h-10 w-10 grid-cols-5 gap-px rounded bg-utama p-0.5">
                    {Array.from({ length: 25 }, (_, z) => (
                      <span key={z} className="bg-[#93C5FD]" />
                    ))}
                  </span>
                ) : tempat[i] === 10 ? (
                  <span key={k} className="flex h-12 w-2.5 flex-col gap-px rounded-sm bg-[#0EA5E9] p-px">
                    {Array.from({ length: 10 }, (_, z) => (
                      <span key={z} className="flex-1 bg-[#BAE6FD]" />
                    ))}
                  </span>
                ) : (
                  <span key={k} className="h-3 w-3 rounded-sm bg-jingga" />
                ),
              )}
            </div>
            <span className="text-xs font-bold text-redup">{tempat[i]}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xl font-extrabold">
        <Tanya tampil={tampil} nilai={s.angka} />
      </p>
    </div>
  );
}

function Kartu({ s, tampil }: P) {
  const kartu = (d: any, i: number, sorot = false) => (
    <span key={i} className={`grid h-14 w-11 place-items-center rounded-lg text-2xl font-extrabold shadow ${sorot ? "bg-gradient-to-b from-[#FFF7ED] to-[#FED7AA] text-jingga-tua ring-2 ring-jingga" : "bg-white text-utama ring-1 ring-garis"}`}>
      {d}
    </span>
  );
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">{s.angka.map((d: number, i: number) => kartu(d, i))}</div>
      {tampil && (
        <>
          <span className="text-redup">↓</span>
          <div className="flex gap-2">{String(s.jawab).split("").map((d, i) => kartu(d, i, true))}</div>
        </>
      )}
    </div>
  );
}

function Grid({ s, tampil }: P) {
  const angka = Array.from({ length: s.sampai - s.dari + 1 }, (_, i) => s.dari + i);
  const sorot = new Set<number>(s.sorot ?? []);
  const kecil = angka.length > 60;
  const satuDigit = angka.filter((v) => v < 10).length;
  return (
    <div>
      <div className="mx-auto grid max-w-md grid-cols-10 gap-1">
        {angka.map((v) => {
          let gaya = "bg-white text-tinta ring-1 ring-garis";
          if (tampil && sorot.has(v)) gaya = "bg-jingga text-white font-extrabold";
          if (s.warnaDigit && tampil) gaya = v < 10 ? "bg-[#BFDBFE] text-utama font-bold" : "bg-[#FED7AA] text-jingga-tua font-bold";
          return (
            <span key={v} className={`rounded py-1 text-center ${kecil ? "text-[10px]" : "text-xs"} ${gaya}`}>
              {v}
            </span>
          );
        })}
      </div>
      {tampil && s.warnaDigit && <Hasil tampil>{`${satuDigit} × 1 + ${angka.length - satuDigit} × 2`}</Hasil>}
      {tampil && sorot.size > 0 && <Hasil tampil>{s.hasil ?? `${sorot.size}`}</Hasil>}
    </div>
  );
}

function Daftar({ s, tampil }: P) {
  const sorot = new Set<number>(s.sorot ?? []);
  return (
    <div className="grid gap-2">
      {s.baris.map((b: any, i: number) => (
        <div key={i} className="flex items-start gap-2">
          <span className="w-12 shrink-0 pt-1 text-right text-sm font-extrabold text-utama">{b.label}</span>
          <div className="flex flex-wrap gap-1">
            {b.angka.map((v: number, k: number) => (
              <span key={k} className={`min-w-8 rounded-md px-1.5 py-1 text-center text-xs font-bold ${tampil && sorot.has(v) ? "bg-jingga text-white ring-2 ring-jingga" : "bg-white text-tinta ring-1 ring-garis"}`}>
                {v}
              </span>
            ))}
          </div>
        </div>
      ))}
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Faktor({ s, tampil }: P) {
  const pas: number[][] = [];
  for (let a = 1; a * a <= s.n; a++) if (s.n % a === 0) pas.push([a, s.n / a]);
  const semua = [...new Set(pas.flat())].sort((a, b) => a - b);
  const W = Math.max(semua.length * 44, 200);
  const X = (v: number) => 22 + semua.indexOf(v) * 44;
  if (!tampil) {
    return (
      <p className="text-center text-2xl font-extrabold text-navy">
        {s.n} = ? × ?
      </p>
    );
  }
  return (
    <svg viewBox={`0 0 ${W} 130`} className="mx-auto w-full max-w-lg">
      {tampil &&
        pas.map(([a, b], i) => {
          const xa = X(a), xb = X(b);
          return a === b ? null : <path key={i} d={`M ${xa} 92 A ${(xb - xa) / 2} ${Math.min((xb - xa) / 2.6, 80)} 0 0 1 ${xb} 92`} fill="none" stroke={[BIRU, JINGGA, BIRU_MUDA, HIJAU, "#A855F7", EMAS][i % 6]} strokeWidth="3" />;
        })}
      {semua.map((v) => (
        <g key={v}>
          <circle cx={X(v)} cy="104" r="17" fill={tampil ? "#DBEAFE" : "#FFFFFF"} stroke={GARIS} strokeWidth="2" />
          <text x={X(v)} y="109" textAnchor="middle" fontSize="14" fontWeight="800" fill={GARIS}>
            {tampil ? v : "?"}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Romawi({ s, tampil }: P) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-2">
      {s.bagian.map(([sym, v]: [string, number], i: number) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && <span className="pb-6 text-lg font-extrabold text-redup">+</span>}
          <div className="flex flex-col items-center">
            <span className="rounded-lg bg-white px-3 py-2 font-serif text-2xl font-bold text-navy ring-1 ring-garis">{sym}</span>
            <span className="mt-1 text-sm font-extrabold">
              <Tanya tampil={tampil} nilai={v} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Siklus({ s, tampil }: P) {
  const k = (s.n - 1) % s.isi.length;
  return (
    <div className="text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {s.isi.map((d: number, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex flex-col items-center rounded-xl px-3 py-2 ring-1 ${tampil && i === k ? "bg-jingga text-white ring-jingga" : "bg-white ring-garis"}`}>
              <span className="text-xs font-bold opacity-80">
                <MathText text={`$${s.dasar}^{${i + 1}}$`} />
              </span>
              <span className="text-xl font-extrabold">…{d}</span>
            </div>
            <span className="text-lg text-redup">{i === s.isi.length - 1 ? "↺" : "→"}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-redup">
        <MathText text={`$${s.n} \\div ${s.isi.length}$`} /> → {tampil ? `${Math.floor(s.n / s.isi.length)} r ${s.n % s.isi.length}` : "?"}
      </p>
    </div>
  );
}

function BatangPecahan({ a, b, tampil = true, sembunyi = false, sorot = false }: { a: number; b: number; tampil?: boolean; sembunyi?: boolean; sorot?: boolean }) {
  const utuh = Math.max(1, Math.ceil(a / b));
  return (
    <div className={`flex flex-col gap-1 rounded-lg p-1 ${sorot ? "ring-2 ring-jingga" : ""}`}>
      {Array.from({ length: utuh }, (_, u) => (
        <div key={u} className="flex h-7 w-48 overflow-hidden rounded-md ring-2 ring-garis">
          {Array.from({ length: b }, (_, i) => {
            const isi = u * b + i < a && (!sembunyi || tampil);
            return <span key={i} className={`flex-1 border-r border-white last:border-r-0 ${isi ? "bg-gradient-to-b from-[#60A5FA] to-utama" : "bg-[#F1F5F9]"}`} />;
          })}
        </div>
      ))}
      <span className="text-center text-sm font-extrabold text-tinta">
        <MathText text={sembunyi && !tampil ? `$\\frac{?}{${b}}$` : `$\\frac{${a}}{${b}}$`} />
      </span>
    </div>
  );
}

function Pecahan({ s, tampil }: P) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {s.bar.map((x: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && s.op && <span className="text-2xl font-extrabold text-utama">{s.op === "-" ? "−" : s.op}</span>}
          <BatangPecahan a={x.a} b={x.b} tampil={tampil} sembunyi={x.sembunyi} sorot={tampil && s.sorot === i} />
        </div>
      ))}
      {s.hasil && (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-utama">=</span>
          {tampil ? <BatangPecahan a={s.hasil.a} b={s.hasil.b} /> : <span className="grid h-16 w-16 place-items-center rounded-xl bg-[#FFF7ED] text-2xl font-extrabold text-jingga ring-2 ring-jingga">?</span>}
        </div>
      )}
    </div>
  );
}

function PecahanKali({ s, tampil }: P) {
  const sel = 140 / Math.max(s.b, s.d);
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <svg viewBox={`0 0 ${s.b * sel + 10} ${s.d * sel + 10}`} className="h-40 w-40">
        {Array.from({ length: s.b * s.d }, (_, i) => {
          const c = i % s.b, r = Math.floor(i / s.b);
          const kol = c < s.a, bar = r < s.c;
          const fill = tampil && kol && bar ? JINGGA : kol ? "#93C5FD" : bar && tampil ? "#FED7AA" : "#F1F5F9";
          return <rect key={i} x={5 + c * sel} y={5 + r * sel} width={sel} height={sel} fill={fill} stroke="#FFFFFF" strokeWidth="1.5" />;
        })}
      </svg>
      <span className="text-sm font-extrabold">
        <MathText text={`$\\frac{${s.a}}{${s.b}} \\times \\frac{${s.c}}{${s.d}}$`} /> {tampil && <MathText text={`$= \\frac{${s.a * s.c}}{${s.b * s.d}}$`} />}
      </span>
    </div>
  );
}

function Persen({ s, tampil }: P) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="grid grid-cols-10 gap-0.5 rounded-lg bg-white p-1 ring-1 ring-garis">
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} className={`h-3.5 w-3.5 rounded-sm ${i < s.p ? (s.diskon ? "bg-salah/70" : "bg-utama") : tampil && s.diskon ? "bg-benar/60" : "bg-[#E2E8F0]"}`} />
        ))}
      </div>
      <div className="text-sm font-bold text-tinta">
        <p>
          100% = <Lbl t={s.total} />
        </p>
        <p className={s.diskon ? "text-salah" : "text-utama"}>{s.p}% = ?</p>
        {tampil && s.hasil && (
          <p className="mt-1 text-jingga-tua">
            → <Lbl t={s.hasil} />
          </p>
        )}
      </div>
    </div>
  );
}

function Rata({ s, tampil }: P) {
  const data: (number | null)[] = s.data;
  const maks = 100, min = 50, H = 120;
  const tinggi = (v: number) => Math.max(6, Math.min(H + 16, ((v - min) / (maks - min)) * H));
  const garisRata = s.target ?? s.hasil;
  return (
    <div className="relative mx-auto flex h-40 max-w-sm items-end justify-center gap-4 border-b-2 border-garis px-4">
      {data.map((v, i) => {
        const nilai = v ?? s.hasil;
        const kosong = v === null && !tampil;
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`text-xs font-extrabold ${v === null ? "text-jingga" : "text-tinta"}`}>{kosong ? "?" : nilai}</span>
            <div className={`w-10 rounded-t-md ${v === null ? "border-2 border-dashed border-jingga bg-[#FFF7ED]" : "bg-gradient-to-t from-utama to-[#60A5FA]"}`} style={{ height: kosong ? tinggi(s.target ?? 75) : tinggi(nilai) }} />
          </div>
        );
      })}
      {(tampil || s.target) && garisRata !== undefined && (
        <div className="absolute inset-x-0 border-t-2 border-dashed border-jingga" style={{ bottom: tinggi(garisRata) }}>
          <span className="absolute -top-5 right-0 rounded bg-jingga px-1.5 text-xs font-extrabold text-white">{garisRata}</span>
        </div>
      )}
    </div>
  );
}

function Data({ s, tampil }: P) {
  const data: number[] = s.nilai;
  if (s.mode === "median") {
    const urut = [...data].sort((a, b) => a - b), tengah = Math.floor(urut.length / 2);
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-1">
          {data.map((v, i) => (
            <span key={i} className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm font-bold ring-1 ring-garis">
              {v}
            </span>
          ))}
        </div>
        {tampil && (
          <>
            <span className="text-redup">↓</span>
            <div className="flex flex-wrap justify-center gap-1">
              {urut.map((v, i) => (
                <span key={i} className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-extrabold ${i === tengah ? "bg-jingga text-white" : "bg-[#DBEAFE] text-utama"}`}>
                  {v}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  const hitung = new Map<number, number>();
  data.forEach((v) => hitung.set(v, (hitung.get(v) ?? 0) + 1));
  const nilai = [...hitung.keys()].sort((a, b) => a - b), puncak = Math.max(...hitung.values());
  return (
    <div className="flex flex-wrap items-end justify-center gap-2">
      {nilai.map((v) => {
        const n = hitung.get(v)!;
        return (
          <div key={v} className="flex flex-col items-center gap-0.5">
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className={`h-4 w-4 rounded-full ${tampil && n === puncak ? "bg-jingga" : "bg-utama"}`} />
            ))}
            <span className={`mt-1 text-xs font-bold ${tampil && n === puncak ? "text-jingga-tua" : "text-redup"}`}>{v}</span>
          </div>
        );
      })}
    </div>
  );
}

function Perjalanan({ s, tampil }: P) {
  const { bahasa } = useBahasa();
  const jam = s.jam ?? s.jarak / s.v;
  const titik = Math.max(1, Math.ceil(jam));
  const W = 600, x0 = 40, x1 = W - 40, X = (k: number) => x0 + (k / jam) * (x1 - x0);
  const fmt = (h: number, m: number) => `${String(h).padStart(2, "0")}${bahasa === "id" ? "." : ":"}${String(m).padStart(2, "0")}`;
  return (
    <svg viewBox={`0 0 ${W} 130`} className="mx-auto w-full max-w-xl">
      <rect x={x0 - 10} y="62" width={x1 - x0 + 20} height="22" rx="11" fill="#475569" />
      <line x1={x0} y1="73" x2={x1} y2="73" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="12 10" />
      {Array.from({ length: titik + 1 }, (_, k) => Math.min(k, jam)).map((k, i) => (
        <g key={i}>
          <line x1={X(k)} y1="56" x2={X(k)} y2="92" stroke={BIRU_MUDA} strokeWidth="3" />
          <text x={X(k)} y="108" textAnchor="middle" fontSize="13" fontWeight="800" fill={GARIS}>
            {tampil ? `${Math.round(k * s.v)} km` : i === 0 ? "0 km" : k === jam ? (s.jarak ? `${s.jarak} km` : "? km") : ""}
          </text>
        </g>
      ))}
      <text x={x0} y="48" fontSize="26">
        🚗
      </text>
      <text x={x1} y="48" fontSize="22" textAnchor="end">
        🏁
      </text>
      <text x={W / 2} y="28" textAnchor="middle" fontSize="14" fontWeight="800" fill={BIRU}>
        {s.v} km/{bahasa === "zh" ? "時" : "h"}
        {s.jarak ? ` · ${s.jarak} km` : ` · ${s.jam} h`}
      </text>
      {(s.mulai || s.selesai) && (
        <>
          <text x={x0} y="126" fontSize="13" fontWeight="800" fill={BIRU}>
            {s.mulai ? fmt(s.mulai[0], s.mulai[1]) : tampil ? fmt(Math.floor((s.selesai[0] * 60 + s.selesai[1] - jam * 60) / 60), (s.selesai[0] * 60 + s.selesai[1] - jam * 60) % 60) : "?"}
          </text>
          <text x={x1} y="126" textAnchor="end" fontSize="13" fontWeight="800" fill={JINGGA}>
            {s.selesai && (s.mulai ? tampil : true) ? fmt(s.selesai[0], s.selesai[1]) : "?"}
          </text>
        </>
      )}
      {tampil && s.hasil && (
        <text x={W / 2} y="126" textAnchor="middle" fontSize="14" fontWeight="900" fill={JINGGA}>
          = {s.hasil} km
        </text>
      )}
    </svg>
  );
}

function Koordinat({ s, tampil }: P) {
  const n = 12, c = 8.5, o = 110;
  const X = (v: number) => o + v * c, Y = (v: number) => o - v * c;
  return (
    <svg viewBox="0 0 220 220" className="mx-auto w-full max-w-[240px]">
      {Array.from({ length: 2 * n + 1 }, (_, i) => i - n).map((v) => (
        <g key={v} stroke="#E2E8F0" strokeWidth="1">
          <line x1={X(v)} y1={Y(-n)} x2={X(v)} y2={Y(n)} />
          <line x1={X(-n)} y1={Y(v)} x2={X(n)} y2={Y(v)} />
        </g>
      ))}
      <line x1={X(-n)} y1={o} x2={X(n)} y2={o} stroke={GARIS} strokeWidth="2" />
      <line x1={o} y1={Y(-n)} x2={o} y2={Y(n)} stroke={GARIS} strokeWidth="2" />
      <circle cx={X(s.dari[0])} cy={Y(s.dari[1])} r="6" fill={BIRU} />
      <text x={X(s.dari[0]) + 8} y={Y(s.dari[1]) - 6} fontSize="13" fontWeight="800" fill={BIRU}>
        A
      </text>
      {tampil && (
        <>
          <path d={`M ${X(s.dari[0])} ${Y(s.dari[1])} H ${X(s.ke[0])} V ${Y(s.ke[1])}`} fill="none" stroke={JINGGA} strokeWidth="3" strokeDasharray="5 4" />
          <circle cx={X(s.ke[0])} cy={Y(s.ke[1])} r="6" fill={JINGGA} />
          <text x={X(s.ke[0]) + 8} y={Y(s.ke[1]) + 14} fontSize="13" fontWeight="800" fill={JINGGA}>
            A′
          </text>
        </>
      )}
    </svg>
  );
}

function Titik({ s, tampil }: P) {
  const gambar = (k: number, warna: string, key: any) => {
    if (s.bentuk === "segitiga") {
      return (
        <div key={key} className="flex flex-col items-center gap-0.5">
          {Array.from({ length: k }, (_, r) => (
            <div key={r} className="flex gap-0.5">
              {Array.from({ length: r + 1 }, (_, i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: warna }} />
              ))}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div key={key} className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${k}, 10px)` }}>
        {Array.from({ length: k * k }, (_, i) => {
          const r = Math.floor(i / k), c = i % k, lapis = Math.max(r, c);
          const w = s.bentuk === "ganjil" && tampil ? [BIRU, JINGGA, BIRU_MUDA, HIJAU][lapis % 4] : warna;
          return <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: w }} />;
        })}
      </div>
    );
  };
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      {s.suku.map((k: number, i: number) => (
        <div key={i} className="flex flex-col items-center gap-1">
          {gambar(k, BIRU, i)}
          <span className="text-xs font-bold text-redup">{s.bentuk === "segitiga" ? (k * (k + 1)) / 2 : s.bentuk === "ganjil" ? (tampil ? k * k : "?") : k * k}</span>
        </div>
      ))}
      {s.tanya && (
        <div className="flex flex-col items-center gap-1">
          {tampil ? gambar(s.tanya, JINGGA, "t") : <span className="grid h-16 w-16 place-items-center rounded-xl bg-[#FFF7ED] text-2xl font-extrabold text-jingga ring-2 ring-jingga">?</span>}
          <span className="text-xs font-extrabold text-jingga">{tampil ? s.jawab : "?"}</span>
        </div>
      )}
    </div>
  );
}

function Pasangan({ s, tampil }: P) {
  const n = s.suku.length, W = Math.max(n * 40, 240);
  const X = (i: number) => 20 + i * 40;
  return (
    <div>
      <svg viewBox={`0 0 ${W} 120`} className="mx-auto w-full max-w-xl">
        {tampil &&
          Array.from({ length: Math.floor(n / 2) }, (_, i) => {
            const a = X(i), b = X(n - 1 - i);
            return <path key={i} d={`M ${a} 80 A ${(b - a) / 2} ${Math.min(60, (b - a) / 3)} 0 0 1 ${b} 80`} fill="none" stroke={[BIRU, JINGGA, BIRU_MUDA, HIJAU][i % 4]} strokeWidth="2.5" />;
          })}
        {s.suku.map((v: number, i: number) => (
          <g key={i}>
            <circle cx={X(i)} cy="94" r="16" fill="#FFFFFF" stroke={GARIS} strokeWidth="2" />
            <text x={X(i)} y="99" textAnchor="middle" fontSize="12" fontWeight="800" fill={GARIS}>
              {v}
            </text>
          </g>
        ))}
      </svg>
      {tampil && (
        <Hasil tampil>
          {`${Math.floor(n / 2)} × ${s.suku[0] + s.suku[n - 1]}${n % 2 ? ` + ${s.suku[Math.floor(n / 2)]}` : ""} = ${s.jawab}`}
        </Hasil>
      )}
    </div>
  );
}

function Satuan({ s, tampil }: P) {
  const sat = (v: number) => (
    <>
      {String(v).slice(0, -1)}
      <span className="rounded bg-[#FFEDD5] px-0.5 text-jingga-tua ring-2 ring-jingga">{v % 10}</span>
    </>
  );
  return (
    <div className="text-center text-3xl font-extrabold text-navy">
      {sat(s.a)} × {sat(s.b)}
      <p className="mt-2 text-base font-bold text-redup">
        {s.a % 10} × {s.b % 10} = {tampil ? (s.a % 10) * (s.b % 10) : "?"} → …<Tanya tampil={tampil} nilai={s.jawab} />
      </p>
    </div>
  );
}

function AreaKali({ s, tampil }: P) {
  const tt = Math.floor(s.a / 10) * 10, o = s.a % 10, W = 260;
  const wt = (tt / s.a) * W, wo = W - wt;
  return (
    <svg viewBox="0 0 300 130" className="mx-auto w-full max-w-sm">
      <rect x="30" y="30" width={wt} height="70" fill="#DBEAFE" stroke={GARIS} strokeWidth="2" />
      <rect x={30 + wt} y="30" width={wo} height="70" fill="#FED7AA" stroke={GARIS} strokeWidth="2" />
      <text x={30 + wt / 2} y="22" textAnchor="middle" fontSize="15" fontWeight="800">
        {tt}
      </text>
      <text x={30 + wt + wo / 2} y="22" textAnchor="middle" fontSize="15" fontWeight="800">
        {o}
      </text>
      <text x="22" y="70" textAnchor="end" fontSize="15" fontWeight="800">
        {s.b}
      </text>
      <text x={30 + wt / 2} y="72" textAnchor="middle" fontSize="16" fontWeight="900" fill={BIRU}>
        {tampil ? tt * s.b : "?"}
      </text>
      <text x={30 + wt + wo / 2} y="72" textAnchor="middle" fontSize="16" fontWeight="900" fill={JINGGA}>
        {tampil ? o * s.b : "?"}
      </text>
      {tampil && (
        <text x="160" y="124" textAnchor="middle" fontSize="15" fontWeight="900" fill={GARIS}>
          {tt * s.b} + {o * s.b} = {s.a * s.b}
        </text>
      )}
    </svg>
  );
}

function Slot({ s, tampil }: P) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {s.pilihan.map((v: number, i: number) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <span className="font-extrabold text-redup">×</span>}
            <span className="flex flex-col items-center">
              <span className="grid h-14 w-12 place-items-center rounded-lg bg-white text-xl font-extrabold text-utama ring-2 ring-utama/40">
                <Tanya tampil={tampil} nilai={v} />
              </span>
              <span className="text-xs font-bold text-redup">{[100, 10, 1][i]}</span>
            </span>
          </div>
        ))}
      </div>
      <Hasil tampil={tampil}>{s.hasil}</Hasil>
    </div>
  );
}

function Pangkat({ s, tampil }: P) {
  const chip = (warna: string, k: number, coret = false) => (
    <span key={k} className={`relative grid h-7 w-7 place-items-center rounded-md text-xs font-extrabold ${warna}`}>
      {s.dasar}
      {coret && tampil && <span className="absolute inset-0 grid place-items-center text-lg text-salah">✕</span>}
    </span>
  );
  const semua = s.a + s.b;
  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: semua }, (_, k) => chip(k < s.a ? "bg-[#DBEAFE] text-utama" : "bg-[#FED7AA] text-jingga-tua", k, k < s.c))}
      </div>
      <p className="mt-2 text-sm font-bold text-redup">
        {s.a} + {s.b} − {s.c} = <Tanya tampil={tampil} nilai={s.jawab} />
      </p>
    </div>
  );
}

function Akar({ s, tampil }: P) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      {s.sisi.map((k: number, i: number) => {
        const c = Math.min(8, 120 / k);
        return (
          <div key={i} className="flex items-end gap-3">
            {i > 0 && s.op && <span className="pb-10 text-2xl font-extrabold text-utama">{s.op}</span>}
            <div className="flex flex-col items-center gap-1">
              <div className="inline-grid gap-px rounded bg-white p-px ring-2 ring-utama" style={{ gridTemplateColumns: `repeat(${k}, ${c}px)` }}>
                {Array.from({ length: k * k }, (_, z) => (
                  <span key={z} style={{ height: c }} className="bg-[#BFDBFE]" />
                ))}
              </div>
              <span className="text-xs font-bold text-redup">{k * k}</span>
              <span className="text-sm font-extrabold">
                <MathText text={`$\\sqrt{${k * k}}$`} /> = <Tanya tampil={tampil} nilai={k} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Pie({ s }: P) {
  let sudut = -90;
  const warna = [BIRU, JINGGA, BIRU_MUDA, EMAS, HIJAU, "#A855F7"];
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <svg viewBox="0 0 200 200" className="h-44 w-44">
        {s.data.map((d: any, i: number) => {
          const a0 = sudut, a1 = sudut + (d.persen / 100) * 360;
          sudut = a1;
          const p = (a: number) => [100 + 90 * Math.cos((a * Math.PI) / 180), 100 + 90 * Math.sin((a * Math.PI) / 180)];
          const [x0, y0] = p(a0), [x1, y1] = p(a1), [xm, ym] = [100 + 55 * Math.cos((((a0 + a1) / 2) * Math.PI) / 180), 100 + 55 * Math.sin((((a0 + a1) / 2) * Math.PI) / 180)];
          return (
            <g key={i}>
              <path d={`M 100 100 L ${x0} ${y0} A 90 90 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={warna[i % 6]} stroke="#FFFFFF" strokeWidth="2" />
              <text x={xm} y={ym + 5} textAnchor="middle" fontSize="14" fontWeight="900" fill="#FFFFFF">
                {d.persen}%
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="grid gap-1 text-sm font-bold">
        {s.data.map((d: any, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ background: warna[i % 6] }} />
            <Lbl t={d.label} /> · {d.persen}%
          </li>
        ))}
      </ul>
    </div>
  );
}

function Akuarium({ s, tampil }: P) {
  const tangki = (tinggi: number, balok: boolean) => (
    <svg viewBox="0 0 175 170" className="h-40 w-40">
      <rect x="20" y={150 - tinggi * 2} width="120" height={tinggi * 2} fill="#7DD3FC" opacity=".7" />
      {balok && <rect x="60" y={150 - (tampil ? 80 : 70)} width="40" height={tampil ? 80 : 70} fill="#D97706" stroke={GARIS} strokeWidth="2" />}
      <path d="M 20 20 V 150 H 140 V 20" fill="none" stroke={GARIS} strokeWidth="4" />
      <text x="146" y={150 - tinggi * 2 + 5} fontSize="12" fontWeight="800" fill={BIRU}>
        {tinggi}
      </text>
      {balok && (
        <text x="80" y={150 - (tampil ? 80 : 70) / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFFFF">
          {tampil ? "40" : "?"}
        </text>
      )}
    </svg>
  );
  return (
    <div className="flex items-center justify-center gap-2">
      {tangki(s.awal, false)}
      <span className="text-2xl text-redup">→</span>
      {tangki(s.akhir, true)}
    </div>
  );
}

function Logika({ s, tampil }: P) {
  const posisi = poligonTitik(s.orang.length, 150, 100, 78);
  return (
    <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-sm">
      {s.sama.map(([a, b]: number[], i: number) => (
        <g key={`s${i}`}>
          <line x1={posisi[a][0]} y1={posisi[a][1]} x2={posisi[b][0]} y2={posisi[b][1]} stroke={HIJAU} strokeWidth="3" />
          <text x={(posisi[a][0] + posisi[b][0]) / 2} y={(posisi[a][1] + posisi[b][1]) / 2 - 4} textAnchor="middle" fontSize="18" fontWeight="900" fill={HIJAU}>
            =
          </text>
        </g>
      ))}
      {s.beda.map(([a, b]: number[], i: number) => (
        <g key={`b${i}`}>
          <line x1={posisi[a][0]} y1={posisi[a][1]} x2={posisi[b][0]} y2={posisi[b][1]} stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />
          <text x={(posisi[a][0] + posisi[b][0]) / 2} y={(posisi[a][1] + posisi[b][1]) / 2 - 4} textAnchor="middle" fontSize="18" fontWeight="900" fill="#EF4444">
            ≠
          </text>
        </g>
      ))}
      {s.orang.map((o: string, i: number) => (
        <g key={i}>
          <circle cx={posisi[i][0]} cy={posisi[i][1]} r="20" fill="#FFFFFF" stroke={GARIS} strokeWidth="2" />
          <text x={posisi[i][0]} y={posisi[i][1] + 7} textAnchor="middle" fontSize="18">
            {tampil ? (s.jawab.includes(i) ? "✏️" : "🖊️") : "❔"}
          </text>
          <text x={posisi[i][0]} y={posisi[i][1] + 36} textAnchor="middle" fontSize="11" fontWeight="800" fill={GARIS}>
            {o}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Bersarang({ s, tampil }: P) {
  const lapis: string[] = s.lapis;
  const kotak = (i: number): ReactNode => (
    <div className={`flex flex-wrap items-center justify-center gap-1 rounded-xl p-2 text-sm font-extrabold ${i % 2 ? "bg-[#E0F2FE]" : "bg-[#DBEAFE]"} ring-1 ring-[#93C5FD]`}>
      <MathText text={lapis[i]} />
      {i + 1 < lapis.length && (tampil || s.semua) && kotak(i + 1)}
    </div>
  );
  return (
    <div className="mx-auto max-w-sm">
      {kotak(0)}
      {tampil && s.hasil && <Hasil tampil>{s.hasil}</Hasil>}
    </div>
  );
}

function Mesin({ s, tampil }: P) {
  const n = s.langkah.length;
  const isi = (i: number) => (i === s.tanya ? (tampil ? s.kotak[i] : "?") : i === 0 || i === n || tampil ? s.kotak[i] : "");
  const kotak = (i: number) => (
    <span className={`grid h-12 min-w-12 place-items-center rounded-xl px-2 text-base font-extrabold ${i === s.tanya ? "bg-[#FFF7ED] text-jingga-tua ring-2 ring-jingga" : "bg-white ring-1 ring-garis"}`}>
      <Lbl t={isi(i)} />
    </span>
  );
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {kotak(0)}
      {s.langkah.map((l: string, i: number) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-redup">→</span>
          <span className="rounded-full bg-utama px-2 py-1 text-xs font-extrabold text-white">
            <Lbl t={l} />
          </span>
          <span className="text-redup">→</span>
          {kotak(i + 1)}
        </div>
      ))}
    </div>
  );
}

function Roda({ s, tampil }: P) {
  const total = s.jari.reduce((a: number, r: number) => a + 2 * r, 0);
  const sk = 280 / total;
  const rv = (r: number) => Math.max(r * sk, 13);
  const lebar = s.jari.reduce((a: number, r: number) => a + 2 * rv(r), 0);
  let x = (300 - lebar) / 2;
  return (
    <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-sm">
      {s.jari.map((r: number, i: number) => {
        const cx = x + rv(r);
        x += 2 * rv(r);
        const label = s.putaran[i];
        return (
          <g key={i}>
            <circle cx={cx} cy={110} r={rv(r)} fill={i % 2 ? "#E0F2FE" : "#DBEAFE"} stroke={GARIS} strokeWidth="2" />
            <text x={cx} y={115} textAnchor="middle" fontSize="12" fontWeight="800" fill={GARIS}>
              {r}
            </text>
            {label !== null && label !== undefined && (
              <text x={cx} y={110 - rv(r) - 8} textAnchor="middle" fontSize="13" fontWeight="900" fill={JINGGA}>
                ↻ {label === "?" ? (tampil ? s.jawab : "?") : label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function PersegiDiAtas({ s, tampil }: P) {
  const k = 12;
  const p = s.p * k, l = s.l * k, sisi = s.sisi * k;
  return (
    <svg viewBox={`0 0 ${p + 60} ${l + sisi + 50}`} className="mx-auto w-full max-w-[260px]">
      <rect x="30" y="10" width={sisi} height={sisi} fill="#FED7AA" stroke={GARIS} strokeWidth="2.5" />
      <text x={30 + sisi / 2} y={10 + sisi / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill={JINGGA}>
        16
      </text>
      <rect x="30" y={10 + sisi} width={p} height={l} fill="#DBEAFE" stroke={GARIS} strokeWidth="2.5" />
      {[
        ["F", 24, 6],
        ["E", 30 + sisi + 4, 6],
        ["G", 18, 14 + sisi],
        ["D", 30 + sisi + 4, 22 + sisi],
        ["C", 30 + p + 4, 14 + sisi],
        ["A", 18, 18 + sisi + l],
        ["B", 30 + p + 4, 18 + sisi + l],
      ].map(([t, x, y]) => (
        <text key={t as string} x={x as number} y={y as number} fontSize="12" fontWeight="800" fill={GARIS}>
          {t}
        </text>
      ))}
      <text x={30 + p / 2} y={10 + sisi + l + 22} textAnchor="middle" fontSize="13" fontWeight="800" fill={GARIS}>
        {tampil ? `${s.p} × ${s.l} = ${s.p * s.l}` : "AB : BC : CD = 7 : 5 : 5"}
      </text>
    </svg>
  );
}

function Pythagoras({ s, tampil }: P) {
  return (
    <svg viewBox="0 0 260 220" className="mx-auto w-full max-w-[260px]">
      <path d="M 70 160 A 50 50 0 0 1 70 60" fill="#BFDBFE" stroke={GARIS} strokeWidth="2" />
      <path d="M 70 160 A 60 60 0 0 0 190 160" fill="#FED7AA" stroke={GARIS} strokeWidth="2" />
      <path d="M 70 60 A 78 78 0 0 1 190 160" fill={tampil ? "#FDE68A" : "#F1F5F9"} stroke={GARIS} strokeWidth="2" />
      <polygon points="70,60 70,160 190,160" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" />
      <rect x="70" y="148" width="12" height="12" fill="none" stroke={GARIS} strokeWidth="2" />
      <text x="36" y="114" textAnchor="middle" fontSize="12" fontWeight="900" fill={BIRU}>
        a
      </text>
      <text x="130" y="205" textAnchor="middle" fontSize="12" fontWeight="900" fill={JINGGA}>
        b
      </text>
      <text x="160" y="90" textAnchor="middle" fontSize="13" fontWeight="900" fill={GARIS}>
        c {tampil ? `= ${s.c}` : "= ?"}
      </text>
      <text x="36" y="130" textAnchor="middle" fontSize="11" fontWeight="800" fill={BIRU}>
        {s.a}
      </text>
      <text x="130" y="190" textAnchor="middle" fontSize="11" fontWeight="800" fill={JINGGA}>
        {s.b}
      </text>
    </svg>
  );
}

function Gelinding({ s, tampil }: P) {
  return (
    <svg viewBox="0 0 600 120" className="mx-auto w-full max-w-xl">
      <rect x="10" y="20" width="12" height="80" fill="#94A3B8" />
      <rect x="578" y="20" width="12" height="80" fill="#94A3B8" />
      <line x1="22" y1="100" x2="578" y2="100" stroke={GARIS} strokeWidth="3" />
      {Array.from({ length: s.putaran + 1 }, (_, i) => (
        <line key={i} x1={40 + i * 52} y1="96" x2={40 + i * 52} y2="106" stroke={JINGGA} strokeWidth="2" />
      ))}
      <circle cx="40" cy="80" r="20" fill="#DBEAFE" stroke={GARIS} strokeWidth="2.5" />
      <line x1="40" y1="80" x2="60" y2="80" stroke={GARIS} strokeWidth="2" />
      <text x="300" y="40" textAnchor="middle" fontSize="15" fontWeight="900" fill={BIRU}>
        ↻ × {s.putaran}
      </text>
      <text x="300" y="118" textAnchor="middle" fontSize="13" fontWeight="900" fill={JINGGA}>
        {tampil ? s.hasil : "?"}
      </text>
    </svg>
  );
}

const RENDER: Record<string, (p: P) => ReactNode> = {
  hitung: Hitung, kelompok: Kelompok, susunan: Susunan, garis: Garis, pola: Pola, model: Model, banding: Banding, bagian: Bagian,
  jam: Jam, kalender: Kalender, pp: PersegiPanjang, lingkaran: Lingkaran, balok: Balok, tabung: Tabung, prisma: Prisma,
  poligon: Poligon, catur: Catur, jabat: Jabat, tiang: Tiang, antrian: Antrian, nilaiTempat: NilaiTempat, kartu: Kartu,
  grid: Grid, daftar: Daftar, faktor: Faktor, romawi: Romawi, siklus: Siklus, pecahan: Pecahan, pecahanKali: PecahanKali,
  persen: Persen, rata: Rata, data: Data, perjalanan: Perjalanan, koordinat: Koordinat, titik: Titik, pasangan: Pasangan,
  satuan: Satuan, areaKali: AreaKali, slot: Slot, pangkat: Pangkat, akar: Akar, pie: Pie, akuarium: Akuarium, logika: Logika,
  bersarang: Bersarang, mesin: Mesin, roda: Roda, persegiDiAtas: PersegiDiAtas, pythagoras: Pythagoras, gelinding: Gelinding,
};
// Jenis yang menampilkan s.hasil sendiri (atau memakai s.hasil untuk hal lain).
const HASIL_SENDIRI = new Set(["hitung", "kelompok", "susunan", "model", "banding", "bagian", "grid", "daftar", "bersarang", "slot", "persen", "perjalanan", "rata", "gelinding", "pecahan"]);

export default function Visualisasi({ spes, tampil }: { spes: SpesVisual; tampil: boolean }) {
  const { t } = useBahasa();
  const R = RENDER[spes.j];
  if (!R) return null;
  return (
    <figure className="mt-5 overflow-x-auto rounded-2xl bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF6FF] p-4 ring-1 ring-[#BFDBFE]">
      <figcaption className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-utama">
        <span aria-hidden="true">🐝</span>
        {tampil ? t.visPenyelesaian : t.visJudul}
      </figcaption>
      <R s={spes} tampil={tampil} />
      {!HASIL_SENDIRI.has(spes.j) && <Hasil tampil={tampil}>{spes.hasil}</Hasil>}
    </figure>
  );
}
