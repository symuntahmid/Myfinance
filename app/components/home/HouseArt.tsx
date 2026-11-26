"use client";

/* A home that gets built as you save: plot, foundation, walls, tin roof,
   and finally lights on. Plain SVG, gentle movement only. */

export type HouseStage = 0 | 1 | 2 | 3 | 4;

export function houseStage(percent: number): HouseStage {
  if (percent >= 100) return 4;
  if (percent >= 75) return 3;
  if (percent >= 50) return 2;
  if (percent >= 25) return 1;
  return 0;
}

const SKY = ["#dde5d3", "#e3ecd0", "#eef2c9", "#f9efbd", "#ffe7a3"];

export function HouseScene({
  stage,
  compact = false,
  className = "",
}: {
  stage: HouseStage;
  compact?: boolean;
  className?: string;
}) {
  const scaffold = stage >= 1 && stage <= 3;

  return (
    <svg
      viewBox="0 0 320 150"
      preserveAspectRatio={compact ? "xMidYMax slice" : "xMidYMid meet"}
      role="img"
      aria-hidden="true"
      className={`block w-full ${compact ? "h-28" : ""} ${className}`}
    >
      <rect width="320" height="150" fill={SKY[stage]} />

      <circle cx="268" cy="40" r="20" fill="#f4b942" opacity="0.25" />
      <circle cx="268" cy="40" r="12" fill="#f4b942" opacity={stage === 0 ? 0.6 : 1} />

      <g fill="#fff" opacity="0.7" className="dp-bob">
        <ellipse cx="60" cy="28" rx="22" ry="6" />
        <ellipse cx="74" cy="23" rx="14" ry="6" />
        <ellipse cx="210" cy="22" rx="18" ry="5" />
      </g>

      {/* ground */}
      <path d="M0 108 Q80 98 160 106 T320 104 V150 H0 Z" fill="#8fae62" />
      <rect y="124" width="320" height="26" fill="#7a9a54" />

      {/* palms */}
      {[34, 292].map((px) => (
        <g key={px} transform={`translate(${px} 0)`}>
          <path d="M0 118 Q3 96 -1 76" stroke="#6b5a3a" strokeWidth="2.6" fill="none" />
          {[-60, -25, 15, 55].map((rot) => (
            <ellipse
              key={rot}
              cx="-1"
              cy="72"
              rx="11"
              ry="2.8"
              fill="#4f8a45"
              transform={`rotate(${rot} -1 76)`}
            />
          ))}
        </g>
      ))}

      {/* 0: the plot, pegged out */}
      <rect
        x="108"
        y="116"
        width="104"
        height="12"
        fill="none"
        stroke="#fff"
        strokeWidth="1.4"
        strokeDasharray="4 3"
        opacity={stage === 0 ? 1 : 0}
      />
      {stage === 0 &&
        [108, 212].flatMap((x) =>
          [116, 128].map((y) => (
            <rect key={`${x}${y}`} x={x - 1.5} y={y - 7} width="3" height="9" fill="#8a6a43" />
          ))
        )}

      {/* 1: foundation */}
      {stage >= 1 && <rect x="106" y="116" width="108" height="12" rx="1.5" fill="#9a8f80" />}

      {/* 2: walls */}
      {stage >= 2 && (
        <g>
          <rect x="112" y="80" width="96" height="37" fill="#ecdcb8" />
          <rect x="112" y="80" width="96" height="3" fill="#d6c496" />
        </g>
      )}

      {/* bamboo scaffold while it is going up */}
      {scaffold && (
        <g stroke="#b79a5a" strokeWidth="2" strokeLinecap="round">
          <path d="M104 128 V80 M216 128 V80" />
          <path d="M100 118 H220 M100 100 H220 M104 84 H216" strokeWidth="1.4" />
        </g>
      )}

      {/* 3: tin roof */}
      {stage >= 3 && (
        <g>
          <path d="M102 84 L160 50 L218 84 Z" fill="#8a97a0" />
          <path d="M120 74 L160 52 L200 74" stroke="#a9b4bb" strokeWidth="1.2" fill="none" />
          <path d="M112 80 L160 56 L208 80" stroke="#a9b4bb" strokeWidth="1.2" fill="none" />
          <rect x="102" y="82" width="116" height="3" fill="#6f7b84" />
        </g>
      )}

      {/* door and windows */}
      {stage >= 3 && (
        <g>
          <rect x="150" y="96" width="20" height="21" rx="2" fill="#8a6a43" />
          <rect x="122" y="92" width="16" height="14" rx="1.5" fill={stage === 4 ? "#f4c542" : "#4f8f9a"} />
          <rect x="182" y="92" width="16" height="14" rx="1.5" fill={stage === 4 ? "#f4c542" : "#4f8f9a"} />
          <path d="M130 92 V106 M122 99 H138 M190 92 V106 M182 99 H198" stroke="#8a6a43" strokeWidth="1" />
        </g>
      )}

      {/* 4: garland, light and a mango tree */}
      {stage === 4 && (
        <g>
          <g className="dp-sway">
            <path d="M104 86 Q160 98 216 86" stroke="#c9503c" strokeWidth="1" fill="none" />
            {[116, 132, 148, 164, 180, 196].map((gx, i) => (
              <path
                key={gx}
                d={`M${gx} ${91 + (i % 3)} l4 0 l-2 6 Z`}
                fill={i % 2 ? "#f4c542" : "#c9503c"}
              />
            ))}
          </g>
          <rect x="236" y="96" width="4" height="26" fill="#6b5a3a" />
          <circle cx="238" cy="92" r="16" fill="#4f8a45" />
          <circle cx="230" cy="98" r="9" fill="#5a9a4e" />
          <circle cx="231" cy="96" r="2.2" fill="#f4b942" />
          <circle cx="244" cy="90" r="2.2" fill="#f4b942" />
        </g>
      )}
    </svg>
  );
}
