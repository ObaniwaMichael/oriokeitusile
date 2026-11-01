"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveSettings, uploadLogo } from "@/app/admin/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/types";

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(settings.logo_url);

  async function onUpload(formData: FormData) {
    const result = await uploadLogo(formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.url) {
      setLogoUrl(result.url);
      toast.success("Logo uploaded. Save settings to apply it.");
    }
  }

  async function onSubmit(formData: FormData) {
    formData.set("logo_url", logoUrl);
    const result = await saveSettings(formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Settings saved.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form action={onUpload} className="flex flex-col gap-2 rounded-2xl bg-white p-5 sm:flex-row sm:items-end card-shadow">
        <div className="flex-1 space-y-2">
          <Label htmlFor="file">Logo</Label>
          <Input id="file" name="file" type="file" accept="image/*" />
        </div>
        <Button type="submit" variant="outline">
          Upload logo
        </Button>
      </form>
      <form action={onSubmit} className="grid gap-4 rounded-2xl bg-white p-5 md:grid-cols-2 card-shadow">
        <input type="hidden" name="logo_url" value={logoUrl} />
        <Field name="church_name" label="Church name" defaultValue={settings.church_name} />
        <Field name="subtitle" label="Subtitle" defaultValue={settings.subtitle} />
        <Field name="branch_name" label="Branch name" defaultValue={settings.branch_name} />
        <Field name="minister_in_charge" label="Minister in charge" defaultValue={settings.minister_in_charge} />
        <Field name="phone_primary" label="Primary phone" defaultValue={settings.phone_primary} />
        <Field name="phone_secondary" label="Secondary phone" defaultValue={settings.phone_secondary} />
        <Field name="tagline" label="Tagline" defaultValue={settings.tagline} />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" defaultValue={settings.address} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="about">About</Label>
          <Textarea id="about" name="about" rows={5} defaultValue={settings.about} required />
        </div>
        <Field name="campaign_title" label="Campaign title" defaultValue={settings.campaign_title} />
        <Field name="campaign_theme" label="Campaign theme" defaultValue={settings.campaign_theme} />
        <Field name="campaign_scripture" label="Campaign scripture" defaultValue={settings.campaign_scripture} />
        <Field name="campaign_time" label="Campaign time" defaultValue={settings.campaign_time} />
        <Field name="campaign_venue" label="Campaign venue" defaultValue={settings.campaign_venue} />
        <Field name="campaign_start_date" label="Campaign start" type="date" defaultValue={settings.campaign_start_date} />
        <Field name="campaign_end_date" label="Campaign end" type="date" defaultValue={settings.campaign_end_date} />
        <Field name="maps_embed_url" label="Maps embed URL" defaultValue={settings.maps_embed_url} required={false} />
        <Field name="maps_link" label="Maps link" defaultValue={settings.maps_link} required={false} />
        <Field name="facebook" label="Facebook URL" defaultValue={settings.socials.facebook} required={false} />
        <Field name="instagram" label="Instagram URL" defaultValue={settings.socials.instagram} required={false} />
        <Field name="youtube" label="YouTube URL" defaultValue={settings.socials.youtube} required={false} />
        <Field name="bank_name" label="Bank name" defaultValue={settings.bank_name} required={false} />
        <Field name="bank_account_name" label="Account name" defaultValue={settings.bank_account_name} required={false} />
        <Field name="bank_account_number" label="Account number" defaultValue={settings.bank_account_number} required={false} />
        <div className="md:col-span-2">
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
