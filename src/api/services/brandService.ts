import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";

export interface Brand {
  id: string;
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
  website_url?: string;
}

export interface UpdateBrandPayload {
  name?: string;
  description?: string;
  location?: string;
  website_url?: string;
}

export const createBrand = async (
  payload: CreateBrandPayload,
): Promise<Brand> => {
  const response = await api.post(API_PATHS.BRAND.CREATE_PROFILE, payload);

  return response.data;
};

export const getBrands = async (): Promise<Brand[]> => {
  const response = await api.get(API_PATHS.BRAND.GET_BRANDS_BY_USER);

  return response.data?.brands ?? response.data ?? [];
};

export const getBrandById = async (brandId: string): Promise<Brand> => {
  const response = await api.get(API_PATHS.BRAND.GET_BY_ID(brandId));

  return response.data;
};

export const updateBrand = async (
  brandId: string,
  payload: UpdateBrandPayload,
): Promise<Brand> => {
  const response = await api.put(
    API_PATHS.BRAND.UPDATE_PROFILE(brandId),
    payload,
  );

  return response.data;
};

export const deleteBrand = async (brandId: string): Promise<void> => {
  await api.delete(API_PATHS.BRAND.DELETE_PROFILE(brandId));
};
