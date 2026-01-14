import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
export interface CreateBrandPayload {
  name: string;
  description?: string;
  location: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}
export const createBrand = async (payload: CreateBrandPayload) => {
  const response = await api.post(API_PATHS.BRAND.CREATE_PROFILE, payload);
  return response.data;
};
