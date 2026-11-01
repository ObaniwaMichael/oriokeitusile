import type { SiteSettings } from "@/types";

export type CampaignSunday = {
  date: Date;
  iso: string;
  label: string;
};

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function getCampaignSundays(settings: SiteSettings): CampaignSunday[] {
  const start = parseDate(settings.campaign_start_date);
  const end = parseDate(settings.campaign_end_date);
  const sundays: CampaignSunday[] = [];
  const cursor = new Date(start);

  while (cursor.getDay() !== 0) {
    cursor.setDate(cursor.getDate() + 1);
  }

  while (cursor <= end) {
    sundays.push({
      date: new Date(cursor),
      iso: cursor.toISOString(),
      label: cursor.toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
    cursor.setDate(cursor.getDate() + 7);
  }

  return sundays;
}

export function isCampaignActive(settings: SiteSettings, now = new Date()): boolean {
  const start = parseDate(settings.campaign_start_date);
  const end = parseDate(settings.campaign_end_date);
  end.setHours(23, 59, 59, 999);
  return now >= start && now <= end;
}
