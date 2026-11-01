export type AdminRole = "super_admin" | "editor";

export type LiveStreamStatus = "upcoming" | "live" | "ended";

export type AnnouncementStatus = "draft" | "published";

export type DonationStatus = "pending" | "success" | "failed";

export type DonationCategory =
  | "Tithe"
  | "Offering"
  | "Thanksgiving"
  | "Seed"
  | "Building Project"
  | "Others";

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
};

export type SiteSettings = {
  id: string;
  church_name: string;
  subtitle: string;
  branch_name: string;
  address: string;
  phone_primary: string;
  phone_secondary: string;
  tagline: string;
  minister_in_charge: string;
  about: string;
  logo_url: string;
  campaign_title: string;
  campaign_theme: string;
  campaign_scripture: string;
  campaign_time: string;
  campaign_venue: string;
  campaign_start_date: string;
  campaign_end_date: string;
  maps_embed_url: string;
  maps_link: string;
  socials: SocialLinks;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  updated_at: string;
};

export type Admin = {
  id: string;
  user_id: string;
  email: string;
  role: AdminRole;
  created_at: string;
};

export type LiveStream = {
  id: string;
  title: string;
  youtube_url: string;
  youtube_id: string;
  scheduled_at: string;
  status: LiveStreamStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  is_pinned: boolean;
  publish_at: string;
  expires_at: string | null;
  status: AnnouncementStatus;
  created_at: string;
  updated_at: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  is_recurring_weekly: boolean;
  created_at: string;
  updated_at: string;
};

export type Donation = {
  id: string;
  reference: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  category: DonationCategory;
  amount: number;
  currency: "NGN";
  status: DonationStatus;
  note: string | null;
  is_anonymous: boolean;
  paystack_access_code: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};
