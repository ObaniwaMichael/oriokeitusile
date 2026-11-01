import { z } from "zod";

export const donationCategories = [
  "Tithe",
  "Offering",
  "Thanksgiving",
  "Seed",
  "Building Project",
  "Others",
] as const;

export const initializeDonationSchema = z.object({
  category: z.enum(donationCategories),
  amount: z.coerce.number().int().min(100, "Minimum gift is ₦100."),
  name: z.string().trim().max(120).optional(),
  email: z.email(),
  phone: z.string().trim().max(30).optional(),
  note: z.string().trim().max(500).optional(),
  is_anonymous: z.boolean().default(false),
});
