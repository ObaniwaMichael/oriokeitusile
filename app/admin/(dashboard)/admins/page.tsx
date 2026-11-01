import { AdminManager } from "@/components/admin/admin-manager";
import { requireAdmin } from "@/lib/auth/admin";
import type { Admin } from "@/types";

export default async function AdminsPage() {
  const { supabase } = await requireAdmin("super_admin");
  const { data } = await supabase.from("admins").select("*").order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Admins</h1>
        <p className="text-sm text-muted-foreground">Invite editors or super admins. Only listed users can open /admin.</p>
      </div>
      <AdminManager admins={(data as Admin[]) ?? []} />
    </div>
  );
}
