import type { SVGProps } from "react";
import Link from "next/link";

import { ChurchLogo } from "@/components/site/church-logo";
import { publicNav } from "@/lib/nav";
import { telHref } from "@/lib/site/phones";
import type { SiteSettings } from "@/types";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C18 5 12 5 12 5s-6 0-7.6.2a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2C6 19 12 19 12 19s6 0 7.6-.2a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const socials = [
    { href: settings.socials.facebook, label: "Facebook", icon: FacebookIcon },
    { href: settings.socials.instagram, label: "Instagram", icon: InstagramIcon },
    { href: settings.socials.youtube, label: "YouTube", icon: YoutubeIcon },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ChurchLogo settings={settings} />
            <p className="font-heading text-lg">{settings.branch_name}</p>
          </div>
          <p className="text-sm text-white/75">{settings.church_name}</p>
          <p className="text-sm text-aqua">{settings.subtitle}</p>
        </div>

        <div>
          <p className="mb-3 font-heading text-lg">Explore</p>
          <ul className="space-y-2 text-sm text-white/80">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-heading text-lg">Visit</p>
          <p className="text-sm text-white/80">{settings.address}</p>
          <p className="mt-3 text-sm">
            <a className="hover:text-gold" href={telHref(settings.phone_primary)}>
              {settings.phone_primary}
            </a>
            <span className="text-white/50"> · </span>
            <a className="hover:text-gold" href={telHref(settings.phone_secondary)}>
              {settings.phone_secondary}
            </a>
          </p>
        </div>

        <div>
          <p className="mb-3 font-heading text-lg">Connect</p>
          {socials.length === 0 ? (
            <p className="text-sm text-white/70">Social links can be added from the admin dashboard.</p>
          ) : (
            <ul className="flex gap-3">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-navy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon className="size-4" />
                      <span className="sr-only">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {year} {settings.church_name}. All rights reserved.
      </div>
    </footer>
  );
}
