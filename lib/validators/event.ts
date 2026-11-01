import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().default(""),
  starts_at: z.string().min(1),
  ends_at: z.string().optional().nullable(),
  location: z.string().trim().default(""),
  is_recurring_weekly: z.boolean().default(false),
});
