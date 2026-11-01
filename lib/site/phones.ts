export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function toWhatsAppNumber(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

export function telHref(phone: string): string {
  return `tel:+${toWhatsAppNumber(phone)}`;
}

export function whatsappHref(phone: string, message?: string): string {
  const base = `https://wa.me/${toWhatsAppNumber(phone)}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
