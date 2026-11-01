import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { admin } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-ice">
      <AdminNav role={admin.role} />
      <div className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </div>
    </div>
  );
}
