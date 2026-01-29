import api from "@/api/axiosInstance";

/* =======================
   Types
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
   Backend Response Types
======================= */

interface BrandApiResponse {
  id: string | number;
  name: string;
  description?: string;
  location: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

/* =======================
   Normalization Helpers
======================= */

const normalizeBrand = (raw: BrandApiResponse): Brand => ({
  id: String(raw.id),
  name: raw.name,
  description: raw.description ?? "",
  location: raw.location,
  websiteUrl: raw.website_url ?? "",
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

const normalizeBrands = (rawBrands: BrandApiResponse[] = []): Brand[] =>
  rawBrands.map(normalizeBrand);

/* =======================
   Brand Service
======================= */

export const brandService = {
  /** Create a new brand */
  createBrand: async (payload: CreateBrandPayload): Promise<Brand> => {
    const response = await api.post<BrandApiResponse>("/brand/create_brandprofile", {
      name: payload.name,
      description: payload.description ?? "",
      location: payload.location,
      website_url: payload.websiteUrl ?? "",
    });

    if (!response.data?.id) throw new Error("Invalid response from server: missing brand id");
    return normalizeBrand(response.data);
  },

  /** Get all brands of current user */
  getBrands: async (): Promise<Brand[]> => {
    const response = await api.get<BrandApiResponse[]>("/brand/brandsbyuser");
    const rawBrands = Array.isArray(response.data) ? response.data : [];
    return normalizeBrands(rawBrands);
  },

  /** Get a single brand by ID */
  getBrandById: async (brandId: string): Promise<Brand> => {
    if (!brandId) throw new Error("Brand ID is required");

    const response = await api.get<BrandApiResponse>(`/brand/brandbyid/${brandId}`);
    const brandData = response.data;

    if (!brandData?.id) throw new Error("Brand not found");
    return normalizeBrand(brandData);
  },

  /** Update brand details */
  updateBrand: async (brandId: string, payload: UpdateBrandPayload): Promise<Brand> => {
    if (!brandId) throw new Error("Brand ID is required");

    const response = await api.put<BrandApiResponse>(`/brand/update/${brandId}`, {
      name: payload.name,
      description: payload.description,
      location: payload.location,
      website_url: payload.websiteUrl,
    });

    if (!response.data?.id) throw new Error("Failed to update brand");
    return normalizeBrand(response.data);
  },

  /** Delete a brand */
  deleteBrand: async (brandId: string): Promise<void> => {
    if (!brandId) throw new Error("Brand ID is required");
    await api.delete(`/brand/delete/${brandId}`);
  },
};
