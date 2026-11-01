import { z } from "zod";

export const announcementSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(3),
  image_url: z.string().optional().nullable(),
  is_pinned: z.boolean().default(false),
  publish_at: z.string().min(1),
  expires_at: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]),
});
