import type { Metadata } from "next";

import { Countdown } from "@/components/site/countdown";
import { LiveBadge } from "@/components/site/live-badge";
import { SectionHeading } from "@/components/site/section-heading";
import { YoutubeEmbed } from "@/components/site/youtube-embed";
import { getFeaturedLiveStream, getLiveStreams } from "@/lib/data/live-streams";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Watch Live",
};

export default async function LivePage() {
  const [featured, streams] = await Promise.all([getFeaturedLiveStream(), getLiveStreams()]);
  const replays = streams.filter((item) => item.status === "ended" && item.id !== featured?.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        eyebrow="Live stream"
        title="Worship with us online"
        description="Featured services appear here as soon as an admin publishes a YouTube link."
      />

      {featured ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <LiveBadge status={featured.status} />
            <h2 className="font-heading text-2xl">{featured.title}</h2>
          </div>
          <YoutubeEmbed id={featured.youtube_id} title={featured.title} />
          {featured.status === "upcoming" ? <Countdown iso={featured.scheduled_at} /> : null}
          <p className="text-sm text-muted-foreground">{formatDateTime(featured.scheduled_at)}</p>
        </div>
      ) : (
        <div className="aspect-video overflow-hidden rounded-2xl bg-navy/90 card-shadow">
          <div className="flex h-full items-center justify-center px-6 text-center text-white/80">
            No featured stream yet. Check back on Sunday at 9 AM.
          </div>
        </div>
      )}

      {replays.length ? (
        <section className="mt-12">
          <h2 className="mb-4 font-heading text-2xl">Past services</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {replays.map((item) => (
              <article key={item.id} className="rounded-2xl bg-white p-3 card-shadow">
                <YoutubeEmbed id={item.youtube_id} title={item.title} />
                <h3 className="mt-3 font-heading text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{formatDateTime(item.scheduled_at)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
