import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { EventItem } from "@/types";

async function fetchEvents(): Promise<EventItem[]> {
  if (!getSupabasePublicEnv()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase.from("events").select("*").order("starts_at", { ascending: true });
  return (data as EventItem[]) ?? [];
}

export const getEvents = unstable_cache(fetchEvents, ["events"], {
  tags: [CACHE_TAGS.events],
});

export function expandUpcomingEvents(events: EventItem[], weeks = 8): EventItem[] {
  const now = Date.now();
  const horizon = now + weeks * 7 * 24 * 60 * 60 * 1000;
  const expanded: EventItem[] = [];

  for (const event of events) {
    if (!event.is_recurring_weekly) {
      if (new Date(event.starts_at).getTime() >= now - 2 * 60 * 60 * 1000) {
        expanded.push(event);
      }
      continue;
    }

    const start = new Date(event.starts_at);
    while (start.getTime() < now) {
      start.setDate(start.getDate() + 7);
    }
    while (start.getTime() <= horizon) {
      expanded.push({
        ...event,
        id: `${event.id}-${start.toISOString()}`,
        starts_at: start.toISOString(),
      });
      start.setDate(start.getDate() + 7);
    }
  }

  return expanded.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}
