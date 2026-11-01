const PAYSTACK_BASE = "https://api.paystack.co";

export function getPaystackSecret() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing PAYSTACK_SECRET_KEY.");
  }
  return secret;
}

export async function paystackRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPaystackSecret()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const json = (await response.json()) as T & { message?: string; status?: boolean };
  if (!response.ok || json.status === false) {
    throw new Error(json.message || "Paystack request failed.");
  }
  return json;
}
