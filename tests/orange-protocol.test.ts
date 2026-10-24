import { describe, expect, it, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("../app/features/orange-protocol/rate-limit", () => ({ consumeProtocolAttempt: vi.fn().mockResolvedValue(true) }));
import { normalizeProtocolCode, verifyProtocolCode } from "../app/features/orange-protocol/verification";
import { consumeProtocolAttempt } from "../app/features/orange-protocol/rate-limit";
import { POST } from "../app/api/orange-protocol/attempts/route";

const request = (body: unknown, origin = "http://localhost") => new Request("http://localhost/api/orange-protocol/attempts", {
  method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(body),
});
beforeEach(() => vi.mocked(consumeProtocolAttempt).mockReset().mockResolvedValue(true));
describe("Orange Protocol validation", () => {
  it("normalizes formatting, rejects invalid input and incorrect codes", () => {
    expect(normalizeProtocolCode("abcdefgh ab")).toBe("ABCDEFGH-AB");
    expect(normalizeProtocolCode("<>" )).toBe("");
    expect(verifyProtocolCode("ABCDEFGH-AB")).toBe(false);
  });
  it("rejects cross-origin and oversized requests before rate-limit storage", async () => {
    expect((await POST(request({}, "https://elsewhere.test"))).status).toBe(403);
    expect((await POST(request({ code: "x".repeat(600) }))).status).toBe(400);
    expect(consumeProtocolAttempt).not.toHaveBeenCalled();
  });
  it("rejects missing fields and stale puzzle versions", async () => {
    expect((await POST(request(null))).status).toBe(422);
    expect((await POST(request({ code: "ABCDEFGH-AB", version: "old" }))).status).toBe(409);
  });
  it("fails closed on storage errors and returns a retry delay when throttled", async () => {
    vi.mocked(consumeProtocolAttempt).mockRejectedValueOnce(new Error("offline"));
    expect((await POST(request({ code: "ABCDEFGH-AB", version: "op-1" }))).status).toBe(503);
    vi.mocked(consumeProtocolAttempt).mockResolvedValueOnce(false);
    const response = await POST(request({ code: "ABCDEFGH-AB", version: "op-1" }));
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
