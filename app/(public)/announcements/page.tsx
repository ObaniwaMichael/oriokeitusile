import type { Metadata } from "next";

import { AnnouncementCard } from "@/components/site/announcement-card";
import { SectionHeading } from "@/components/site/section-heading";
import { getPublishedAnnouncements } from "@/lib/data/announcements";

export const metadata: Metadata = {
  title: "Announcements",
};

export default async function AnnouncementsPage() {
  const items = await getPublishedAnnouncements();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        eyebrow="Church notices"
        title="Announcements"
        description="Pinned items appear first, then the newest published notices."
      />
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground">No announcements have been published yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
