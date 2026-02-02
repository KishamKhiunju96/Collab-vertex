import api from "@/api/axiosInstance";

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

interface BrandApiResponse {
  id: string | number;
  name: string;
  description?: string;
  location: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

// Normalizes API response to frontend Brand type
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

export const brandService = {
  // Create a new brand
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

  getBrands: async (): Promise<Brand[]> => {
    const response = await api.get<BrandApiResponse[]>("/brand/brandsbyuser");
    const rawBrands = Array.isArray(response.data) ? response.data : [];
    return normalizeBrands(rawBrands);
  },

  getBrandById: async (id: string): Promise<Brand> => {
    if (!id) throw new Error("Brand ID is required");
    const { data } = await api.get<BrandApiResponse>(`/brand/brandbyid/${id}`);
    return normalizeBrand(data);
  },

  updateBrand: async (id: string, payload: UpdateBrandPayload): Promise<Brand> => {
    if (!id) throw new Error("Brand ID is required");
    const response = await api.put<BrandApiResponse>(`/brand/update_brandprofile/${id}`, {
      name: payload.name,
      description: payload.description,
      location: payload.location,
      website_url: payload.websiteUrl,
    });
    return normalizeBrand(response.data);
  },

  deleteBrand: async (id: string): Promise<void> => {
    if (!id) throw new Error("Brand ID is required");
    await api.delete(`/brand/delete/${id}`);
  },
};
