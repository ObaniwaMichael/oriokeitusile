import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";

import { verifyPaystackSignature } from "@/lib/paystack/signature";

describe("verifyPaystackSignature", () => {
  const secret = "sk_test_example";
  const body = JSON.stringify({ event: "charge.success", data: { reference: "abc" } });

  it("accepts a valid HMAC SHA512 signature", () => {
    const signature = createHmac("sha512", secret).update(body).digest("hex");
    expect(verifyPaystackSignature(body, signature, secret)).toBe(true);
  });

  it("rejects missing, short, or wrong signatures", () => {
    expect(verifyPaystackSignature(body, null, secret)).toBe(false);
    expect(verifyPaystackSignature(body, "abc", secret)).toBe(false);
    const other = createHmac("sha512", "other").update(body).digest("hex");
    expect(verifyPaystackSignature(body, other, secret)).toBe(false);
  });
});
