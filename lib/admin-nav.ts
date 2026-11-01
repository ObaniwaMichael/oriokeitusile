import type { AdminRole } from "@/types";

export const adminNav = [
  { href: "/admin", label: "Overview", icon: "LayoutDashboard" },
  { href: "/admin/live", label: "Live", icon: "Radio" },
  { href: "/admin/announcements", label: "Announcements", icon: "Megaphone" },
  { href: "/admin/events", label: "Events", icon: "CalendarDays" },
  { href: "/admin/donations", label: "Donations", icon: "HeartHandshake", roles: ["super_admin"] },
  { href: "/admin/messages", label: "Messages", icon: "Mail" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
  { href: "/admin/admins", label: "Admins", icon: "Users", roles: ["super_admin"] },
] as const;

export function visibleAdminNav(role: AdminRole) {
  return adminNav.filter((item) => {
    if (!("roles" in item)) return true;
    return (item.roles as readonly AdminRole[]).includes(role);
  });
}
