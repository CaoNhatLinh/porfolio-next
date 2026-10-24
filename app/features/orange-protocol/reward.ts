export type OrangeSkin = "classic" | "armor";
export type ArcadeReward = { unlocked: boolean; night: boolean; skin: OrangeSkin };
export const REWARD_KEY = "kamling.orange-protocol.op-1.reward";
export const DEFAULT_REWARD: ArcadeReward = { unlocked: false, night: false, skin: "classic" };

export function parseReward(raw: string | null): ArcadeReward {
  try {
    const value = JSON.parse(raw ?? "null");
    if (value?.version !== 1 || value.unlocked !== true) return DEFAULT_REWARD;
    return { unlocked: true, night: value.night === true, skin: value.skin === "armor" ? "armor" : "classic" };
  } catch { return DEFAULT_REWARD; }
}

export function readReward(): ArcadeReward {
  try { return parseReward(localStorage.getItem(REWARD_KEY)); }
  catch { return DEFAULT_REWARD; }
}

export function saveReward(reward: ArcadeReward): boolean {
  try { localStorage.setItem(REWARD_KEY, JSON.stringify({ ...reward, version: 1 })); return true; }
  catch { return false; }
}
