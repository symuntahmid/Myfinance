// Copies the receipt reader (OCR) files from node_modules into public/ocr,
// so the app reads receipts on the phone without any outside server.
import { cpSync, mkdirSync, existsSync } from "node:fs";

const files = [
  ["node_modules/tesseract.js/dist/worker.min.js", "public/ocr/worker.min.js"],
  ["node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js", "public/ocr/tesseract-core-simd-lstm.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js", "public/ocr/tesseract-core-lstm.wasm.js"],
  ["node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz", "public/ocr/lang/eng.traineddata.gz"],
];

try {
  mkdirSync("public/ocr/lang", { recursive: true });

  for (const [from, to] of files) {
    if (existsSync(from)) cpSync(from, to);
  }
} catch (error) {
  console.warn("Receipt reader files were not copied:", error.message);
}
