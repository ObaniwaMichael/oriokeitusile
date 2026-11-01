import type { SiteSettings } from "@/types";

export function ChurchJsonLd({ settings }: { settings: SiteSettings }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: settings.church_name,
    alternateName: settings.branch_name,
    description: settings.tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    telephone: [settings.phone_primary, settings.phone_secondary],
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}
