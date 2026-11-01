"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(["super_admin", "editor"]),
});

export async function inviteAdmin(formData: FormData) {
  await requireAdmin("super_admin");
  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid invite." };
  }

  const adminClient = createServiceRoleClient();
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/login`,
  });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Invite did not return a user." };

  const { error: insertError } = await adminClient.from("admins").upsert({
    user_id: data.user.id,
    email: parsed.data.email,
    role: parsed.data.role,
  });
  if (insertError) return { error: insertError.message };
  revalidatePath("/admin/admins");
  return { success: true };
}

export async function removeAdmin(id: string) {
  await requireAdmin("super_admin");
  const adminClient = createServiceRoleClient();
  const { error } = await adminClient.from("admins").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/admins");
  return { success: true };
}
