import { NextResponse } from "next/server";

import { paystackRequest } from "@/lib/paystack/client";
import { sendReceiptEmail } from "@/lib/paystack/receipt";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data: donation } = await supabase.from("donations").select("*").eq("reference", reference).maybeSingle();
  if (!donation) {
    return NextResponse.json({ error: "Donation not found." }, { status: 404 });
  }

  const verified = await paystackRequest<{
    data: { status: string; amount: number; reference: string };
  }>(`/transaction/verify/${encodeURIComponent(reference)}`);

  const status = verified.data.status === "success" ? "success" : "failed";
  if (donation.status !== status) {
    await supabase.from("donations").update({ status }).eq("reference", reference);
    if (status === "success" && donation.email) {
      await sendReceiptEmail({
        email: donation.email,
        name: donation.name,
        amount: donation.amount,
        category: donation.category,
        reference,
      });
    }
  }

  return NextResponse.json({
    status,
    reference,
    amount: donation.amount,
    category: donation.category,
  });
}
