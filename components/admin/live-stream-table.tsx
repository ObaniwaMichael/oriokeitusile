"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteLiveStream, setLiveStreamStatus } from "@/app/admin/(dashboard)/live/actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import type { LiveStream } from "@/types";

export function LiveStreamTable({ streams }: { streams: LiveStream[] }) {
  const router = useRouter();

  async function run(action: () => Promise<{ error?: string }>, success: string) {
    const result = await action();
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(success);
    router.refresh();
  }

  if (!streams.length) {
    return <p className="text-sm text-muted-foreground">No streams yet. Paste a YouTube link to get started.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>When</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {streams.map((stream) => (
          <TableRow key={stream.id}>
            <TableCell className="font-medium">{stream.title}</TableCell>
            <TableCell>{formatDateTime(stream.scheduled_at)}</TableCell>
            <TableCell className="capitalize">{stream.status}</TableCell>
            <TableCell>{stream.is_featured ? "Yes" : "No"}</TableCell>
            <TableCell className="space-x-2 text-right">
              <Button size="sm" variant="outline" onClick={() => run(() => setLiveStreamStatus(stream.id, stream.status, true), "Set as featured.")}>
                Feature
              </Button>
              <Button size="sm" onClick={() => run(() => setLiveStreamStatus(stream.id, "live", true), "Stream is live.")}>
                Go live
              </Button>
              <Button size="sm" variant="secondary" onClick={() => run(() => setLiveStreamStatus(stream.id, "ended"), "Stream ended.")}>
                End
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm("Delete this stream?")) {
                    void run(() => deleteLiveStream(stream.id), "Stream deleted.");
                  }
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
