import { createClient } from "@supabase/supabase-js";

import { requireServiceRoleKey, requireSupabasePublicEnv } from "@/lib/supabase/env";

export function createServiceRoleClient() {
  const { url } = requireSupabasePublicEnv();
  return createClient(url, requireServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
