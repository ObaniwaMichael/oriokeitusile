import type { Metadata } from "next";

import { SectionHeading } from "@/components/site/section-heading";
import { getSiteSettings } from "@/lib/site/get-site-settings";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading eyebrow={settings.subtitle} title={settings.church_name} />
      <div className="rounded-2xl bg-white p-6 card-shadow">
        <h2 className="font-heading text-2xl">{settings.branch_name}</h2>
        <p className="mt-4 text-muted-foreground">{settings.about}</p>
        <p className="mt-6 text-sm">
          Minister in Charge & Host: <strong>{settings.minister_in_charge}</strong>
        </p>
      </div>
    </main>
  );
}
