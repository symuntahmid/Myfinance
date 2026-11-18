"use client";

/* The drawing part of a mind map: a centre, and branches that lead to
   circles. Bigger circle = bigger share. The caller supplies the
   meaning (what the centre says, what colour each circle is). */

export type MapNode = {
  id: string;
  emoji: string;
  label: string; // short text under the circle
  color: string;
  share: number; // 0..1, sets the size
  aria: string;
};

const W = 316;
const H = 322;
const CX = W / 2;
const CY = 156;
const R1 = 104;
const CORE = 46;

export default function MindMapGraph({
  title,
  big,
  small,
  note,
  nodes,
  activeId,
  onPick,
}: {
  title: string;
  big: string;
  small: string;
  note: string;
  nodes: MapNode[];
  activeId: string;
  onPick: (id: string) => void;
}) {
  const count = nodes.length;

  const placed = nodes.map((n, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const r = Math.round(19 + 12 * Math.sqrt(n.share));
    const x = CX + dx * R1;
    const y = CY + dy * R1;

    // A gentle bend, so the branches look grown and not ruled.
    const sx = CX + dx * CORE;
    const sy = CY + dy * CORE;
    const ex = x - dx * r;
    const ey = y - dy * r;
    const bend = (i % 2 === 0 ? 1 : -1) * 14;
    const mx = (sx + ex) / 2 - dy * bend;
    const my = (sy + ey) / 2 + dx * bend;

    return {
      n,
      x,
      y,
      r,
      i,
      path: `M${sx.toFixed(1)},${sy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`,
    };
  });

  return (
    <>
      <style>{`
        @keyframes mmDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes mmPop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: scale(1); } }
        .mm-branch { stroke-dasharray: 1; stroke-dashoffset: 0; animation: mmDraw .9s ease-out both; }
        .mm-node { transform-box: fill-box; transform-origin: center; animation: mmPop .45s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .mm-branch, .mm-node { animation: none; } }
      `}</style>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="group" aria-label={title}>
        <circle cx={CX} cy={CY} r={R1} fill="none" stroke="var(--border)" strokeDasharray="2 6" />

        {placed.map(({ n, path, i }) => (
          <path
            key={`b-${n.id}`}
            d={path}
            pathLength={1}
            fill="none"
            stroke={n.color}
            strokeOpacity={0.55}
            strokeWidth={1.5 + 4 * n.share}
            strokeLinecap="round"
            className="mm-branch"
            style={{ animationDelay: `${0.05 * i}s` }}
          />
        ))}

        <circle cx={CX} cy={CY} r={CORE} fill="var(--primary)" />
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff">
          {big}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--gold)">
          {small}
        </text>
        <text x={CX} y={CY + 26} textAnchor="middle" fontSize="9" fill="#fff" fillOpacity={0.75}>
          {note}
        </text>

        {placed.map(({ n, x, y, r, i }) => {
          const on = n.id === activeId;

          return (
            <g
              key={`n-${n.id}`}
              role="button"
              tabIndex={0}
              aria-label={n.aria}
              aria-pressed={on}
              onClick={() => onPick(n.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onPick(n.id);
              }}
              className="mm-node cursor-pointer outline-none"
              style={{ animationDelay: `${0.35 + 0.06 * i}s` }}
            >
              {on && <circle cx={x} cy={y} r={r + 5} fill="none" stroke={n.color} strokeOpacity={0.35} strokeWidth={4} />}

              <circle cx={x} cy={y} r={r} fill="var(--card)" stroke={n.color} strokeWidth={on ? 3 : 2} />
              <circle cx={x} cy={y} r={r} fill={n.color} fillOpacity={0.12} />

              <text x={x} y={y + r * 0.3} textAnchor="middle" fontSize={Math.round(r * 0.9)}>
                {n.emoji}
              </text>

              <text x={x} y={y + r + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill={n.color}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}
