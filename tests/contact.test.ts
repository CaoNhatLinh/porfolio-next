import { describe, expect, it } from "vitest";
import { contactSchema } from "../app/features/contact/schema";

describe("contact boundary", () => {
  it("accepts a normal note", () => {
    const result = contactSchema.safeParse({ name: "Linh", email: "hello@example.com", project: "A new portfolio", website: "", budgetRange: "", message: "Hello", companyWebsite: "", formStartedAt: Date.now() });
    expect(result.success).toBe(true);
  });

  it("rejects malformed email and honeypot values", () => {
    expect(contactSchema.safeParse({ name: "L", email: "not-an-email", project: "Hi", formStartedAt: Date.now() }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "Linh", email: "hello@example.com", project: "A project", companyWebsite: "bot", formStartedAt: Date.now() }).success).toBe(false);
  });
});
