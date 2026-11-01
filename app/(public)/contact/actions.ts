"use server";

import { contactSchema } from "@/lib/validators/contact";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

export async function submitContact(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  if (!getSupabasePublicEnv()) {
    return { error: "The contact inbox is not connected yet." };
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) return { error: error.message };
  return { success: true };
}
