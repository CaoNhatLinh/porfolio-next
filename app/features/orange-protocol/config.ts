export const PROTOCOL_VERSION = "op-1";
export const protocolEnabled = process.env.NEXT_PUBLIC_ORANGE_PROTOCOL_ENABLED !== "false";
export type ProtocolReply = { ok: true; reward: "night-orchard" } | { error: { code: string } };
