import Link from "next/link";

import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const { admin, supabase } = await requireAdmin();

  const [{ data: featured }, { data: announcements }, donations] = await Promise.all([
    supabase.from("live_streams").select("*").eq("is_featured", true).maybeSingle(),
    supabase
      .from("announcements")
      .select("id, title, status, publish_at")
      .order("publish_at", { ascending: false })
      .limit(5),
    admin.role === "super_admin"
      ? supabase
          .from("donations")
          .select("amount, status, created_at")
          .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      : Promise.resolve({ data: [] as { amount: number; status: string }[] }),
  ]);

  const monthlyTotal =
    donations.data
      ?.filter((row) => row.status === "success")
      .reduce((sum, row) => sum + row.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Overview</h1>
        <p className="text-sm text-muted-foreground">Signed in as {admin.email} ({admin.role})</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Live stream</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {featured ? (
              <p>
                {featured.title} · {featured.status}
              </p>
            ) : (
              <p>No featured stream. <Link className="text-royal underline" href="/admin/live">Add one</Link></p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {announcements?.length ? (
              announcements.map((item) => (
                <p key={item.id}>
                  {item.title} · {item.status}
                </p>
              ))
            ) : (
              <p>No announcements yet.</p>
            )}
          </CardContent>
        </Card>
        {admin.role === "super_admin" ? (
          <Card>
            <CardHeader>
              <CardTitle>Donations this month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-2xl text-navy">
                ₦{(monthlyTotal / 100).toLocaleString("en-NG")}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
