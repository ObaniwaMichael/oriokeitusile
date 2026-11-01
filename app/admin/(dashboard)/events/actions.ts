"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { boolFromForm, emptyToNull, localInputToIso } from "@/lib/forms";
import { eventSchema } from "@/lib/validators/event";

function refresh() {
  revalidateTag(CACHE_TAGS.events);
  revalidatePath("/");
  revalidatePath("/admin/events");
}

export async function saveEvent(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = eventSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    description: formData.get("description") || "",
    starts_at: formData.get("starts_at"),
    ends_at: emptyToNull(formData.get("ends_at")),
    location: formData.get("location") || "",
    is_recurring_weekly: boolFromForm(formData.get("is_recurring_weekly")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid event." };
  }

  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    starts_at: localInputToIso(parsed.data.starts_at),
    ends_at: parsed.data.ends_at ? localInputToIso(parsed.data.ends_at) : null,
    location: parsed.data.location,
    is_recurring_weekly: parsed.data.is_recurring_weekly,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("events").update(payload).eq("id", parsed.data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("events").insert(payload);
    if (error) return { error: error.message };
  }

  refresh();
  return { success: true };
}

export async function deleteEvent(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { success: true };
}
