import "server-only";
import { createHmac } from "node:crypto";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";

const developmentAttempts = new Map<string, { minute: number; count: number }>();

export async function consumeProtocolAttempt(ip: string): Promise<boolean> {
  const minute = Math.floor(Date.now() / 60_000);
  if (process.env.NODE_ENV === "development" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Local preview only. Production always uses the shared, atomic database RPC.
    for (const [key, value] of developmentAttempts) if (value.minute !== minute) developmentAttempts.delete(key);
    const attempt = developmentAttempts.get(ip) ?? { minute, count: 0 };
    attempt.count += 1;
    if (developmentAttempts.size >= 1000 && !developmentAttempts.has(ip)) return false;
    developmentAttempts.set(ip, attempt);
    return attempt.count <= 5;
  }
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Protocol rate limiter unavailable");
  const key = createHmac("sha256", secret).update(`orange-protocol:v1:${minute}:${ip}`).digest("hex");
  const { data, error } = await createSupabaseAdminClient().rpc("consume_contact_attempt", { p_key: key });
  if (error || typeof data !== "boolean") throw new Error("Protocol rate limiter unavailable");
  return data;
}
