import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { formatNairaFromKobo } from "@/lib/format";

export const metadata: Metadata = {
  title: "Thank you",
};

async function verifyDonation(reference: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = await fetch(`${siteUrl}/api/donations/verify?reference=${encodeURIComponent(reference)}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as { status: string; amount: number; category: string; reference: string };
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  const result = reference ? await verifyDonation(reference) : null;

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-heading text-4xl">Thank you</h1>
      {result?.status === "success" ? (
        <p className="mt-4 text-muted-foreground">
          Your {result.category} of {formatNairaFromKobo(result.amount)} was received. Reference: {result.reference}.
        </p>
      ) : (
        <p className="mt-4 text-muted-foreground">
          We could not confirm this gift yet. If you were charged, it will appear once Paystack notifies the church.
        </p>
      )}
      <Button className="mt-8" render={<Link href="/" />}>
        Back home
      </Button>
    </main>
  );
}
