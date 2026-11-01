"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteEvent, saveEvent } from "@/app/admin/(dashboard)/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import type { EventItem } from "@/types";

export function EventManager({ events }: { events: EventItem[] }) {
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const result = await saveEvent(formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Event saved.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form action={onSubmit} className="space-y-4 rounded-2xl bg-white p-5 card-shadow">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="starts_at">Starts</Label>
            <Input id="starts_at" name="starts_at" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ends_at">Ends</Label>
            <Input id="ends_at" name="ends_at" type="datetime-local" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_recurring_weekly" />
          Repeats weekly
        </label>
        <Button type="submit">Save event</Button>
      </form>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Starts</TableHead>
              <TableHead>Weekly</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{formatDateTime(event.starts_at)}</TableCell>
                <TableCell>{event.is_recurring_weekly ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (!confirm("Delete this event?")) return;
                      void deleteEvent(event.id).then((result) => {
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
      )}
    </div>
  );
}
