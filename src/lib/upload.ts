import { put } from "@vercel/blob";

const IMAGE_MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

const PDF_MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
const PDF_TYPES = new Set(["application/pdf"]);

async function uploadToBlob(
  file: File,
  folder: string,
  allowedTypes: Set<string>,
  maxSize: number,
  errorMessages: { type: string; size: string }
): Promise<string> {
  if (!allowedTypes.has(file.type)) {
    throw new Error(errorMessages.type);
  }
  if (file.size > maxSize) {
    throw new Error(errorMessages.size);
  }
  const ext = file.name.split(".").pop() || "bin";
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const blob = await put(key, file, { access: "public" });
  return blob.url;
}

export function uploadImage(file: File, folder: string): Promise<string> {
  return uploadToBlob(file, folder, IMAGE_TYPES, IMAGE_MAX_SIZE_BYTES, {
    type: "Зөвшөөрөгдөөгүй зургийн формат (jpg, png, webp, gif, svg байх ёстой).",
    size: "Зургийн хэмжээ 8MB-с хэтэрсэн байна.",
  });
}

export function uploadPdf(file: File, folder: string): Promise<string> {
  return uploadToBlob(file, folder, PDF_TYPES, PDF_MAX_SIZE_BYTES, {
    type: "Зөвхөн PDF файл байх ёстой.",
    size: "PDF файлын хэмжээ 25MB-с хэтэрсэн байна.",
  });
}
