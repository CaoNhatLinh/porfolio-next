import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ insert: vi.fn(), send: vi.fn(), env: vi.fn(), rpc: vi.fn() }));
vi.mock("../app/lib/env/server", () => ({ getServerEnv: mocks.env }));
vi.mock("../app/lib/supabase/admin", () => ({ createSupabaseAdminClient: () => ({ rpc: mocks.rpc, from: () => ({ insert: mocks.insert }) }) }));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));
import { POST } from "../app/api/contact/route";

let requestId = 0;
function request(startedAt = Date.now() - 5000) {
  return new Request("http://localhost/api/contact?lang=vi", {
    method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `test-${++requestId}` },
    body: JSON.stringify({ name: "Linh", email: "hello@example.com", project: "A new product", message: "Let's discuss", formStartedAt: startedAt }),
  });
}

describe("contact delivery contract", () => {
  beforeEach(() => {
    mocks.env.mockReturnValue({ SUPABASE_SERVICE_ROLE_KEY: "test-key", RESEND_API_KEY: "test-email", CONTACT_NOTIFICATION_EMAIL: "owner@example.com", FROM_EMAIL: "from@example.com" });
    mocks.insert.mockResolvedValue({ error: null });
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    mocks.send.mockResolvedValue({ error: null });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it("returns unavailable rather than fake success when storage is missing", async () => {
    mocks.env.mockReturnValue({});
    expect((await POST(request())).status).toBe(503);
  });
  it("does not send email or report success when persistence fails", async () => {
    mocks.insert.mockResolvedValue({ error: { message: "database unavailable" } });
    mocks.send.mockClear();
    expect((await POST(request())).status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("accepts a saved message even if the notification provider fails", async () => {
    mocks.send.mockRejectedValue(new Error("provider unavailable"));
    expect((await POST(request())).status).toBe(201);
    expect(mocks.insert).toHaveBeenCalled();
  });
  it("asks the user to retry instead of silently dropping a fast submission", async () => {
    mocks.insert.mockClear();
    expect((await POST(request(Date.now()))).status).toBe(422);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("rejects a throttled request before storing or emailing it", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    mocks.insert.mockClear();
    expect((await POST(request())).status).toBe(429);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
});
