import Image from "next/image";
import Markdown from "react-markdown";

import { formatDateTime } from "@/lib/format";
import type { Announcement } from "@/types";

export function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white card-shadow">
      {item.image_url ? (
        <div className="relative h-48 w-full">
          <Image src={item.image_url} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
        </div>
      ) : null}
      <div className="space-y-2 p-5">
        {item.is_pinned ? <p className="text-xs font-semibold tracking-widest text-gold-deep uppercase">Pinned</p> : null}
        <h3 className="font-heading text-xl">{item.title}</h3>
        <p className="text-xs text-muted-foreground">{formatDateTime(item.publish_at)}</p>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <Markdown>{item.body}</Markdown>
        </div>
      </div>
    </article>
  );
}
