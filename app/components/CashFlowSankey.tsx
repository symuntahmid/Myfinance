"use client";

import type { CashFlow } from "@/app/data/cashFlow";

export type SankeyNode = {
  id: string;
  label: string;
  amountText: string;
  value: number;
  color: string;
};

type Props = {
  left: SankeyNode[];
  right: SankeyNode[];
  total: number;
  hubLabel: string;
  selected: string | null;
  onSelect: (id: string | null) => void;
};

const W = 360;
const NODE_W = 10;
const HUB_X = 175;
const GAP = 10;
const MIN_NODE = 30;
const PAD = 8;

type Placed = SankeyNode & { y: number; h: number; thick: number };

function place(nodes: SankeyNode[], scale: number, height: number): Placed[] {
  const heights = nodes.map((node) =>
    Math.max(node.value * scale, MIN_NODE)
  );

  const used =
    heights.reduce((sum, value) => sum + value, 0) +
    GAP * Math.max(nodes.length - 1, 0);

  let y = PAD + (height - used) / 2;

  return nodes.map((node, index) => {
    const placed = {
      ...node,
      y,
      h: heights[index],
      thick: Math.max(node.value * scale, 2),
    };

    y += heights[index] + GAP;

    return placed;
  });
}

function link(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  thick: number
) {
  const mid = (x0 + x1) / 2;

  return (
    `M${x0},${y0} C${mid},${y0} ${mid},${y1} ${x1},${y1} ` +
    `L${x1},${y1 + thick} C${mid},${y1 + thick} ${mid},${y0 + thick} ${x0},${y0 + thick} Z`
  );
}

// One shared scale so both sides stay in proportion, shrunk
// until the tallest column fits (minimum node heights can make
// a column taller than the chart).
function fitScale(
  left: SankeyNode[],
  right: SankeyNode[],
  total: number,
  height: number,
  count: number
): number {
  const need = (nodes: SankeyNode[], scale: number) =>
    nodes.reduce(
      (sum, node) => sum + Math.max(node.value * scale, MIN_NODE),
      0
    ) +
    GAP * Math.max(nodes.length - 1, 0);

  let scale = (height - GAP * (count - 1)) / Math.max(total, 1);

  for (
    let i = 0;
    i < 40 && Math.max(need(left, scale), need(right, scale)) > height;
    i += 1
  ) {
    scale *= 0.94;
  }

  return scale;
}

function shorten(text: string): string {
  return text.length > 15 ? `${text.slice(0, 14)}…` : text;
}

export default function CashFlowSankey({
  left,
  right,
  total,
  hubLabel,
  selected,
  onSelect,
}: Props) {
  const count = Math.max(left.length, right.length);
  const height = Math.max(300, count * 56);

  const scale = fitScale(left, right, total, height, count);

  const L = place(left, scale, height);
  const R = place(right, scale, height);

  const hubH = total * scale;
  const hubTop = PAD + (height - hubH) / 2;

  const before = (nodes: Placed[], index: number) =>
    nodes
      .slice(0, index)
      .reduce((sum, item) => sum + item.value * scale, 0);

  const leftLinks = L.map((node, index) => ({
    node,
    hubY: hubTop + before(L, index),
  }));

  const rightLinks = R.map((node, index) => ({
    node,
    hubY: hubTop + before(R, index),
  }));

  const opacityOf = (id: string, base: number) =>
    selected === null ? base : selected === id ? 0.7 : 0.1;

  const textProps = {
    fontSize: 11,
    fill: "var(--foreground)",
    stroke: "var(--card)",
    strokeWidth: 4,
    paintOrder: "stroke" as const,
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${height + PAD * 2}`}
      className="w-full select-none"
      role="img"
      aria-label={hubLabel}
      onClick={() => onSelect(null)}
    >
      {/* flows: sources -> hub */}
      {leftLinks.map(({ node, hubY }) => (
        <path
          key={`l-${node.id}`}
          d={link(
            NODE_W,
            node.y + (node.h - node.thick) / 2,
            HUB_X,
            hubY,
            node.value * scale
          )}
          fill={node.color}
          opacity={opacityOf(node.id, 0.45)}
        />
      ))}

      {/* flows: hub -> destinations */}
      {rightLinks.map(({ node, hubY }) => (
        <path
          key={`r-${node.id}`}
          d={link(
            HUB_X + NODE_W,
            hubY,
            W - NODE_W,
            node.y + (node.h - node.thick) / 2,
            node.value * scale
          )}
          fill={node.color}
          opacity={opacityOf(node.id, 0.45)}
        />
      ))}

      {/* hub */}
      <rect
        x={HUB_X}
        y={hubTop}
        width={NODE_W}
        height={Math.max(hubH, 4)}
        rx={3}
        fill="var(--forest)"
      />

      <text
        x={HUB_X + NODE_W / 2}
        y={hubTop - 6}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill="var(--muted)"
      >
        {hubLabel}
      </text>

      {/* left nodes */}
      {L.map((node) => (
        <g
          key={node.id}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(selected === node.id ? null : node.id);
          }}
          className="cursor-pointer"
        >
          <rect
            x={0}
            y={node.y}
            width={NODE_W}
            height={node.h}
            rx={3}
            fill={node.color}
          />

          <rect
            x={0}
            y={node.y}
            width={HUB_X - 20}
            height={node.h}
            fill="transparent"
          />

          <text
            x={NODE_W + 6}
            y={node.y + node.h / 2 - 2}
            fontWeight={600}
            {...textProps}
          >
            {shorten(node.label)}
          </text>

          <text
            x={NODE_W + 6}
            y={node.y + node.h / 2 + 11}
            {...textProps}
            fill="var(--foreground)"
            fillOpacity={0.75}
          >
            {node.amountText}
          </text>
        </g>
      ))}

      {/* right nodes */}
      {R.map((node) => (
        <g
          key={node.id}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(selected === node.id ? null : node.id);
          }}
          className="cursor-pointer"
        >
          <rect
            x={W - NODE_W}
            y={node.y}
            width={NODE_W}
            height={node.h}
            rx={3}
            fill={node.color}
          />

          <rect
            x={HUB_X + NODE_W + 20}
            y={node.y}
            width={W - HUB_X - NODE_W - 20}
            height={node.h}
            fill="transparent"
          />

          <text
            x={W - NODE_W - 6}
            y={node.y + node.h / 2 - 2}
            textAnchor="end"
            fontWeight={600}
            {...textProps}
          >
            {shorten(node.label)}
          </text>

          <text
            x={W - NODE_W - 6}
            y={node.y + node.h / 2 + 11}
            textAnchor="end"
            {...textProps}
            fill="var(--foreground)"
            fillOpacity={0.75}
          >
            {node.amountText}
          </text>
        </g>
      ))}
    </svg>
  );
}

export type { CashFlow };
