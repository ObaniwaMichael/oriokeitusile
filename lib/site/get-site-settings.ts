import { unstable_noStore as noStore } from "next/cache";

import { DEFAULT_SITE_SETTINGS } from "@/lib/site/defaults";
import type { SiteSettings } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  noStore();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const { createPublicClient } = await import("@/lib/supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...(data as SiteSettings),
      socials: {
        ...DEFAULT_SITE_SETTINGS.socials,
        ...((data as SiteSettings).socials ?? {}),
      },
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
