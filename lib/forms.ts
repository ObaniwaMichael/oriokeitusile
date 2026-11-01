export function boolFromForm(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

export function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}
