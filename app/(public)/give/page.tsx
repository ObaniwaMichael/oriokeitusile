import type { Metadata } from "next";

import { CopyButton } from "@/components/site/copy-button";
import { GiveForm } from "@/components/site/give-form";
import { SectionHeading } from "@/components/site/section-heading";
import { getSiteSettings } from "@/lib/site/get-site-settings";

export const metadata: Metadata = {
  title: "Give",
};

export default async function GivePage() {
  const settings = await getSiteSettings();
  const hasBank = Boolean(settings.bank_account_number && settings.bank_name);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading
        eyebrow="Partnership"
        title="Give"
        description="Tithe, offering, thanksgiving, and more. Paystack checkout is secure. Minimum gift is ₦100."
      />
      <GiveForm />
      <div className="mt-8 rounded-2xl bg-white p-6 card-shadow">
        <h2 className="font-heading text-2xl">Bank transfer</h2>
        {hasBank ? (
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Account name:</span> {settings.bank_account_name}
            </p>
            <p>
              <span className="text-muted-foreground">Bank:</span> {settings.bank_name}
            </p>
            <p>
              <span className="text-muted-foreground">Account number:</span> {settings.bank_account_number}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <CopyButton value={settings.bank_account_number} label="account number" />
              <CopyButton value={settings.bank_account_name} label="account name" />
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Bank transfer details will appear here once they are added in the admin dashboard.
          </p>
        )}
      </div>
    </main>
  );
}
