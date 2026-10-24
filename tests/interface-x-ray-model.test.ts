import { describe, expect, it } from "vitest";
import { getInspectionNode } from "../app/components/site/interface-x-ray-model";

describe("getInspectionNode", () => {
  it.each([
    [{ x: 0.5, y: 0.05 }, "navigation"],
    [{ x: 0.25, y: 0.35 }, "heading"],
    [{ x: 0.25, y: 0.65 }, "description"],
    [{ x: 0.75, y: 0.45 }, "chart"],
    [{ x: 0.5, y: 0.9 }, "status"],
  ])("maps %o to the expected inspection region", (point, expectedId) => {
    expect(getInspectionNode(point).id).toBe(expectedId);
  });
});
