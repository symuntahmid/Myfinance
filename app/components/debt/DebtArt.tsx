"use client";

/* Small hand-drawn scenes for the Debt Planner.
   Rice field + farmer (grows as debt shrinks), shopkeeper, office worker.
   Plain SVG, gentle movement only (switched off for reduced motion). */

export type Stage = 0 | 1 | 2 | 3 | 4;

export function stageOf(percent: number, done: boolean): Stage {
  if (done) return 4;
  if (percent >= 75) return 3;
  if (percent >= 50) return 2;
  if (percent >= 25) return 1;
  return 0;
}

const SKY = ["#dde5d3", "#e3ecd0", "#eef2c9", "#f9efbd", "#ffe7a3"];
const GROUND = ["#9c7a52", "#8e9c55", "#79a04b", "#a3a74a", "#cfa83b"];
const STALK = ["#6f8f3e", "#6fae4a", "#4f9a3f", "#86b53f", "#dba82a"];
const SUN_Y = [98, 86, 70, 56, 44];
const SKIN = "#a9744a";

function Farmer({ x, y, stage }: { x: number; y: number; stage: Stage }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="dp-bob">
        {/* legs */}
        <rect x="-6" y="-22" width="4.5" height="22" rx="2" fill={SKIN} />
        <rect x="1.5" y="-22" width="4.5" height="22" rx="2" fill={SKIN} />
        {/* lungi */}
        <path d="M-10 -40 L10 -40 L12 -20 L-12 -20 Z" fill="#efe9d6" stroke="#2e7d4f" strokeWidth="0.8" />
        <path d="M-5 -40 L-6 -20 M0 -40 L0 -20 M5 -40 L6 -20" stroke="#2e7d4f" strokeWidth="0.5" opacity="0.6" />
        {/* body */}
        <path d="M-8 -40 L-8 -62 Q0 -66 8 -62 L8 -40 Z" fill={SKIN} />
        {/* gamchha over the shoulder */}
        <path d="M-8 -62 L8 -46 L8 -41 L-8 -57 Z" fill="#c0392b" />
        {/* far arm */}
        <path d="M-7 -60 L-11 -44" stroke={SKIN} strokeWidth="4" strokeLinecap="round" />
        {/* head */}
        <circle cx="0" cy="-72" r="7" fill={SKIN} />
        <circle cx="-2.6" cy="-72.5" r="0.9" fill="#2b2118" />
        <circle cx="2.6" cy="-72.5" r="0.9" fill="#2b2118" />
        <path
          d={stage === 4 ? "M-3 -69 Q0 -65.5 3 -69" : "M-2.5 -68.5 L2.5 -68.5"}
          stroke="#2b2118"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />
        {/* straw hat */}
        <ellipse cx="0" cy="-77" rx="14" ry="3.5" fill="#e2b955" stroke="#b58a2c" strokeWidth="0.8" />
        <path d="M-9 -77 L0 -93 L9 -77 Z" fill="#e8c46a" stroke="#b58a2c" strokeWidth="0.8" />
        {/* near arm */}
        {stage === 4 ? (
          <g className="dp-wave" style={{ transformOrigin: "0% 100%" }}>
            <path d="M7 -60 L17 -78" stroke={SKIN} strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : (
          <>
            <path d="M7 -60 L17 -48" stroke={SKIN} strokeWidth="4" strokeLinecap="round" />
            <path d="M17 -48 Q28 -50 27 -62" stroke="#8a8f94" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
    </g>
  );
}

export function RiceField({
  stage,
  farmer = true,
  className = "",
}: {
  stage: Stage;
  farmer?: boolean;
  className?: string;
}) {
  const height = [0, 9, 17, 25, 30][stage];
  const rows = [112, 125, 138];

  return (
    <svg
      viewBox="0 0 320 150"
      role="img"
      aria-hidden="true"
      className={`block w-full ${className}`}
    >
      <rect width="320" height="150" fill={SKY[stage]} />

      {/* sun */}
      <circle cx="150" cy={SUN_Y[stage]} r="22" fill="#f4b942" opacity="0.25" />
      <circle cx="150" cy={SUN_Y[stage]} r="13" fill="#f4b942" opacity={stage === 0 ? 0.55 : 1} />

      {/* clouds */}
      <g fill="#fff" opacity="0.7" className="dp-bob">
        <ellipse cx="60" cy="26" rx="22" ry="6" />
        <ellipse cx="74" cy="21" rx="14" ry="6" />
        <ellipse cx="250" cy="36" rx="20" ry="5" />
      </g>

      {/* far tree line + palms */}
      <path d="M0 98 Q40 82 80 96 T160 94 T240 92 T320 96 V104 H0 Z" fill="#7fa05f" opacity="0.55" />
      {[30, 52, 288].map((px, i) => (
        <g key={px} transform={`translate(${px} ${i === 1 ? 4 : 0})`}>
          <path d="M0 100 Q2 84 -1 70" stroke="#6b5a3a" strokeWidth="2.4" fill="none" />
          {[-60, -25, 15, 55].map((rot) => (
            <ellipse
              key={rot}
              cx="-1"
              cy="66"
              rx="10"
              ry="2.6"
              fill="#4f8a45"
              transform={`rotate(${rot} -1 70)`}
            />
          ))}
        </g>
      ))}

      {/* ground */}
      <rect y="100" width="320" height="50" fill={GROUND[stage]} />
      <rect y="100" width="320" height="3" fill="#fff" opacity="0.25" />

      {/* rice rows */}
      {rows.map((y, r) => {
        const out = [];
        const scale = 0.8 + r * 0.15;

        for (let i = 0, x = 10 + (r % 2) * 10; x < 312; i += 1, x += 20) {
          if (stage === 0) {
            out.push(
              <ellipse key={`${r}-${i}`} cx={x} cy={y} rx="1.8" ry="1.1" fill="#5b4328" />
            );
            continue;
          }

          const h = height * scale;

          out.push(
            <g
              key={`${r}-${i}`}
              className="dp-sway"
              style={{ animationDelay: `${((i * 7 + r * 3) % 20) / 10}s` }}
            >
              <path
                d={`M${x} ${y} Q${x + 1.5} ${y - h * 0.6} ${x + 4} ${y - h}`}
                stroke={STALK[stage]}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {stage >= 2 && (
                <path
                  d={`M${x + 1} ${y - h * 0.45} q-6 -3 -9 -1`}
                  stroke={STALK[stage]}
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              {stage >= 3 && (
                <ellipse
                  cx={x + 4.5}
                  cy={y - h - 3}
                  rx="1.9"
                  ry="4.2"
                  fill="#e0b23a"
                  transform={`rotate(14 ${x + 4.5} ${y - h - 3})`}
                />
              )}
            </g>
          );
        }

        return <g key={r}>{out}</g>;
      })}

      {farmer && <Farmer x={272} y={132} stage={stage} />}
    </svg>
  );
}

export function Shopkeeper({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 130" role="img" aria-hidden="true" className={`block w-full ${className}`}>
      {/* awning */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} fill={i % 2 ? "#f3d27a" : "#c9503c"}>
          <rect x={20 + i * 15} y="8" width="15" height="20" />
          <circle cx={27.5 + i * 15} cy="28" r="7.5" />
        </g>
      ))}
      {/* shelf and jars */}
      <rect x="28" y="56" width="104" height="3" fill="#8a6a43" />
      {["#e2b955", "#c9503c", "#4f8f9a", "#79a04b", "#e2b955", "#c9503c"].map((c, i) => (
        <rect key={i} x={34 + i * 16} y="44" width="11" height="12" rx="2" fill={c} />
      ))}
      {/* shopkeeper */}
      <g className="dp-bob">
        <rect x="58" y="80" width="44" height="30" rx="8" fill="#4f8f9a" />
        <circle cx="80" cy="70" r="11" fill={SKIN} />
        <path d="M68 66 Q80 50 92 66 Z" fill="#f6f1e2" stroke="#d8d3c2" strokeWidth="0.8" />
        <circle cx="76" cy="71" r="1.1" fill="#2b2118" />
        <circle cx="84" cy="71" r="1.1" fill="#2b2118" />
        <path d="M74 76 Q80 74 86 76" stroke="#2b2118" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M76 79 Q80 82 84 79" stroke="#2b2118" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
      {/* counter + khata (ledger) */}
      <rect x="16" y="102" width="128" height="22" rx="3" fill="#8a6a43" />
      <rect x="16" y="102" width="128" height="4" fill="#a3825a" />
      <rect x="100" y="94" width="28" height="10" rx="1.5" fill="#2e7d4f" />
      <path d="M105 98 H123 M105 101 H119" stroke="#f6f1e2" strokeWidth="1" />
    </svg>
  );
}

export function Employee({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 130" role="img" aria-hidden="true" className={`block w-full ${className}`}>
      {/* coins rising */}
      {[
        [112, 64, 0],
        [128, 56, 1.1],
        [120, 44, 2.2],
      ].map(([cx, cy, delay]) => (
        <g key={`${cx}`} className="dp-float" style={{ animationDelay: `${delay}s` }}>
          <circle cx={cx} cy={cy} r="7" fill="#f4c542" stroke="#c9961a" strokeWidth="1" />
          <text x={cx} y={Number(cy) + 3} fontSize="8" fontWeight="700" fill="#8a6a1a" textAnchor="middle">
            ৳
          </text>
        </g>
      ))}
      {/* person */}
      <g className="dp-bob">
        <rect x="50" y="78" width="46" height="32" rx="8" fill="#fbfaf4" stroke="#d8d3c2" />
        <path d="M70 78 L73 96 L76 78 Z" fill="#2e7d4f" />
        <path d="M62 78 L73 88 L84 78" stroke="#d8d3c2" strokeWidth="1.2" fill="none" />
        <path d="M66 78 L70 98" stroke="#c9961a" strokeWidth="1" />
        <rect x="64" y="96" width="9" height="11" rx="1.5" fill="#e2b955" stroke="#b58a2c" strokeWidth="0.6" />
        <circle cx="73" cy="64" r="12" fill={SKIN} />
        <path d="M61 62 Q73 44 85 62 Q73 55 61 62 Z" fill="#2b2118" />
        <circle cx="69" cy="66" r="1.1" fill="#2b2118" />
        <circle cx="77" cy="66" r="1.1" fill="#2b2118" />
        <path d="M68 71 Q73 75 78 71" stroke="#2b2118" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
      {/* desk + laptop */}
      <rect x="14" y="104" width="132" height="12" rx="3" fill="#8a6a43" />
      <rect x="14" y="104" width="132" height="4" fill="#a3825a" />
      <rect x="100" y="86" width="34" height="19" rx="2" fill="#cfd6cf" stroke="#9aa59b" />
      <rect x="104" y="90" width="26" height="11" rx="1" fill="#2e7d4f" opacity="0.8" />
    </svg>
  );
}

export function FarmerOnly({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 110" role="img" aria-hidden="true" className={`block w-full ${className}`}>
      <ellipse cx="45" cy="102" rx="26" ry="4" fill="#1f3d2b" opacity="0.12" />
      <Farmer x={45} y={100} stage={0} />
    </svg>
  );
}
