import { describe, expect, it } from "vitest";
import { DEFAULT_REWARD, parseReward } from "../app/features/orange-protocol/reward";
describe("local cosmetic rewards", () => {
  it("ignores malformed and outdated saved state", () => {
    for (const raw of [null, "broken", "[]", "null", '{"version":2,"unlocked":true}']) expect(parseReward(raw)).toEqual(DEFAULT_REWARD);
  });
  it("restores unlocked cosmetic preferences without restoring puzzle answers", () => {
    expect(parseReward('{"version":1,"unlocked":true,"night":true,"skin":"armor"}')).toEqual({ unlocked: true, night: true, skin: "armor" });
  });
  it("normalizes invalid preferences and cannot equip locked rewards", () => {
    expect(parseReward('{"version":1,"unlocked":true,"skin":"other","night":"yes"}')).toEqual({ unlocked: true, night: false, skin: "classic" });
    expect(parseReward('{"version":1,"unlocked":false,"skin":"armor"}')).toEqual(DEFAULT_REWARD);
  });
});
