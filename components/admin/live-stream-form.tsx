"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveLiveStream } from "@/app/admin/(dashboard)/live/actions";
import { YoutubeEmbed } from "@/components/site/youtube-embed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toDateTimeLocalValue } from "@/lib/format";
import { extractYouTubeId } from "@/lib/youtube/parse";
import type { LiveStream } from "@/types";

export function LiveStreamForm({ stream }: { stream?: LiveStream }) {
  const router = useRouter();
  const [url, setUrl] = useState(stream?.youtube_url ?? "");
  const [pending, setPending] = useState(false);
  const previewId = extractYouTubeId(url);

  async function onSubmit(formData: FormData) {
    setPending(true);
    const result = await saveLiveStream(formData);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Live stream saved.");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-2xl bg-white p-5 card-shadow">
      {stream ? <input type="hidden" name="id" value={stream.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={stream?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="youtube_url">YouTube URL</Label>
        <Input
          id="youtube_url"
          name="youtube_url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
        {!url || previewId ? null : <p className="text-sm text-destructive">That does not look like a valid YouTube URL.</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="scheduled_at">Scheduled at</Label>
          <Input
            id="scheduled_at"
            name="scheduled_at"
            type="datetime-local"
            defaultValue={stream ? toDateTimeLocalValue(stream.scheduled_at) : ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={stream?.status ?? "upcoming"}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_featured" defaultChecked={stream?.is_featured} />
        Set as featured
      </label>
      {previewId ? <YoutubeEmbed id={previewId} title="Live preview" /> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save stream"}
      </Button>
    </form>
  );
}
