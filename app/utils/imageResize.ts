/* Shrinks a chosen photo to a small square JPEG (data URL)
   so it fits easily in localStorage. */

export function fileToAvatar(
  file: File,
  size = 256
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not-image"));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      const side = Math.min(image.width, image.height);
      const canvas = document.createElement("canvas");

      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("no-canvas"));
        return;
      }

      context.drawImage(
        image,
        (image.width - side) / 2,
        (image.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size
      );

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad-image"));
    };

    image.src = url;
  });
}
