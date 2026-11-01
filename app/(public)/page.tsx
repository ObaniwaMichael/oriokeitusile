import Link from "next/link";
import { HeartHandshake, MapPin, Radio } from "lucide-react";

import { AnnouncementCard } from "@/components/site/announcement-card";
import { Hero } from "@/components/site/hero";
import { LiveBadge } from "@/components/site/live-badge";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedAnnouncements } from "@/lib/data/announcements";
import { expandUpcomingEvents, getEvents } from "@/lib/data/events";
import { getFeaturedLiveStream } from "@/lib/data/live-streams";
import { formatDateTime } from "@/lib/format";
import { getCampaignSundays } from "@/lib/site/campaign";
import { getSiteSettings } from "@/lib/site/get-site-settings";
import { telHref, whatsappHref } from "@/lib/site/phones";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const [announcements, events, featured] = await Promise.all([
    getPublishedAnnouncements(),
    getEvents(),
    getFeaturedLiveStream(),
  ]);
  const sundays = getCampaignSundays(settings);
  const upcoming = expandUpcomingEvents(events).slice(0, 6);

  return (
    <main>
      <Hero settings={settings} />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Gather with us"
            title="Worship, word, and Golden Waters"
            description="Join the live stream, follow announcements, and visit the Sanctuary of Freedom this Sunday."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="card-shadow">
              <CardHeader>
                <Radio className="size-5 text-royal" aria-hidden />
                <CardTitle>Watch Live</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                {featured ? (
                  <div className="space-y-2">
                    <LiveBadge status={featured.status} />
                    <p>{featured.title}</p>
                  </div>
                ) : (
                  <p>Featured services appear here as soon as an admin goes live.</p>
                )}
                <Button render={<Link href="/live" />} variant="outline">
                  Open live page
                </Button>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardHeader>
                <HeartHandshake className="size-5 text-royal" aria-hidden />
                <CardTitle>Give</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>Tithe, offering, and thanksgiving through Paystack or bank transfer.</p>
                <Button render={<Link href="/give" />} className="gold-fill text-navy">
                  Give now
                </Button>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardHeader>
                <MapPin className="size-5 text-royal" aria-hidden />
                <CardTitle>Visit us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{settings.address}</p>
                <Button render={<Link href="/contact" />} variant="outline">
                  Directions & contact
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Announcements" title="Latest from the altar" />
          {announcements.length === 0 ? (
            <p className="text-center text-muted-foreground">No announcements have been published yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {announcements.slice(0, 3).map((item) => (
                <AnnouncementCard key={item.id} item={item} />
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Button variant="outline" render={<Link href="/announcements" />}>
              All announcements
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Service times"
            title={settings.campaign_title}
            description={`${settings.campaign_theme} · ${settings.campaign_scripture}`}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sundays.map((sunday) => (
              <Card key={sunday.iso} className="card-shadow">
                <CardHeader>
                  <CardTitle>{sunday.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{settings.campaign_time}</p>
                  <p>{settings.campaign_venue}</p>
                  <p className="mt-2">Host: {settings.minister_in_charge}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {upcoming.length ? (
            <div className="mt-10">
              <h3 className="mb-4 font-heading text-2xl">Upcoming events</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {upcoming.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>{formatDateTime(event.starts_at)}</p>
                      {event.location ? <p>{event.location}</p> : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="About" title={settings.branch_name} />
            <p className="text-muted-foreground">{settings.about}</p>
            <Button className="mt-6" variant="outline" render={<Link href="/about" />}>
              Read more
            </Button>
          </div>
          <Card className="card-shadow">
            <CardHeader>
              <MapPin className="size-5 text-royal" aria-hidden />
              <CardTitle>Call or WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{settings.address}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button render={<a href={telHref(settings.phone_primary)} />}>Call {settings.phone_primary}</Button>
                <Button variant="outline" render={<a href={whatsappHref(settings.phone_primary)} />}>
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
