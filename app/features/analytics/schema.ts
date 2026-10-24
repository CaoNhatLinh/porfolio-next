import { z } from "zod";

export const analyticsEventSchema = z.object({
  eventName: z.string().trim().regex(/^[a-z][a-z0-9_]*$/).max(60).default("page_view"),
  path: z.string().regex(/^\/[\w\-./?=&%]*$/).max(240),
  referrer: z.string().url().max(500).optional().or(z.literal("")),
  visitorToken: z.string().min(16).max(128),
  viewId: z.string().uuid().optional(),
  viewport: z.enum(["mobile", "tablet", "desktop", "unknown"]).default("unknown"),
  engagedMs: z.number().int().min(0).max(60 * 60 * 1000).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
