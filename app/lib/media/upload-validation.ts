export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const uploadTypes = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/avif", "avif"], ["application/pdf", "pdf"]]);

export function validateUpload(file: { type: string; size: number }, buffer: Buffer): string {
  const extension = uploadTypes.get(file.type);
  if (!extension || file.size < 1 || file.size > MAX_UPLOAD_BYTES) throw new Error("Chọn ảnh JPG/PNG/WebP/AVIF hoặc PDF, tối đa 4 MB.");
  if (!matchesSignature(buffer, file.type)) throw new Error("Nội dung file không khớp với định dạng đã khai báo.");
  return extension;
}

function matchesSignature(buffer: Buffer, type: string): boolean {
  if (type === "application/pdf") return buffer.subarray(0, 8).toString("ascii").startsWith("%PDF-") && buffer.subarray(Math.max(0, buffer.length - 1024)).toString("ascii").includes("%%EOF");
  if (type === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === "image/webp") return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  if (type === "image/avif") return /ftypavi[fs]/.test(buffer.toString("ascii", 4, Math.min(buffer.length, 32)));
  return false;
}
