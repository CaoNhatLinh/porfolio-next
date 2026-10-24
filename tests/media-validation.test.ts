import { describe, expect, it } from "vitest";
import { validateUpload } from "../app/lib/media/upload-validation";
describe("media upload validation", () => {
  it("accepts a PDF by declared type and signature", () => {
    expect(validateUpload({ type: "application/pdf", size: 100 }, Buffer.from("%PDF-1.7\nbody\n%%EOF"))).toBe("pdf");
  });
  it("rejects disguised and empty documents", () => {
    expect(() => validateUpload({ type: "application/pdf", size: 10 }, Buffer.from("not a pdf"))).toThrow();
    expect(() => validateUpload({ type: "application/pdf", size: 0 }, Buffer.alloc(0))).toThrow();
  });
  it("limits uploads to 4 MB to fit the Vercel request budget", () => {
    expect(() => validateUpload({ type: "application/pdf", size: 4 * 1024 * 1024 + 1 }, Buffer.from("%PDF-1.7"))).toThrow();
  });
});
