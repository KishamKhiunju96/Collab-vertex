// src/features/events/types/event.types.ts

export interface Event {
  id: string;
  brand_id: string;
  title: string;
  description?: string;
  objectives?: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface EventApplication {
  id: string;
  event_id: string;
  applicant_id: string;
  applicant_name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;

  // Extended influencer details
  niche?: string;
  audience_size?: number;
  engagement_rate?: number;
  bio?: string;
  location?: string;
  email?: string;
}
