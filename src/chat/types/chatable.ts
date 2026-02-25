/**
 * Types for chatable entities (brands and influencers)
 * These types include both the profile ID and user_id for WebSocket connections
 */

/**
 * Chatable Influencer from Brand's perspective
 * Response from /brand/chatable_influencers
 */
export interface ChatableInfluencer {
  user_id: string; // IMPORTANT: Use this for WebSocket connection
  id: string; // InfluencerProfile.id for display purposes
  username?: string; // User's account username (may not always be present)
  email?: string;
  name: string; // Influencer profile name (always present)
  niche: string;
  audience_size: number;
  engagement_rate: number;
  bio?: string;
  location?: string;
}

/**
 * Chatable Brand from Influencer's perspective
 * Response from /influencer/chatable_brands
 */
export interface ChatableBrand {
  user_id: string; // IMPORTANT: Use this for WebSocket connection
  id: string; // BrandProfile.id for display purposes
  username?: string; // User's account username (may not always be present)
  email?: string;
  name: string; // Brand name (always present)
  description?: string;
  location?: string;
  website_url?: string;
}

/**
 * Generic chat partner type (can be either brand or influencer)
 */
export interface ChatPartner {
  user_id: string; // For WebSocket connection
  profile_id: string; // For profile display
  username: string;
  email?: string;
  display_name: string; // Either brand name or influencer name
  role: "brand" | "influencer";
  metadata?: Record<string, unknown>; // Additional profile data
}
