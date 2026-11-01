"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { settingsSchema } from "@/lib/validators/settings";

export async function saveSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  }

  const { data: current } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
  const payload = {
    church_name: parsed.data.church_name,
    subtitle: parsed.data.subtitle,
    branch_name: parsed.data.branch_name,
    address: parsed.data.address,
    phone_primary: parsed.data.phone_primary,
    phone_secondary: parsed.data.phone_secondary,
    tagline: parsed.data.tagline,
    minister_in_charge: parsed.data.minister_in_charge,
    about: parsed.data.about,
    logo_url: parsed.data.logo_url,
    campaign_title: parsed.data.campaign_title,
    campaign_theme: parsed.data.campaign_theme,
    campaign_scripture: parsed.data.campaign_scripture,
    campaign_time: parsed.data.campaign_time,
    campaign_venue: parsed.data.campaign_venue,
    campaign_start_date: parsed.data.campaign_start_date,
    campaign_end_date: parsed.data.campaign_end_date,
    maps_embed_url: parsed.data.maps_embed_url,
    maps_link: parsed.data.maps_link,
    socials: {
      facebook: parsed.data.facebook || "",
      instagram: parsed.data.instagram || "",
      youtube: parsed.data.youtube || "",
    },
    bank_name: parsed.data.bank_name || "",
    bank_account_name: parsed.data.bank_account_name || "",
    bank_account_number: parsed.data.bank_account_number || "",
  };

  const query = current
    ? supabase.from("site_settings").update(payload).eq("id", current.id)
    : supabase.from("site_settings").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };

  revalidateTag(CACHE_TAGS.settings);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function uploadLogo(formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a logo image." };
  }
  const ext = file.name.split(".").pop() ?? "png";
  const path = `logo/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("church-media").upload(path, file);
  if (error) return { error: error.message };
  const { data } = supabase.storage.from("church-media").getPublicUrl(path);
  return { url: data.publicUrl };
}
