import type { Metadata } from "next";

import { ContactForm } from "@/components/site/contact-form";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site/get-site-settings";
import { telHref, whatsappHref } from "@/lib/site/phones";

export const metadata: Metadata = {
  title: "Visit Us",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phones = [settings.phone_primary, settings.phone_secondary];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading eyebrow="Contact" title="Come worship with us" description={settings.address} />
      <div className="grid gap-3 sm:grid-cols-2">
        {phones.map((phone) => (
          <div key={phone} className="rounded-2xl bg-white p-5 card-shadow">
            <p className="font-medium">{phone}</p>
            <div className="mt-3 flex gap-2">
              <Button render={<a href={telHref(phone)} />}>Call</Button>
              <Button variant="outline" render={<a href={whatsappHref(phone)} />}>
                WhatsApp
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <ContactForm />
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white card-shadow">
        <iframe
          title="Church location map"
          src={settings.maps_embed_url}
          className="h-80 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  );
}
