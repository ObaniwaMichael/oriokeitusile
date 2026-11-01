import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { paystackRequest } from "@/lib/paystack/client";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { initializeDonationSchema } from "@/lib/validators/donation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`donate:${ip}`)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = initializeDonationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid donation." }, { status: 400 });
  }

  const amountKobo = parsed.data.amount * 100;
  const reference = `itusile_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const displayName = parsed.data.is_anonymous ? "Anonymous" : parsed.data.name || "Friend";

  const supabase = createServiceRoleClient();
  const { error: insertError } = await supabase.from("donations").insert({
    reference,
    name: parsed.data.is_anonymous ? null : parsed.data.name || null,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    category: parsed.data.category,
    amount: amountKobo,
    currency: "NGN",
    status: "pending",
    note: parsed.data.note || null,
    is_anonymous: parsed.data.is_anonymous,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  try {
    const paystack = await paystackRequest<{
      data: { authorization_url: string; access_code: string; reference: string };
    }>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: parsed.data.email,
        amount: amountKobo,
        reference,
        currency: "NGN",
        callback_url: `${siteUrl}/give/thank-you?reference=${reference}`,
        metadata: {
          category: parsed.data.category,
          name: displayName,
          note: parsed.data.note,
        },
      }),
    });

    await supabase
      .from("donations")
      .update({ paystack_access_code: paystack.data.access_code })
      .eq("reference", reference);

    return NextResponse.json({
      authorization_url: paystack.data.authorization_url,
      access_code: paystack.data.access_code,
      reference,
    });
  } catch (error) {
    await supabase.from("donations").update({ status: "failed" }).eq("reference", reference);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start payment." },
      { status: 502 },
    );
  }
}
