"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { inviteAdmin, removeAdmin } from "@/app/admin/(dashboard)/admins/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Admin } from "@/types";

export function AdminManager({ admins }: { admins: Admin[] }) {
  const router = useRouter();

  async function onInvite(formData: FormData) {
    const result = await inviteAdmin(formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Invite sent.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form action={onInvite} className="grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-[1fr_160px_auto] card-shadow">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select id="role" name="role" className="h-8 w-full rounded-lg border border-input px-2 text-sm">
            <option value="editor">Editor</option>
            <option value="super_admin">Super admin</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit">Invite</Button>
        </div>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.role}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (!confirm("Remove this admin?")) return;
                    void removeAdmin(admin.id).then((result) => {
                      if (result.error) toast.error(result.error);
                      else {
                        toast.success("Removed.");
                        router.refresh();
                      }
                    });
                  }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
