"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveAnnouncement, uploadAnnouncementImage } from "@/app/admin/(dashboard)/announcements/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toDateTimeLocalValue } from "@/lib/format";
import type { Announcement } from "@/types";

export function AnnouncementForm({ item }: { item?: Announcement }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [pending, setPending] = useState(false);

  async function onUpload(formData: FormData) {
    const result = await uploadAnnouncementImage(formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.url) {
      setImageUrl(result.url);
      toast.success("Image uploaded.");
    }
  }

  async function onSubmit(formData: FormData) {
    setPending(true);
    formData.set("image_url", imageUrl);
    const result = await saveAnnouncement(formData);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Announcement saved.");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-2xl bg-white p-5 card-shadow">
      <form action={onUpload} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="file">Optional image</Label>
          <Input id="file" name="file" type="file" accept="image/*" />
        </div>
        <Button type="submit" variant="outline">
          Upload
        </Button>
      </form>
      <form action={onSubmit} className="space-y-4">
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <input type="hidden" name="image_url" value={imageUrl} />
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={item?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body (markdown)</Label>
          <Textarea id="body" name="body" rows={6} defaultValue={item?.body} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="publish_at">Publish at</Label>
            <Input
              id="publish_at"
              name="publish_at"
              type="datetime-local"
              defaultValue={item ? toDateTimeLocalValue(item.publish_at) : ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expires_at">Expires at</Label>
            <Input
              id="expires_at"
              name="expires_at"
              type="datetime-local"
              defaultValue={item?.expires_at ? toDateTimeLocalValue(item.expires_at) : ""}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={item?.status ?? "published"}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_pinned" defaultChecked={item?.is_pinned} />
          Pin to top
        </label>
        {imageUrl ? <p className="text-xs break-all text-muted-foreground">{imageUrl}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save announcement"}
        </Button>
      </form>
    </div>
  );
}
