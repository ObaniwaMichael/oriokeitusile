import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Admin, AdminRole } from "@/types";

export async function getAdminSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) return null;

  return { user, admin: admin as Admin, supabase };
}

export async function requireAdmin(role?: AdminRole) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (role && session.admin.role !== role) {
    redirect("/admin");
  }
  return session;
}
