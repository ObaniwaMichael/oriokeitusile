import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AnnouncementTable } from "@/components/admin/announcement-table";
import { requireAdmin } from "@/lib/auth/admin";
import type { Announcement } from "@/types";

export default async function AdminAnnouncementsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("publish_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Announcements</h1>
        <p className="text-sm text-muted-foreground">Pinned notices appear first on the public site.</p>
      </div>
      <AnnouncementForm />
      <AnnouncementTable items={(data as Announcement[]) ?? []} />
    </div>
  );
}
