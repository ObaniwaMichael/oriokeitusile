import { EventManager } from "@/components/admin/event-manager";
import { requireAdmin } from "@/lib/auth/admin";
import type { EventItem } from "@/types";

export default async function AdminEventsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("events").select("*").order("starts_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Events</h1>
        <p className="text-sm text-muted-foreground">Weekly events expand automatically on the public home page.</p>
      </div>
      <EventManager events={(data as EventItem[]) ?? []} />
    </div>
  );
}
