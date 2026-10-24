import { describe, expect, it } from "vitest";
import { ActionConflictError, failure, runAction } from "../app/lib/errors/action-result";

describe("server action contract", () => {
  it("maps stale writes to a conflict without leaking internals", () => {
    const result = failure(new ActionConflictError());
    expect(result).toEqual({ ok: false, error: { code: "CONFLICT", message: "This content changed in another tab. Reload and try again." } });
  });

  it("returns a stable success envelope", async () => {
    await expect(runAction(async () => "saved")).resolves.toEqual({ ok: true, data: "saved" });
  });
});
