// Receipt photos, kept small on this phone. One photo per entry.
const KEY = "myfinance-receipts";

function readAll(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function getReceipts(): Record<string, string> {
  if (typeof window === "undefined") return {};

  return readAll();
}

export function saveReceipt(txId: number, dataUrl: string): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [String(txId)]: dataUrl }));
    window.dispatchEvent(new Event("receiptsUpdated"));

    return true;
  } catch {
    return false; // phone storage is full
  }
}

// Shrink a photo so it takes about 50 to 100 KB.
export function shrinkPhoto(file: File, maxSide = 900, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");

      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("no canvas"));

        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };

    img.src = url;
  });
}
