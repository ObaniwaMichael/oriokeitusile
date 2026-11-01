"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { boolFromForm, localInputToIso } from "@/lib/forms";
import { liveStreamSchema } from "@/lib/validators/live-stream";
import { extractYouTubeId } from "@/lib/youtube/parse";

function refreshLive() {
  revalidateTag(CACHE_TAGS.liveStreams);
  revalidatePath("/live");
  revalidatePath("/");
  revalidatePath("/admin/live");
}

export async function saveLiveStream(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = liveStreamSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    youtube_url: formData.get("youtube_url"),
    scheduled_at: formData.get("scheduled_at"),
    status: formData.get("status"),
    is_featured: boolFromForm(formData.get("is_featured")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid stream details." };
  }

  const youtubeId = extractYouTubeId(parsed.data.youtube_url);
  if (!youtubeId) {
    return { error: "Could not read a YouTube video ID from that URL." };
  }

  const payload = {
    title: parsed.data.title,
    youtube_url: parsed.data.youtube_url,
    youtube_id: youtubeId,
    scheduled_at: localInputToIso(parsed.data.scheduled_at),
    status: parsed.data.status,
    is_featured: parsed.data.is_featured,
  };

  if (payload.is_featured) {
    await supabase.from("live_streams").update({ is_featured: false }).eq("is_featured", true);
  }

  if (parsed.data.id) {
    const { error } = await supabase.from("live_streams").update(payload).eq("id", parsed.data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("live_streams").insert(payload);
    if (error) return { error: error.message };
  }

  refreshLive();
  return { success: true };
}

export async function deleteLiveStream(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("live_streams").delete().eq("id", id);
  if (error) return { error: error.message };
  refreshLive();
  return { success: true };
}

export async function setLiveStreamStatus(id: string, status: "upcoming" | "live" | "ended", featured = false) {
  const { supabase } = await requireAdmin();
  if (featured || status === "live") {
    await supabase.from("live_streams").update({ is_featured: false }).eq("is_featured", true);
  }
  const { error } = await supabase
    .from("live_streams")
    .update({
      status,
      is_featured: featured || status === "live",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  refreshLive();
  return { success: true };
}
