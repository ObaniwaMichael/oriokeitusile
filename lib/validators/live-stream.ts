import { z } from "zod";

import { extractYouTubeId } from "@/lib/youtube/parse";

export const liveStreamSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(160),
  youtube_url: z
    .string()
    .trim()
    .min(1)
    .refine((value) => extractYouTubeId(value) !== null, "Paste a valid YouTube watch, live, embed, or youtu.be URL."),
  scheduled_at: z.string().min(1),
  status: z.enum(["upcoming", "live", "ended"]),
  is_featured: z.boolean().default(false),
});

export type LiveStreamInput = z.infer<typeof liveStreamSchema>;
