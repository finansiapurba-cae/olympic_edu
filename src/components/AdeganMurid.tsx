// Adegan sampul bergerak: murid SD berseragam (kemeja putih, dasi & celana merah, tas merah) melambai,
// dikelilingi benda yang melayang (roket, buku, pensil, bintang, simbol matematika, bola),
// dengan lebah maskot yang terbang mengitarinya. Semua gerakan berhenti bila pengguna memilih "kurangi gerakan".
const KULIT = "#F5C9A3";
const KULIT_GELAP = "#E2A97F";
const RAMBUT = "#1F2937";
const MERAH = "#DC2626";
const MERAH_TUA = "#B91C1C";
const GARIS = "#1E293B";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

function Bintang({ x, y, r, warna = "#FACC15", tunda = 0 }: { x: number; y: number; r: number; warna?: string; tunda?: number }) {
  const titik = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <polygon points={titik} fill={warna} stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" className="kilau" style={{ animationDelay: `${tunda}s` }} />;
}

function Chip({ x, y, isi, warna, tunda }: { x: number; y: number; isi: string; warna: string; tunda: number }) {
  return (
    <g className="melayang" style={{ animationDelay: `${tunda}s`, animationDuration: `${3.6 + tunda}s` }}>
      <circle cx={x} cy={y} r="19" fill="#FFFFFF" stroke={warna} strokeWidth="3.5" />
      <text x={x} y={y + 8} textAnchor="middle" fontSize="22" fontWeight="800" fill={warna} fontFamily={FONT}>
        {isi}
      </text>
    </g>
  );
}

function Awan({ x, y, s, tunda }: { x: number; y: number; s: number; tunda: number }) {
  return (
    <g className="awan" style={{ animationDelay: `${tunda}s` }}>
      <path
        transform={`translate(${x} ${y}) scale(${s})`}
        d="M10 30 Q0 30 0 20 Q0 10 12 10 Q16 0 28 2 Q38 -4 46 6 Q58 4 60 16 Q70 18 68 28 Q66 32 58 32 L12 32 Q10 32 10 30 Z"
        fill="#FFFFFF"
        opacity=".95"
      />
    </g>
  );
}

function LebahKecil() {
  return (
    <g transform="scale(.42)">
      <g className="sayap-lebah">
        <ellipse cx="-14" cy="-42" rx="22" ry="32" transform="rotate(-24 -14 -42)" fill="#E8F1FF" fillOpacity=".9" stroke={GARIS} strokeWidth="4" />
        <ellipse cx="12" cy="-44" rx="18" ry="28" transform="rotate(18 12 -44)" fill="#E8F1FF" fillOpacity=".9" stroke={GARIS} strokeWidth="4" />
      </g>
      <path d="M -48 4 L -66 10 L -48 16 z" fill={GARIS} />
      <ellipse cx="0" cy="0" rx="50" ry="36" fill="#FFC93C" />
      <clipPath id="badan-lebah-kecil">
        <ellipse cx="0" cy="0" rx="50" ry="36" />
      </clipPath>
      <g clipPath="url(#badan-lebah-kecil)">
        <rect x="-22" y="-40" width="13" height="80" fill={GARIS} />
        <rect x="2" y="-40" width="13" height="80" fill={GARIS} />
      </g>
      <ellipse cx="0" cy="0" rx="50" ry="36" fill="none" stroke={GARIS} strokeWidth="5" />
      <circle cx="46" cy="-8" r="26" fill="#FFC93C" stroke={GARIS} strokeWidth="5" />
      <circle cx="41" cy="-12" r="4.5" fill={GARIS} />
      <circle cx="57" cy="-12" r="4.5" fill={GARIS} />
      <path d="M 42 2 Q 49 9 56 2" fill="none" stroke={GARIS} strokeWidth="4" strokeLinecap="round" />
      <path d="M 22 -36 L 48 -48 L 74 -36 L 48 -26 z" fill={GARIS} />
    </g>
  );
}

export default function AdeganMurid({ label, className }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 420 400" className={className} role="img" aria-label={label} overflow="visible">
      <defs>
        <radialGradient id="cahaya-murid" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".85" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="panggung" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#93C5FD" />
        </linearGradient>
      </defs>
      {/* cahaya lembut di belakang murid */}
      <circle cx="210" cy="210" r="160" fill="url(#cahaya-murid)" />

      <Awan x={40} y={96} s={0.9} tunda={0} />
      <Awan x={318} y={54} s={0.7} tunda={2} />

      {/* roket */}
      <g className="melayang" style={{ animationDuration: "5s" }}>
        <g transform="translate(66 48) rotate(40)">
          <path d="M 0 -30 Q 14 -14 12 14 L -12 14 Q -14 -14 0 -30 Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" />
          <circle cx="0" cy="-6" r="6" fill="#38BDF8" stroke={GARIS} strokeWidth="2.5" />
          <path d="M -12 4 L -22 18 L -12 16 Z M 12 4 L 22 18 L 12 16 Z" fill={MERAH} stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M -7 15 Q 0 40 7 15 Z" fill="#FB923C" className="api-roket" />
        </g>
      </g>

      {/* buku terbuka */}
      <g className="melayang" style={{ animationDuration: "4.4s", animationDelay: ".6s" }}>
        <g transform="translate(346 120) rotate(-10)">
          <path d="M 0 0 Q -18 -8 -36 -2 L -36 26 Q -18 20 0 28 Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" strokeLinejoin="round" />
          <path d="M 0 0 Q 18 -8 36 -2 L 36 26 Q 18 20 0 28 Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" strokeLinejoin="round" />
          <path d="M -28 6 L -8 9 M -28 13 L -8 16 M 8 9 L 28 6 M 8 16 L 28 13" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M -38 0 L -38 30 Q -18 24 0 32 Q 18 24 38 30 L 38 0" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinejoin="round" />
        </g>
      </g>

      {/* pensil */}
      <g className="melayang" style={{ animationDuration: "3.8s", animationDelay: "1.2s" }}>
        <g transform="translate(372 232) rotate(-35)">
          <rect x="-7" y="-34" width="14" height="52" rx="2" fill="#FACC15" stroke={GARIS} strokeWidth="3" />
          <rect x="-7" y="-42" width="14" height="9" rx="2" fill="#F9A8D4" stroke={GARIS} strokeWidth="3" />
          <path d="M -7 18 L 0 32 L 7 18 Z" fill="#FDE7C3" stroke={GARIS} strokeWidth="3" strokeLinejoin="round" />
          <path d="M -2.5 27 L 0 32 L 2.5 27 Z" fill={GARIS} />
        </g>
      </g>

      {/* bola */}
      <g className="bola-pantul">
        <g transform="translate(58 286)">
          <circle r="22" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" />
          <path d="M 0 -8 L 8 -2 L 5 8 L -5 8 L -8 -2 Z" fill={GARIS} />
          <path d="M 0 -8 L 0 -21 M 8 -2 L 20 -6 M 5 8 L 12 18 M -5 8 L -12 18 M -8 -2 L -20 -6" stroke={GARIS} strokeWidth="2.5" />
        </g>
      </g>

      <Bintang x={128} y={36} r={11} tunda={0} />
      <Bintang x={300} y={20} r={8} tunda={0.8} />
      <Bintang x={392} y={182} r={9} warna="#FDE68A" tunda={1.4} />
      <Bintang x={30} y={196} r={8} warna="#FDE68A" tunda={2} />

      <Chip x={104} y={150} isi="+" warna="#2563EB" tunda={0.3} />
      <Chip x={330} y={182} isi="×" warna="#F97316" tunda={0.9} />
      <Chip x={92} y={232} isi="π" warna="#0284C7" tunda={1.5} />

      {/* panggung bulat tempat murid berdiri */}
      <ellipse cx="210" cy="388" rx="104" ry="20" fill="#60A5FA" opacity=".35" />
      <ellipse cx="210" cy="380" rx="100" ry="20" fill="url(#panggung)" stroke="#FFFFFF" strokeWidth="3" />
      <ellipse cx="210" cy="378" rx="72" ry="12" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity=".8" />
      <ellipse cx="210" cy="376" rx="54" ry="8" fill="#0F172A" opacity=".16" className="bayangan-napas" />

      {/* murid */}
      <g className="napas">
        {/* tas */}
        <rect x="150" y="200" width="120" height="96" rx="28" fill={MERAH} stroke={GARIS} strokeWidth="3" />
        <rect x="150" y="200" width="120" height="30" rx="15" fill={MERAH_TUA} />
        {/* kaki */}
        <rect x="181" y="322" width="18" height="34" rx="6" fill={KULIT} />
        <rect x="221" y="322" width="18" height="34" rx="6" fill={KULIT} />
        <rect x="181" y="346" width="18" height="10" fill="#FFFFFF" />
        <rect x="221" y="346" width="18" height="10" fill="#FFFFFF" />
        <rect x="171" y="354" width="34" height="20" rx="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
        <rect x="215" y="354" width="34" height="20" rx="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
        <path d="M 173 368 H 203 M 217 368 H 247" stroke="#CBD5E1" strokeWidth="3" />
        {/* celana merah */}
        <path d="M 168 280 H 252 L 258 330 H 222 L 210 306 L 198 330 H 162 Z" fill={MERAH} stroke={GARIS} strokeWidth="3" strokeLinejoin="round" />
        {/* kemeja putih */}
        <path d="M 170 200 Q 210 188 250 200 L 257 290 Q 210 298 163 290 Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" strokeLinejoin="round" />
        <rect x="226" y="236" width="16" height="12" rx="2" fill="none" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="174" y="228" width="16" height="6" fill={MERAH} />
        <rect x="174" y="234" width="16" height="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        {/* tali tas */}
        <path d="M 178 202 Q 174 240 180 284" fill="none" stroke={MERAH_TUA} strokeWidth="9" strokeLinecap="round" />
        <path d="M 242 202 Q 246 240 240 284" fill="none" stroke={MERAH_TUA} strokeWidth="9" strokeLinecap="round" />
        {/* dasi & kerah */}
        <path d="M 205 210 H 215 L 219 248 L 210 260 L 201 248 Z" fill={MERAH} stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 194 196 L 210 212 L 186 214 Z M 226 196 L 210 212 L 234 214 Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
        {/* lengan kiri memegang tali */}
        <path d="M 172 204 Q 154 210 151 236 L 170 240 Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" strokeLinejoin="round" />
        <path d="M 160 238 Q 159 262 174 276" fill="none" stroke={KULIT} strokeWidth="15" strokeLinecap="round" />
        <circle cx="177" cy="278" r="9" fill={KULIT} stroke={KULIT_GELAP} strokeWidth="2" />
        {/* lengan kanan melambai */}
        <g className="lambai">
          <path d="M 248 204 Q 268 210 270 234 L 251 238 Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="3" strokeLinejoin="round" />
          <path d="M 262 232 Q 278 204 286 176" fill="none" stroke={KULIT} strokeWidth="15" strokeLinecap="round" />
          <circle cx="288" cy="166" r="12" fill={KULIT} stroke={KULIT_GELAP} strokeWidth="2" />
          <path d="M 280 158 Q 278 150 282 148 M 287 155 Q 287 146 291 146 M 294 157 Q 296 149 300 150" fill="none" stroke={KULIT_GELAP} strokeWidth="5" strokeLinecap="round" />
        </g>
        {/* leher & kepala */}
        <rect x="200" y="182" width="20" height="18" fill={KULIT_GELAP} />
        <circle cx="152" cy="140" r="13" fill={KULIT} />
        <circle cx="268" cy="140" r="13" fill={KULIT} />
        <circle cx="210" cy="134" r="58" fill={KULIT} />
        {/* rambut */}
        <path
          d="M 151 132 Q 146 72 210 66 Q 274 72 269 132 Q 262 110 246 104 L 242 118 L 230 100 L 220 116 L 210 96 L 200 116 L 190 100 L 178 118 L 174 104 Q 158 110 151 132 Z"
          fill={RAMBUT}
        />
        <path d="M 176 80 L 186 52 L 198 74 L 212 44 L 224 72 L 240 54 L 244 82 Z" fill={RAMBUT} />
        {/* alis */}
        <path d="M 174 118 Q 187 111 199 117 M 221 117 Q 233 111 246 118" fill="none" stroke={RAMBUT} strokeWidth="4.5" strokeLinecap="round" />
        {/* mata berkedip */}
        <g className="kedip">
          <ellipse cx="187" cy="142" rx="12" ry="14" fill="#3B2416" />
          <ellipse cx="233" cy="142" rx="12" ry="14" fill="#3B2416" />
          <circle cx="191" cy="136" r="4.5" fill="#FFFFFF" />
          <circle cx="237" cy="136" r="4.5" fill="#FFFFFF" />
          <circle cx="183" cy="148" r="2" fill="#FFFFFF" />
          <circle cx="229" cy="148" r="2" fill="#FFFFFF" />
        </g>
        {/* pipi, hidung, mulut */}
        <ellipse cx="170" cy="163" rx="9" ry="6" fill="#F9A8A8" opacity=".75" />
        <ellipse cx="250" cy="163" rx="9" ry="6" fill="#F9A8A8" opacity=".75" />
        <path d="M 206 156 Q 210 161 214 156" fill="none" stroke={KULIT_GELAP} strokeWidth="3" strokeLinecap="round" />
        <path d="M 192 167 Q 210 190 228 167 Z" fill="#7F1D1D" stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 195 168 Q 210 173 225 168 L 224 171 Q 210 176 196 171 Z" fill="#FFFFFF" />
        <ellipse cx="210" cy="180" rx="7" ry="4" fill="#F87171" />
      </g>

      {/* lebah terbang mengitari murid */}
      <g className="lebah-orbit" transform="translate(345 268)">
        <LebahKecil />
      </g>
    </svg>
  );
}
