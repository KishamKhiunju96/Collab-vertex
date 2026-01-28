import axios from "../api/axiosInstance";
import { API_PATHS, BASE_URL } from "../api/apiPaths";

export const createBrandProfile = async (data: any) => {
  return axios.post(API_PATHS.BRAND.CREATE_PROFILE, data);
};

export const getBrandById = async (brandId: string) => {
  return axios.get(API_PATHS.BRAND.GET_BY_ID(brandId));
};

export const getBrandsByUser = async () => {
  return axios.get(API_PATHS.BRAND.GET_BRANDS_BY_USER);
};

export const updateBrandProfile = async (brandId: string, data: any) => {
  return axios.put(API_PATHS.BRAND.UPDATE_PROFILE(brandId), data);
};

export const deleteBrandProfile = async (brandId: string) => {
  return axios.delete(API_PATHS.BRAND.DELETE_PROFILE(brandId));
};
