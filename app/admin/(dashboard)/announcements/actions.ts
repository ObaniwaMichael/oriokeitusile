"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { boolFromForm, emptyToNull, localInputToIso } from "@/lib/forms";
import { announcementSchema } from "@/lib/validators/announcement";

function refresh() {
  revalidateTag(CACHE_TAGS.announcements);
  revalidatePath("/");
  revalidatePath("/announcements");
  revalidatePath("/admin/announcements");
}

export async function saveAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = announcementSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    body: formData.get("body"),
    image_url: emptyToNull(formData.get("image_url")),
    is_pinned: boolFromForm(formData.get("is_pinned")),
    publish_at: formData.get("publish_at"),
    expires_at: emptyToNull(formData.get("expires_at")),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid announcement." };
  }

  const payload = {
    title: parsed.data.title,
    body: parsed.data.body,
    image_url: parsed.data.image_url,
    is_pinned: parsed.data.is_pinned,
    publish_at: localInputToIso(parsed.data.publish_at),
    expires_at: parsed.data.expires_at ? localInputToIso(parsed.data.expires_at) : null,
    status: parsed.data.status,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("announcements").update(payload).eq("id", parsed.data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("announcements").insert(payload);
    if (error) return { error: error.message };
  }

  refresh();
  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { success: true };
}

export async function uploadAnnouncementImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `announcements/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("church-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("church-media").getPublicUrl(path);
  return { url: data.publicUrl };
}
