import { LiveStreamForm } from "@/components/admin/live-stream-form";
import { LiveStreamTable } from "@/components/admin/live-stream-table";
import { requireAdmin } from "@/lib/auth/admin";
import type { LiveStream } from "@/types";

export default async function AdminLivePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("live_streams")
    .select("*")
    .order("scheduled_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Live streams</h1>
        <p className="text-sm text-muted-foreground">Paste any YouTube URL. The public site will update after you save.</p>
      </div>
      <LiveStreamForm />
      <LiveStreamTable streams={(data as LiveStream[]) ?? []} />
    </div>
  );
}
