import { toLatinDigits } from "./voiceParse";

// Find the amount to pay in the text read from a receipt photo.
// Looks for a "Total" line first. Falls back to the biggest sensible amount.
const NUMBER = /\d[\d,.]*\d|\d/g;

// "44,46" and "44.46" are money with cents. "1,250" and "1,250.50" use a thousands comma.
function toNumber(raw: string): number {
  const clean = raw.replace(/\s/g, "");
  const cents = clean.match(/^(.*\d)[.,](\d{1,2})$/);

  if (cents) return Number(`${cents[1].replace(/[.,]/g, "")}.${cents[2]}`);

  return Number(clean.replace(/[.,]/g, ""));
}

function numbersIn(line: string): number[] {
  const tidy = line.replace(/(\d)\s+([.,])\s*(\d)/g, "$1$2$3");

  return (tidy.match(NUMBER) ?? [])
    .map(toNumber)
    .filter((n) => Number.isFinite(n) && n > 0 && n < 10_000_000);
}

const STRONG = /(grand\s*total|total\s*due|amount\s*due|net\s*(amount|payable)|total\s*payable|সর্বমোট|সর্বমোট)/i;
const TOTAL = /(total|মোট|টোটাল|amount|payable|balance)/i;
const SKIP = /(sub\s*-?\s*total|tax|vat|change|cash|tel|phone|date|time|qty|barcode)/i;

export function readReceiptAmount(raw: string): number | null {
  const lines = toLatinDigits(raw)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const pick = (test: RegExp, allowSkip: boolean) => {
    const found: number[] = [];

    lines.forEach((line) => {
      if (!test.test(line)) return;
      if (!allowSkip && SKIP.test(line) && !/total\s*due|amount\s*due/i.test(line)) return;

      const nums = numbersIn(line);

      if (nums.length) found.push(nums[nums.length - 1]);
    });

    return found.length ? Math.max(...found) : null;
  };

  const strong = pick(STRONG, true);

  if (strong) return strong;

  const total = pick(TOTAL, false);

  // Cross-check with Subtotal + Tax when the photo shows both.
  const sub = pick(/sub\s*-?\s*total/i, true);
  const tax = pick(/\b(tax|vat)\b/i, true);

  if (total && sub && tax) {
    const expected = Math.round((sub + tax) * 100) / 100;

    if (Math.abs(expected - total) > 0.02 && expected < sub * 1.5) return expected;
  }

  if (total) return total;

  // Last try: the biggest amount with 2 decimals (prices on a receipt).
  const prices = lines
    .filter((line) => !SKIP.test(line))
    .flatMap(numbersIn)
    .filter((n) => n < 1_000_000);

  return prices.length ? Math.max(...prices) : null;
}

export type ReadProgress = (percent: number) => void;

// Reads the photo on this phone. Nothing is sent anywhere.
// Make small or dim photos easier to read: enlarge, grey, stretch contrast.
export function prepareForReading(source: HTMLCanvasElement): HTMLCanvasElement {
  const longSide = Math.max(source.width, source.height);
  const shortSide = Math.min(source.width, source.height);
  let scale = 1;

  if (shortSide < 1000) scale = Math.min(3, 1400 / shortSide);
  else if (longSide > 2200) scale = 2200 / longSide;

  const canvas = document.createElement("canvas");

  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);

  const ctx = canvas.getContext("2d");

  if (!ctx) return source;

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = image.data;
  const hist = new Array(256).fill(0);

  for (let i = 0; i < px.length; i += 4) {
    const g = Math.round(px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114);

    px[i] = px[i + 1] = px[i + 2] = g;
    hist[g] += 1;
  }

  const total = px.length / 4;
  let low = 0;
  let high = 255;
  let seen = 0;

  for (let v = 0; v < 256; v += 1) {
    seen += hist[v];

    if (seen > total * 0.01) {
      low = v;
      break;
    }
  }

  seen = 0;

  for (let v = 255; v >= 0; v -= 1) {
    seen += hist[v];

    if (seen > total * 0.01) {
      high = v;
      break;
    }
  }

  const range = Math.max(1, high - low);

  for (let i = 0; i < px.length; i += 4) {
    const g = Math.max(0, Math.min(255, ((px[i] - low) * 255) / range));

    px[i] = px[i + 1] = px[i + 2] = g;
  }

  ctx.putImageData(image, 0, 0);

  return canvas;
}

export async function readReceiptPhoto(
  image: string | HTMLCanvasElement,
  onProgress?: ReadProgress
): Promise<number | null> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng", 1, {
    workerPath: "/ocr/worker.min.js",
    corePath: "/ocr",
    langPath: "/ocr/lang",
    logger: (m: { status: string; progress: number }) => {
      if (m.status === "recognizing text") onProgress?.(Math.round(m.progress * 100));
    },
  });

  try {
    const { data } = await worker.recognize(image);

    return readReceiptAmount(data.text);
  } finally {
    await worker.terminate();
  }
}
