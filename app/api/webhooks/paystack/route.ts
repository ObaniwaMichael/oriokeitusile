import { NextResponse } from "next/server";

import { sendReceiptEmail } from "@/lib/paystack/receipt";
import { verifyPaystackSignature } from "@/lib/paystack/signature";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret || !verifyPaystackSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: { reference?: string; status?: string; customer?: { email?: string } };
  };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const reference = event.data?.reference;
  if (!reference || (event.event !== "charge.success" && event.event !== "charge.failed")) {
    return NextResponse.json({ received: true });
  }

  const status = event.event === "charge.success" || event.data?.status === "success" ? "success" : "failed";
  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase
    .from("donations")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ received: true });
  }

  if (existing.status === status) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  await supabase.from("donations").update({ status }).eq("reference", reference);

  if (status === "success" && existing.email) {
    await sendReceiptEmail({
      email: existing.email,
      name: existing.name,
      amount: existing.amount,
      category: existing.category,
      reference,
    });
  }

  return NextResponse.json({ received: true });
}
