import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

// A digest, never sent to the browser. The public fragments are the intended way in.
const answerDigest = "1fbadb4d173a8a7c138ad2c7baace00469f79b97bdf90df66548e99c4ff3f82f";

export function normalizeProtocolCode(input: string): string {
  const code = input.normalize("NFKC").toUpperCase().replace(/[\s-]/g, "");
  return /^[A-Z]{8}[A-F0-9]{2}$/.test(code) ? `${code.slice(0, 8)}-${code.slice(8)}` : "";
}

export function verifyProtocolCode(input: string): boolean {
  const normalized = normalizeProtocolCode(input);
  if (!normalized) return false;
  return timingSafeEqual(createHash("sha256").update(normalized).digest(), Buffer.from(answerDigest, "hex"));
}
