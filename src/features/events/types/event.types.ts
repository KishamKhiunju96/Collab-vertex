// src/features/events/types/event.types.ts

// --------------------
// Event Type
// --------------------

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

// --------------------
// Event Application Type
// --------------------

export interface EventApplication {
  id: string;
  event_id: string;
  influencer_id: string;

  status: "pending" | "accepted" | "rejected";

  // ✅ Correct field from backend
  applied_at: string;

  // Optional enriched fields from backend
  influencer_name?: string;
  event_title?: string;

  // Optional extended influencer details
  niche?: string;
  audience_size?: number;
  engagement_rate?: number;
  bio?: string;
  location?: string;
  email?: string;
}
