import { MessagesList } from "@/components/admin/messages-list";
import { requireAdmin } from "@/lib/auth/admin";
import type { ContactMessage } from "@/types";

export default async function AdminMessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Messages</h1>
        <p className="text-sm text-muted-foreground">Contact form inbox.</p>
      </div>
      <MessagesList messages={(data as ContactMessage[]) ?? []} />
    </div>
  );
}
