import { z } from "zod";

export function createContactSchema(locale: "vi" | "en" = "en") {
  const vi = locale === "vi";
  return z.object({
  intent: z.enum(["general", "hire", "speaking"]).optional(),
  name: z.string().trim().min(2, vi ? "Vui lòng nhập tên của bạn." : "Please add your name.").max(80),
  email: z.string().trim().email(vi ? "Vui lòng nhập email hợp lệ." : "Use a valid email address.").max(160),
  project: z.string().trim().min(3, vi ? "Vui lòng nhập chủ đề bạn muốn trao đổi." : "Please add a subject for your message.").max(180),
  budgetRange: z.string().trim().max(80).optional().or(z.literal("")),
  website: z.string().trim().url(vi ? "Nhập đường dẫn đầy đủ hoặc để trống." : "Use a full URL, or leave this blank.").max(240).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  companyWebsite: z.string().max(0).optional().or(z.literal("")),
  formStartedAt: z.number().int().positive(),
});
}

export const contactSchema = createContactSchema();

export type ContactInput = z.infer<typeof contactSchema>;
