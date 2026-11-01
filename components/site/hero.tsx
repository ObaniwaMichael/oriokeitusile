"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { WaveBackground } from "@/components/site/wave-background";
import { Button } from "@/components/ui/button";
import { isCampaignActive } from "@/lib/site/campaign";
import type { SiteSettings } from "@/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const reduceMotion = useReducedMotion();
  const campaignOn = isCampaignActive(settings);

  return (
    <section className="relative overflow-hidden text-white">
      <WaveBackground />
      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 py-16 sm:py-24">
        <motion.p
          className="mb-3 text-sm font-medium tracking-[0.18em] text-aqua uppercase"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {settings.subtitle}
        </motion.p>
        <motion.h1
          className="max-w-4xl font-heading text-3xl leading-tight text-white sm:text-5xl lg:text-6xl"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          {settings.church_name}
        </motion.h1>
        <p className="mt-3 text-lg text-gold sm:text-xl">{settings.branch_name}</p>
        <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg">{settings.tagline}</p>

        {campaignOn ? (
          <div className="mt-8 max-w-xl rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm card-shadow">
            <p className="text-xs font-semibold tracking-widest text-aqua uppercase">Current campaign</p>
            <h2 className="mt-1 font-heading text-3xl gold-text sm:text-4xl">{settings.campaign_title}</h2>
            <p className="mt-2 text-lg text-white">
              Theme: <span className="font-semibold">{settings.campaign_theme}</span>
            </p>
            <p className="text-sm text-white/80">{settings.campaign_scripture}</p>
            <p className="mt-3 text-sm text-white/90">
              Every Sunday in November · {settings.campaign_time} · {settings.campaign_venue}
            </p>
            <p className="mt-1 text-sm text-white/80">Host: {settings.minister_in_charge}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 bg-white px-6 text-navy hover:bg-ice"
            render={<Link href="/live" />}
          >
            Watch Live
          </Button>
          <Button
            size="lg"
            className="gold-fill h-12 px-6 text-navy hover:opacity-90"
            render={<Link href="/give" />}
          >
            Give
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-white/40 bg-transparent px-6 text-white hover:bg-white/10"
            render={<Link href="/contact" />}
          >
            Visit Us
          </Button>
        </div>
      </div>
    </section>
  );
}
