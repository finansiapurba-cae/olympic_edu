// Sarang madu: segi enam runcing ke atas. Beberapa sel berisi simbol matematika.
const R = 30;
const HEX = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 180) * (60 * i - 90);
  return `${(R * Math.cos(a)).toFixed(1)},${(R * Math.sin(a)).toFixed(1)}`;
}).join(" ");
const W = Math.sqrt(3) * R;
type Isi = "madu" | "jingga" | undefined;
const SEL: { k: number; b: number; isi?: string; w?: Isi }[] = [
  { k: 0, b: 0, isi: "+", w: "madu" }, { k: 1, b: 0, isi: "7" }, { k: 2, b: 0, isi: "×", w: "jingga" },
  { k: 0, b: 1, isi: "π" }, { k: 1, b: 1, isi: "Σ", w: "madu" }, { k: 2, b: 1, isi: "÷" }, { k: 3, b: 1, w: "jingga" },
  { k: 0, b: 2, w: "jingga" }, { k: 1, b: 2, isi: "√" }, { k: 2, b: 2, isi: "=", w: "madu" }, { k: 3, b: 2, isi: "3" },
  { k: 1, b: 3, isi: "−" }, { k: 2, b: 3, w: "madu" },
];
const WARNA = { madu: ["#F5B700", "#FFD84D"], jingga: ["#F2841B", "#FFA94D"] };
// Jejak terbang membentuk pola bilangan 2, 4, 6, 8, ... dan lebah membawa jawabannya.
const JEJAK = [
  { x: 200, y: 244, n: "2" },
  { x: 236, y: 192, n: "4" },
  { x: 284, y: 160, n: "6" },
  { x: 334, y: 156, n: "8" },
];

/** Ilustrasi maskot: lebah bertopi wisuda di atas sarang madu berisi simbol matematika. */
export default function IlustrasiLebah({ label, className }: { label: string; className?: string }) {
  return (
    <svg viewBox="34 40 440 380" className={className} overflow="visible" role="img" aria-label={label}>
      <defs>
        <linearGradient id="warna-lebah" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD43B" />
          <stop offset="1" stopColor="#F2841B" />
        </linearGradient>
        <clipPath id="badan-lebah">
          <ellipse cx="0" cy="0" rx="50" ry="36" />
        </clipPath>
      </defs>

      {/* sarang madu */}
      <g transform="translate(70 230)">
        {SEL.map((c) => {
          const x = c.k * W + (c.b % 2 ? W / 2 : 0);
          const y = c.b * R * 1.5;
          return (
            <g key={`${c.k}-${c.b}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} className="sel-sarang" style={{ animationDelay: `${(c.k + c.b) * 0.15}s` }}>
              <polygon points={HEX} fill={c.w ? WARNA[c.w][0] : "#FFFFFF"} stroke="#142849" strokeWidth="3" strokeLinejoin="round" />
              {c.w && <polygon points={HEX} transform="scale(.62)" fill={WARNA[c.w][1]} />}
              {c.isi && (
                <text y="9" textAnchor="middle" fontSize="26" fontWeight="800" fill="#142849" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                  {c.isi}
                </text>
              )}
            </g>
          );
        })}
        {/* tetesan madu */}
        <path d="M 130 166 q 6 14 0 22 q -6 -8 0 -22 z" fill="#F5B700" stroke="#142849" strokeWidth="2.5" className="tetes-madu" />
      </g>

      {/* jejak terbang: pola bilangan */}
      <path d="M 200 244 C 210 220, 222 204, 236 192 C 252 178, 266 166, 284 160 C 302 154, 318 152, 334 156 C 346 159, 354 162, 362 162" fill="none" stroke="#142849" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" className="jejak-terbang" />
      {JEJAK.map((j) => (
        <g key={j.n} transform={`translate(${j.x} ${j.y})`}>
          <circle r="17" fill="#FFFFFF" stroke="#142849" strokeWidth="3" />
          <text y="7" textAnchor="middle" fontSize="19" fontWeight="800" fill="#B8520A" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
            {j.n}
          </text>
        </g>
      ))}

      {/* lebah */}
      <g transform="translate(378 92)">
        <g className="lebah-terbang">
          {/* sayap */}
          <g className="sayap-lebah">
            <ellipse cx="-14" cy="-42" rx="22" ry="32" transform="rotate(-24 -14 -42)" fill="#E8F1FF" fillOpacity=".9" stroke="#142849" strokeWidth="3" />
            <ellipse cx="12" cy="-44" rx="18" ry="28" transform="rotate(18 12 -44)" fill="#E8F1FF" fillOpacity=".9" stroke="#142849" strokeWidth="3" />
          </g>
          {/* sengat */}
          <path d="M -48 4 L -66 10 L -48 16 z" fill="#142849" />
          {/* badan bergaris */}
          <ellipse cx="0" cy="0" rx="50" ry="36" fill="url(#warna-lebah)" />
          <g clipPath="url(#badan-lebah)">
            <rect x="-22" y="-40" width="13" height="80" fill="#142849" />
            <rect x="2" y="-40" width="13" height="80" fill="#142849" />
          </g>
          <ellipse cx="0" cy="0" rx="50" ry="36" fill="none" stroke="#142849" strokeWidth="4" />
          {/* kepala */}
          <circle cx="46" cy="-8" r="26" fill="#F5C518" stroke="#142849" strokeWidth="4" />
          <circle cx="40" cy="-12" r="6.5" fill="#FFFFFF" stroke="#142849" strokeWidth="2" />
          <circle cx="56" cy="-12" r="6.5" fill="#FFFFFF" stroke="#142849" strokeWidth="2" />
          <circle cx="41.5" cy="-11" r="3.2" fill="#142849" />
          <circle cx="57.5" cy="-11" r="3.2" fill="#142849" />
          <circle cx="35" cy="0" r="4" fill="#F59E8B" opacity=".8" />
          <circle cx="63" cy="0" r="4" fill="#F59E8B" opacity=".8" />
          <path d="M 42 2 Q 49 9 56 2" fill="none" stroke="#142849" strokeWidth="3" strokeLinecap="round" />
          {/* topi wisuda */}
          <path d="M 22 -36 L 48 -48 L 74 -36 L 48 -26 z" fill="#142849" />
          <rect x="38" y="-34" width="20" height="9" rx="2" fill="#142849" />
          <path d="M 70 -37 L 74 -22" stroke="#F5C518" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="74" cy="-20" r="3.5" fill="#F5C518" />
          {/* kaki membawa jawaban */}
          <path d="M -6 34 L -10 50 M 10 34 L 12 50" stroke="#142849" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(1 74)">
            <polygon points={HEX} transform="scale(.85)" fill="#FFFFFF" stroke="#142849" strokeWidth="3" />
            <text y="8" textAnchor="middle" fontSize="22" fontWeight="800" fill="#214A9B" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
              10
            </text>
          </g>
        </g>
      </g>

      {/* kilau kecil */}
      {[
        [130, 70],
        [446, 250],
        [250, 330],
      ].map(([x, y], i) => (
        <path key={i} d={`M ${x} ${y - 9} L ${x + 3} ${y - 3} L ${x + 9} ${y} L ${x + 3} ${y + 3} L ${x} ${y + 9} L ${x - 3} ${y + 3} L ${x - 9} ${y} L ${x - 3} ${y - 3} z`} fill="#F2841B" opacity=".7" className="kilau" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </svg>
  );
}
