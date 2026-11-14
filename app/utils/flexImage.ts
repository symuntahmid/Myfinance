/* ==========================================
   MILESTONE IMAGE

   Draws one progress milestone as a 1080 x 1920
   picture (Instagram / WhatsApp story size, 9:16).
   Plain canvas drawing, no extra libraries.
========================================== */

export type MilestoneTheme = "ivory" | "ink";

export type MilestoneChart =
  | { kind: "line"; values: number[] }
  | { kind: "bars"; values: number[]; target?: number }
  | { kind: "meter"; value: number; max: number; marks: number[] };

type Options = {
  label: string;
  big: string;
  sub: string;
  period: string;
  chart?: MilestoneChart;
  theme: MilestoneTheme;
  footer: string;
};

export const FLEX_W = 1080;
export const FLEX_H = 1920;

const COLORS = {
  ivory: { bg: "#F5F1E6", ink: "#14110F", accent: "#006A4E", soft: "#D9D2BF" },
  ink: { bg: "#0B1F18", ink: "#F6F0DC", accent: "#E4B85A", soft: "#244238" },
};

function cssFont(name: string): string {
  try {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  } catch {
    return "";
  }
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];

  let line = "";

  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;

    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });

  if (line) lines.push(line);

  return lines;
}

export async function renderMilestoneImage(
  options: Options
): Promise<Blob> {
  const { label, big, sub, period, chart, theme, footer } = options;
  const c = COLORS[theme];

  const families = [cssFont("--font-tiro"), cssFont("--font-hind")]
    .filter(Boolean)
    .join(",");

  const display = `${families ? `${families},` : ""}Georgia,serif`;
  const body = `${cssFont("--font-hind") || "system-ui"},system-ui,sans-serif`;

  try {
    await Promise.all([
      document.fonts.load(`700 100px ${display}`, big),
      document.fonts.load(`500 50px ${body}`, `${label}${sub}`),
    ]);
  } catch {
    /* draw with whatever fonts are available */
  }

  const canvas = document.createElement("canvas");

  canvas.width = FLEX_W;
  canvas.height = FLEX_H;

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("no-canvas");

  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, FLEX_W, FLEX_H);

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  /* Top bar: brand and period */

  ctx.fillStyle = c.ink;
  ctx.font = `700 46px ${body}`;
  ctx.fillText("MyFinance", 90, 150);

  ctx.globalAlpha = 0.6;
  ctx.font = `500 40px ${body}`;
  ctx.textAlign = "right";
  ctx.fillText(period, FLEX_W - 90, 150);
  ctx.textAlign = "left";

  ctx.globalAlpha = 1;
  ctx.fillStyle = c.soft;
  ctx.fillRect(90, 190, FLEX_W - 180, 3);

  /* Label */

  ctx.fillStyle = c.ink;
  ctx.globalAlpha = 0.7;
  ctx.font = `600 56px ${body}`;
  ctx.fillText(label, 90, 470);

  /* Big number, shrunk to fit one line */

  ctx.globalAlpha = 1;

  let size = 230;

  while (size > 90) {
    ctx.font = `700 ${size}px ${display}`;

    if (ctx.measureText(big).width <= FLEX_W - 180) break;

    size -= 8;
  }

  ctx.fillStyle = c.ink;
  ctx.fillText(big, 90, 470 + 60 + size * 0.85);

  /* Sub line */

  ctx.fillStyle = c.accent;
  ctx.font = `600 54px ${body}`;

  const subTop = 470 + 60 + size * 0.85 + 100;

  wrap(ctx, sub, FLEX_W - 180).forEach((line, index) => {
    ctx.fillText(line, 90, subTop + index * 72);
  });

  /* Chart area */

  const x0 = 90;
  const x1 = FLEX_W - 90;
  const top = 1080;
  const bottom = 1560;

  if (chart?.kind === "line" && chart.values.length >= 2) {
    const values = chart.values;
    const min = Math.min(0, ...values);
    const max = Math.max(0, ...values);
    const span = max - min || 1;

    const px = (i: number) => x0 + ((x1 - x0) * i) / (values.length - 1);
    const py = (v: number) => bottom - ((v - min) / span) * (bottom - top);

    // zero line
    ctx.strokeStyle = c.soft;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, py(0));
    ctx.lineTo(x1, py(0));
    ctx.stroke();

    // area
    const area = ctx.createLinearGradient(0, top, 0, bottom);

    area.addColorStop(0, `${c.accent}55`);
    area.addColorStop(1, `${c.accent}00`);

    ctx.fillStyle = area;
    ctx.beginPath();
    ctx.moveTo(px(0), py(0));
    values.forEach((v, i) => ctx.lineTo(px(i), py(v)));
    ctx.lineTo(px(values.length - 1), py(0));
    ctx.closePath();
    ctx.fill();

    // line
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 9;
    ctx.lineJoin = "round";
    ctx.beginPath();
    values.forEach((v, i) =>
      i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))
    );
    ctx.stroke();

    // end dot
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(px(values.length - 1), py(values[values.length - 1]), 18, 0, Math.PI * 2);
    ctx.fill();
  }

  if (chart?.kind === "bars" && chart.values.length > 0) {
    const values = chart.values;
    const max = Math.max(chart.target ?? 0, ...values.map((v) => Math.abs(v)), 1);
    const gap = 26;
    const barW = (x1 - x0 - gap * (values.length - 1)) / values.length;
    const base = bottom;

    values.forEach((v, i) => {
      const h = Math.max((Math.max(v, 0) / max) * (bottom - top), 6);
      const x = x0 + i * (barW + gap);

      ctx.fillStyle = i >= values.length - 3 ? c.accent : c.soft;
      ctx.fillRect(x, base - h, barW, h);
    });

    if (chart.target) {
      const y = base - (chart.target / max) * (bottom - top);

      ctx.strokeStyle = c.ink;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 4;
      ctx.setLineDash([18, 14]);
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
  }

  if (chart?.kind === "meter") {
    const y = (top + bottom) / 2;
    const h = 70;
    const ratio = Math.min(Math.max(chart.value / chart.max, 0), 1);

    ctx.fillStyle = c.soft;
    ctx.fillRect(x0, y, x1 - x0, h);

    ctx.fillStyle = c.accent;
    ctx.fillRect(x0, y, (x1 - x0) * ratio, h);

    ctx.fillStyle = c.ink;
    ctx.globalAlpha = 0.7;
    ctx.font = `500 40px ${body}`;
    ctx.textAlign = "center";

    chart.marks.forEach((mark) => {
      const x = x0 + ((x1 - x0) * mark) / chart.max;

      ctx.fillRect(x - 2, y - 14, 4, h + 28);
      ctx.fillText(String(mark), x, y + h + 80);
    });

    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }

  /* Footer */

  ctx.fillStyle = c.soft;
  ctx.fillRect(90, FLEX_H - 190, FLEX_W - 180, 3);

  ctx.fillStyle = c.ink;
  ctx.globalAlpha = 0.6;
  ctx.font = `600 38px ${body}`;
  ctx.fillText(footer, 90, FLEX_H - 110);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("no-blob"))),
      "image/png"
    );
  });
}
