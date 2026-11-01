import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { LiveStream } from "@/types";

async function fetchLiveStreams(): Promise<LiveStream[]> {
  if (!getSupabasePublicEnv()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("live_streams")
    .select("*")
    .order("scheduled_at", { ascending: false });
  return (data as LiveStream[]) ?? [];
}

export const getLiveStreams = unstable_cache(fetchLiveStreams, ["live-streams"], {
  tags: [CACHE_TAGS.liveStreams],
});

export async function getFeaturedLiveStream(): Promise<LiveStream | null> {
  const streams = await getLiveStreams();
  return streams.find((item) => item.is_featured) ?? streams[0] ?? null;
}
