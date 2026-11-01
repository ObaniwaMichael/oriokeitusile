import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { Announcement } from "@/types";

async function fetchPublishedAnnouncements(): Promise<Announcement[]> {
  if (!getSupabasePublicEnv()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("publish_at", { ascending: false });
  return (data as Announcement[]) ?? [];
}

export const getPublishedAnnouncements = unstable_cache(
  fetchPublishedAnnouncements,
  ["announcements"],
  { tags: [CACHE_TAGS.announcements] },
);
