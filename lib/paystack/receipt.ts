import { Resend } from "resend";

import { formatNairaFromKobo } from "@/lib/format";

export async function sendReceiptEmail(input: {
  email: string;
  name: string | null;
  amount: number;
  category: string;
  reference: string;
}) {
  if (process.env.ENABLE_RECEIPT_EMAIL !== "true" || !process.env.RESEND_API_KEY) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Ijo Itusile <giving@example.com>",
    to: input.email,
    subject: `Giving receipt · ${input.reference}`,
    text: `Thank you${input.name ? `, ${input.name}` : ""} for your ${input.category} of ${formatNairaFromKobo(input.amount)}. Reference: ${input.reference}.`,
  });
}
