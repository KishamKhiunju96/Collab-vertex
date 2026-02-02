export interface Brand {
  id: string;
  name: string;
  description?: string;
  location: string;
  websiteUrl?: string; 
  createdAt: string;  
  updatedAt: string;   
}

export interface BrandApiResponse {
  id: string | number;
  name: string;
  description?: string;
  location: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

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

export const normalizeBrand = (raw: BrandApiResponse): Brand => ({
  id: String(raw.id ?? ""),
  name: raw.name ?? "",
  description: raw.description ?? undefined,
  location: raw.location ?? "",
  websiteUrl: raw.website_url ?? undefined, 
  createdAt: raw.created_at ?? "",          
  updatedAt: raw.updated_at ?? "",          
});

export const normalizeBrands = (brands: BrandApiResponse[] = []): Brand[] =>
  brands.map(normalizeBrand);
