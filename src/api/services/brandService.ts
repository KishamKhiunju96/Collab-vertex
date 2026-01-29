import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";

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
   API Response Types
======================= */

interface BrandApiResponse {
  id: string;
  name: string;
  description?: string;
  location: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

/* =======================
   Normalizers
======================= */

/** Convert backend snake_case brand to frontend camelCase */
const normalizeBrand = (raw: BrandApiResponse): Brand => ({
  id: String(raw.id),
  name: raw.name,
  description: raw.description,
  location: raw.location,
  websiteUrl: raw.website_url,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

/** Normalize an array of brands */
const normalizeBrands = (brands: BrandApiResponse[] = []): Brand[] =>
  brands.map(normalizeBrand);

/* =======================
   Brand Service
======================= */

export const brandService = {
  /** Create a brand */
  createBrand: async (payload: CreateBrandPayload): Promise<Brand> => {
    const response = await api.post<ApiResponse<BrandApiResponse>>(
      API_PATHS.BRAND.CREATE_PROFILE,
      payload
    );
    // Debug log to inspect backend response
    if (typeof window !== 'undefined') {
      // Only log in browser/client
      console.log('CreateBrand API response:', response.data);
    }
    // Handle both possible response shapes
    const brandData = response.data?.data ?? response.data;
    if (!brandData || !brandData.id) {
      throw new Error('Invalid response from server: missing brand id');
    }
    return normalizeBrand(brandData);
  },

  /** Get all brands of logged-in user */
  getBrands: async (): Promise<Brand[]> => {
    const response = await api.get<ApiResponse<{ brands: BrandApiResponse[] }>>(
      API_PATHS.BRAND.GET_BRANDS_BY_USER
    );
    if (typeof window !== 'undefined') {
      console.log('GetBrands API response:', response.data);
    }
    return normalizeBrands(response.data.data?.brands ?? []);
  },

  /** Get brand by ID */
  getBrandById: async (brandId: string): Promise<Brand> => {
    const response = await api.get<ApiResponse<BrandApiResponse>>(
      API_PATHS.BRAND.GET_BY_ID(brandId)
    );
    return normalizeBrand(response.data.data);
  },

  /** Update brand */
  updateBrand: async (
    brandId: string,
    payload: UpdateBrandPayload
  ): Promise<Brand> => {
    const response = await api.put<ApiResponse<BrandApiResponse>>(
      API_PATHS.BRAND.UPDATE_PROFILE(brandId),
      payload
    );
    return normalizeBrand(response.data.data);
  },

  /** Delete brand */
  deleteBrand: async (brandId: string): Promise<void> => {
    await api.delete(API_PATHS.BRAND.DELETE_PROFILE(brandId));
  },
};
