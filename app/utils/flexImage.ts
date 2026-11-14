/* ==========================================
   FLEX IMAGE

   Draws a flex card as a 1080 x 1920 picture
   (Instagram / WhatsApp story size, 9:16).
   Plain canvas drawing, no extra libraries.
========================================== */

export type FlexTheme = {
  from: string;
  to: string;
  fg: string;
};

type Options = {
  emoji: string;
  big: string;
  caption: string;
  theme: FlexTheme;
  footer: string;
};

export const FLEX_W = 1080;
export const FLEX_H = 1920;

const EMOJI_FONT =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

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

export async function renderFlexImage(
  options: Options
): Promise<Blob> {
  const { emoji, big, caption, theme, footer } = options;

  const families = [cssFont("--font-tiro"), cssFont("--font-hind")]
    .filter(Boolean)
    .join(",");

  const display = `${families ? `${families},` : ""}Georgia,serif`;
  const body = `${cssFont("--font-hind") || "system-ui"},system-ui,sans-serif`;

  // Make sure the web fonts are ready before drawing.
  try {
    await Promise.all([
      document.fonts.load(`700 100px ${display}`, big),
      document.fonts.load(`500 50px ${body}`, caption),
    ]);
  } catch {
    /* draw with whatever fonts are available */
  }

  const canvas = document.createElement("canvas");

  canvas.width = FLEX_W;
  canvas.height = FLEX_H;

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("no-canvas");

  /* Background */

  const gradient = ctx.createLinearGradient(0, 0, FLEX_W, FLEX_H);

  gradient.addColorStop(0, theme.from);
  gradient.addColorStop(1, theme.to);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, FLEX_W, FLEX_H);

  /* Soft diamond pattern */

  ctx.save();
  ctx.strokeStyle = theme.fg;
  ctx.globalAlpha = 0.07;
  ctx.lineWidth = 3;

  const step = 140;

  for (let y = -step; y < FLEX_H + step; y += step) {
    for (let x = -step; x < FLEX_W + step; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y);
      ctx.lineTo(x + step, y + step / 2);
      ctx.lineTo(x + step / 2, y + step);
      ctx.lineTo(x, y + step / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }

  ctx.restore();

  ctx.fillStyle = theme.fg;
  ctx.textBaseline = "alphabetic";

  /* Brand (top left) */

  ctx.globalAlpha = 0.7;
  ctx.font = `700 44px ${body}`;
  ctx.fillText("MyFinance", 90, 150);

  /* Big emoji sticker (top right, tilted) */

  ctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(820, 560);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.font = `340px ${EMOJI_FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(emoji, 0, 0);
  ctx.restore();

  /* Headline: shrink until it fits in 4 lines */

  ctx.textAlign = "left";

  let size = 210;
  let lines: string[] = [];

  while (size >= 80) {
    ctx.font = `700 ${size}px ${display}`;
    lines = wrap(ctx, big, FLEX_W - 180);

    if (lines.length <= 4) break;

    size -= 8;
  }

  const lineHeight = size * 1.08;
  const blockHeight = lines.length * lineHeight;
  const bottom = 1470;
  let y = bottom - blockHeight + size * 0.85;

  ctx.fillStyle = theme.fg;

  lines.forEach((line) => {
    ctx.fillText(line, 90, y);
    y += lineHeight;
  });

  /* Caption */

  ctx.globalAlpha = 0.85;
  ctx.font = `500 58px ${body}`;

  wrap(ctx, caption, FLEX_W - 180).forEach((line, index) => {
    ctx.fillText(line, 90, bottom + 90 + index * 74);
  });

  /* Footer */

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
