import { put } from "@vercel/blob";

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Зөвшөөрөгдөөгүй зургийн формат (jpg, png, webp, gif, svg байх ёстой).");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Зургийн хэмжээ 8MB-с хэтэрсэн байна.");
  }
  const ext = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const blob = await put(key, file, { access: "public" });
  return blob.url;
}
