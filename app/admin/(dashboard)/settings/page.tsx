import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getSiteSettings } from "@/lib/site/get-site-settings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Site settings</h1>
        <p className="text-sm text-muted-foreground">These values power the public website. Nothing is hard-coded in pages.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
