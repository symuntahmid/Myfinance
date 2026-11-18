import { toLatinDigits } from "./voiceParse";

// Find the amount to pay in the text read from a receipt photo.
// Looks for a "Total" line first. Falls back to the biggest sensible amount.
const NUMBER = /\d[\d,]*(?:\s?\.\s?\d{1,2})?/g;

function numbersIn(line: string): number[] {
  const tidy = line.replace(/(\d)\s+([.,])\s*(\d)/g, "$1$2$3");

  return (tidy.match(NUMBER) ?? [])
    .map((raw) => Number(raw.replace(/,/g, "").replace(/\s/g, "")))
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
export async function readReceiptPhoto(
  dataUrl: string,
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
    const { data } = await worker.recognize(dataUrl);

    return readReceiptAmount(data.text);
  } finally {
    await worker.terminate();
  }
}
