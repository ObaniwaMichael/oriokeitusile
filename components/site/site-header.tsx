"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { ChurchLogo } from "@/components/site/church-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publicNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 rounded-lg">
          <ChurchLogo settings={settings} priority />
          <span className="min-w-0">
            <span className="block truncate font-heading text-sm leading-tight sm:text-base">
              {settings.branch_name}
            </span>
            <span className="hidden truncate text-[11px] text-aqua sm:block">
              {settings.church_name}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {publicNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-white/10 text-gold" : "text-white/85 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button render={<Link href="/give" />} className="gold-fill text-navy hover:opacity-90">
            Give
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 lg:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="bg-navy text-white">
            <SheetHeader>
              <SheetTitle className="text-white">{settings.branch_name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
              {publicNav.map((item) => (
                <SheetTrigger
                  key={item.href}
                  render={
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-3 text-base text-white hover:bg-white/10"
                    />
                  }
                >
                  {item.label}
                </SheetTrigger>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
