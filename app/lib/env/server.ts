import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_NOTIFICATION_EMAIL: z.string().email().optional(),
  FROM_EMAIL: z.string().email().default("onboarding@resend.dev"),
  ADMIN_EMAIL: z.string().email().optional(),
  ANALYTICS_SALT: z.string().min(16).optional(),
  CRON_SECRET: z.string().min(16).optional(),
});

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
    FROM_EMAIL: process.env.FROM_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ANALYTICS_SALT: process.env.ANALYTICS_SALT,
    CRON_SECRET: process.env.CRON_SECRET,
  });

  if (!parsed.success) {
    throw new Error("Missing or invalid server configuration. Check the Supabase and email environment variables.");
  }
  return parsed.data;
}
