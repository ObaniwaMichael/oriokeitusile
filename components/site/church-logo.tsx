import Image from "next/image";

import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";

type ChurchLogoProps = {
  settings: SiteSettings;
  className?: string;
  priority?: boolean;
};

export function ChurchLogo({ settings, className, priority }: ChurchLogoProps) {
  return (
    <span className={cn("relative inline-flex size-10 shrink-0 overflow-hidden rounded-full bg-navy ring-2 ring-gold/70", className)}>
      <Image
        src={settings.logo_url || "/logo.png"}
        alt={`${settings.church_name} logo`}
        fill
        sizes="48px"
        className="object-cover"
        priority={priority}
      />
    </span>
  );
}
