/* =======================
   Core Brand Model
======================= */

export interface Brand {
  id: string;
  name: string;
  description?: string;
  location: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/* =======================
   Backend Raw Brand
   (snake_case)
======================= */

export interface BrandApiResponse {
  id: string;
  name: string;
  description?: string;
  location: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

/* =======================
   Payloads
======================= */

export interface CreateBrandPayload {
  name: string;
  description?: string;
  location: string;
  websiteUrl?: string;
}

export interface UpdateBrandPayload {
  name?: string;
  description?: string;
  location?: string;
  websiteUrl?: string;
}

/* =======================
   Normalizer
======================= */

/**
 * Convert a backend BrandApiResponse (snake_case) into frontend Brand (camelCase)
 */
export const normalizeBrand = (raw: BrandApiResponse | any): Brand => ({
  id: String(raw?.id ?? ""),
  name: raw?.name ?? "",
  description: raw?.description ?? undefined,
  location: raw?.location ?? "",
  websiteUrl: raw?.website_url ?? raw?.websiteUrl ?? undefined,
  createdAt: raw?.created_at ?? raw?.createdAt ?? "",
  updatedAt: raw?.updated_at ?? raw?.updatedAt ?? "",
});

/* =======================
   Helpers
======================= */

/**
 * Normalize an array of BrandApiResponse objects into an array of Brand
 */
export const normalizeBrands = (
  brands: BrandApiResponse[] | any[] = []
): Brand[] => brands.map(normalizeBrand);
