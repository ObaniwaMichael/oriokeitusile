"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteAnnouncement } from "@/app/admin/(dashboard)/announcements/actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import type { Announcement } from "@/types";

export function AnnouncementTable({ items }: { items: Announcement[] }) {
  const router = useRouter();

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No announcements yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pinned</TableHead>
          <TableHead>Publish</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.is_pinned ? "Yes" : "No"}</TableCell>
            <TableCell>{formatDateTime(item.publish_at)}</TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (!confirm("Delete this announcement?")) return;
                  void deleteAnnouncement(item.id).then((result) => {
                    if (result.error) toast.error(result.error);
                    else {
                      toast.success("Deleted.");
                      router.refresh();
                    }
                  });
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
