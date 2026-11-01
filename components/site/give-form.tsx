"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { donationCategories } from "@/lib/validators/donation";

const PRESETS = [1000, 2000, 5000, 10000];

export function GiveForm() {
  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    const selected = custom ? Number(custom) : amount;
    setPending(true);
    try {
      const response = await fetch("/api/donations/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.get("category"),
          amount: selected,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          note: formData.get("note") || undefined,
          is_anonymous: formData.get("is_anonymous") === "on",
        }),
      });
      const json = (await response.json()) as { error?: string; authorization_url?: string };
      if (!response.ok || !json.authorization_url) {
        toast.error(json.error || "Could not start payment.");
        return;
      }
      window.location.href = json.authorization_url;
    } catch {
      toast.error("Could not start payment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 card-shadow">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select id="category" name="category" className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm" required>
          {donationCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Amount</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESETS.map((value) => (
            <Button
              key={value}
              type="button"
              variant={amount === value && !custom ? "default" : "outline"}
              onClick={() => {
                setAmount(value);
                setCustom("");
              }}
            >
              ₦{value.toLocaleString("en-NG")}
            </Button>
          ))}
        </div>
        <Input
          className="mt-3"
          inputMode="numeric"
          placeholder="Custom amount (₦)"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea id="note" name="note" rows={3} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_anonymous" />
        Give anonymously
      </label>
      <Button type="submit" className="gold-fill w-full text-navy" disabled={pending}>
        {pending ? "Connecting to Paystack…" : "Continue to Paystack"}
      </Button>
    </form>
  );
}
