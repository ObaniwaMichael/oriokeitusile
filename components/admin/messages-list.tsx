"use client";

import { useRouter } from "next/navigation";

import { markMessageRead } from "@/app/admin/(dashboard)/messages/actions";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import type { ContactMessage } from "@/types";

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();

  if (!messages.length) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <article key={message.id} className="rounded-2xl bg-white p-4 card-shadow">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium">
                {message.name} · {message.email}
                {message.is_read ? "" : " · Unread"}
              </p>
              <p className="text-xs text-muted-foreground">{formatDateTime(message.created_at)}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                void markMessageRead(message.id, !message.is_read).then(() => router.refresh())
              }
            >
              Mark {message.is_read ? "unread" : "read"}
            </Button>
          </div>
          <p className="mt-3 text-sm">{message.message}</p>
        </article>
      ))}
    </div>
  );
}
