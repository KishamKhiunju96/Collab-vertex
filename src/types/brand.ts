// ------------------------
// Brand Types & Normalizers
// ------------------------

/**
 * Frontend-friendly Brand type (camelCase preferred)
 */
export interface Brand {
  id: string;
  name: string;
  description?: string;
  location: string;
  websiteUrl?: string; // ✅ camelCase for frontend
  createdAt: string;   // ✅ camelCase
  updatedAt: string;   // ✅ camelCase
}

/**
 * Raw API response from backend
 */
export interface BrandApiResponse {
  id: string | number;
  name: string;
  description?: string;
  location: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating a brand
 */
export interface CreateBrandPayload {
  name: string;
  description?: string;
  location: string;
  websiteUrl?: string; // camelCase for consistency
}

/**
 * Payload for updating a brand
 */
export interface UpdateBrandPayload {
  name?: string;
  description?: string;
  location?: string;
  websiteUrl?: string; // camelCase
}

/* ------------------------
   Normalizers
------------------------ */

/**
 * Normalize a single API brand response to frontend Brand type
 */
export const normalizeBrand = (raw: BrandApiResponse): Brand => ({
  id: String(raw.id ?? ""),
  name: raw.name ?? "",
  description: raw.description ?? undefined,
  location: raw.location ?? "",
  websiteUrl: raw.website_url ?? undefined, // normalize snake_case -> camelCase
  createdAt: raw.created_at ?? "",          // normalize snake_case -> camelCase
  updatedAt: raw.updated_at ?? "",          // normalize snake_case -> camelCase
});

/**
 * Normalize an array of API brands
 */
export const normalizeBrands = (brands: BrandApiResponse[] = []): Brand[] =>
  brands.map(normalizeBrand);
