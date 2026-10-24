import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const modelPath = join(
  process.cwd(),
  "public",
  "models",
  "gaim-capsem.glb",
);

describe("Gaim Capsem 3D asset", () => {
  it("ships a non-empty binary glTF model", async () => {
    const modelHeader = await readFile(modelPath).then((file) => file.subarray(0, 4));
    const modelStats = await stat(modelPath);

    expect(modelHeader.toString("ascii")).toBe("glTF");
    expect(modelStats.size).toBeGreaterThan(50_000);
  });
});
