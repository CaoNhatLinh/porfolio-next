import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "../../features/contact/schema";
import { getServerEnv } from "../../lib/env/server";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const nativeForm = !contentType.includes("application/json");
  const locale = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "vi";
  const input = contentType.includes("application/json") ? await request.json().catch(() => null) : Object.fromEntries((await request.formData().catch(() => new FormData())).entries());
  if (input && typeof input === "object" && typeof (input as Record<string, unknown>).formStartedAt === "string") (input as Record<string, unknown>).formStartedAt = Number((input as Record<string, unknown>).formStartedAt);
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: locale === "vi" ? "Vui lòng kiểm tra lại các thông tin đã nhập." : "Please check the submitted fields." } }, { status: 422 });
  const data = parsed.data;
  if (Date.now() - data.formStartedAt < 1200) return NextResponse.json({ error: { code: "TOO_FAST", message: locale === "vi" ? "Vui lòng kiểm tra nội dung rồi gửi lại." : "Please review your message and try again." } }, { status: 422 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  try {
    const env = getServerEnv();
    if (!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Contact storage is not configured.");
      const supabase = createSupabaseAdminClient();
      const key = createHmac("sha256", env.SUPABASE_SERVICE_ROLE_KEY).update(`contact:${ip}`).digest("hex");
      const { data: allowed, error: limitError } = await supabase.rpc("consume_contact_attempt", { p_key: key });
      if (limitError) throw new Error("Contact rate limiter is not configured.");
      if (allowed !== true) return NextResponse.json({ error: { code: "RATE_LIMITED", message: locale === "vi" ? "Bạn đã gửi nhiều tin nhắn. Vui lòng thử lại sau." : "Please try again a little later." } }, { status: 429, headers: { "Retry-After": "3600" } });
      const intent = data.intent ?? "general";
      const { error } = await supabase.from("contact_messages").insert({ intent, name: data.name, email: data.email, project: data.project, budget_range: data.budgetRange || null, website: data.website || null, message: data.message || null, timeline: data.timeline || null });
      if (error) throw new Error("Unable to save contact message.");
    if (env.RESEND_API_KEY && env.CONTACT_NOTIFICATION_EMAIL) {
      const resend = new Resend(env.RESEND_API_KEY);
      const intent = data.intent ?? "general";
      try {
        const result = await resend.emails.send({ from: env.FROM_EMAIL, to: env.CONTACT_NOTIFICATION_EMAIL, replyTo: data.email, subject: `[Portfolio / ${intent}] ${data.project}`, text: `${data.name} (${data.email})\nIntent: ${intent}\nTimeline: ${data.timeline || "Not specified"}\nBudget: ${data.budgetRange || "Not specified"}\nWebsite: ${data.website || "Not specified"}\n\n${data.project}\n${data.message || "No additional context."}` });
        if (result.error) console.error("contact_notification_failed", result.error.name);
      } catch { console.error("contact_notification_failed"); }
    }
  } catch (error) {
    console.error("contact_delivery_failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: { code: "DELIVERY_FAILED", message: locale === "vi" ? "Chưa gửi được tin nhắn. Bạn có thể thử lại hoặc liên hệ qua email." : "Your message could not be saved. Please retry or contact me by email." } }, { status: 503 });
  }

  return nativeForm ? NextResponse.redirect(new URL(`/contact?lang=${locale}&sent=1`, request.url), 303) : NextResponse.json({ ok: true }, { status: 201 });
}
