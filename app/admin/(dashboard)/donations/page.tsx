import { DonationsTable } from "@/components/admin/donations-table";
import { requireAdmin } from "@/lib/auth/admin";
import { formatNairaFromKobo } from "@/lib/format";
import type { Donation } from "@/types";

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const { admin, supabase } = await requireAdmin("super_admin");
  const filters = await searchParams;
  let query = supabase.from("donations").select("*").order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.category) query = query.eq("category", filters.category);
  const { data } = await query;

  const donations = (data as Donation[]) ?? [];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const monthly = donations
    .filter((row) => row.status === "success" && row.created_at >= monthStart)
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Donations</h1>
        <p className="text-sm text-muted-foreground">
          {admin.email} · This month: {formatNairaFromKobo(monthly)}
        </p>
      </div>
      <DonationsTable donations={donations} />
    </div>
  );
}
