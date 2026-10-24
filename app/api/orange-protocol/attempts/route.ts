import { protocolEnabled, PROTOCOL_VERSION } from "../../../features/orange-protocol/config";
import { consumeProtocolAttempt } from "../../../features/orange-protocol/rate-limit";
import { verifyProtocolCode } from "../../../features/orange-protocol/verification";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
function error(code: string, status: number, extra = {}) {
  return Response.json({ error: { code } }, { status, headers: { ...headers, ...extra } });
}

async function readInput(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty body");
  let text = ""; let size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 512) { await reader.cancel(); throw new Error("Body too large"); }
      text += decoder.decode(chunk.value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as { code?: unknown; version?: unknown };
  } finally { reader.releaseLock(); }
}

export async function POST(request: Request) {
  if (!protocolEnabled) return error("DISABLED", 404);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return error("INVALID_ORIGIN", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return error("INVALID_INPUT", 415);
  let input;
  try { input = await readInput(request); } catch { return error("INVALID_INPUT", 400); }
  if (!input || typeof input.code !== "string" || input.code.length > 32 || !input.code.trim()) return error("INVALID_INPUT", 422);
  if (input.version !== PROTOCOL_VERSION) return error("VERSION_CHANGED", 409);
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  try {
    if (!await consumeProtocolAttempt(ip)) return error("RATE_LIMITED", 429, { "Retry-After": String(60 - Math.floor(Date.now() / 1000) % 60) });
  } catch { return error("UNAVAILABLE", 503); }
  if (!verifyProtocolCode(input.code)) return error("INCORRECT", 422);
  return Response.json({ ok: true, reward: "night-orchard" }, { headers });
}
