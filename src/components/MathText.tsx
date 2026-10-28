import katex from "katex";
import { useMemo } from "react";

/** Menampilkan teks biasa dengan rumus KaTeX di antara tanda $...$ */
export default function MathText({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(
    () =>
      text.split("$").map((p, i) =>
        i % 2 === 1 ? { math: true, html: katex.renderToString("\\displaystyle " + p, { throwOnError: false }) } : { math: false, html: p },
      ),
    [text],
  );
  return (
    <span className={className}>
      {parts.map((p, i) => (p.math ? <span key={i} dangerouslySetInnerHTML={{ __html: p.html }} /> : <span key={i}>{p.html}</span>))}
    </span>
  );
}
