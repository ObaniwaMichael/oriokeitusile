"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Radio,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { visibleAdminNav } from "@/lib/admin-nav";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/types";

const icons = {
  LayoutDashboard,
  Radio,
  Megaphone,
  CalendarDays,
  HeartHandshake,
  Mail,
  Settings,
  Users,
};

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const items = visibleAdminNav(role);

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col bg-navy text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="font-heading text-lg">Admin</p>
          <p className="text-xs text-aqua">Ijo Itusile dashboard</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin">
          {items.map((item) => {
            const Icon = icons[item.icon];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                  active ? "bg-white/10 text-gold" : "text-white/85 hover:bg-white/10",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" onClick={signOut}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 border-t bg-white px-2 py-2 md:hidden"
        aria-label="Admin mobile"
      >
        {items.slice(0, 4).map((item) => {
          const Icon = icons[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center rounded-lg py-1 text-[11px]",
                active ? "text-navy" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
