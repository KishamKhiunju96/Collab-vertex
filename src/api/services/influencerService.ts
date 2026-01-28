import { API_PATHS } from "@/api/apiPaths";
import api from "@/api/axiosInstance";

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  followers: number;
  linked_at: string;
}

export const createSocialLink = async (data: Omit<SocialLink, "id">) => {
  const response = await api.post(API_PATHS.INFLUENCER.CREATE_SOCIAL_LINK, data);
  return response.data;
};

export const getSocialLinks = async () => {
  const response = await api.get(API_PATHS.INFLUENCER.GET_SOCIAL_LINKS);
  return response.data;
};

export const updateSocialLink = async (sociallinkId: string, data: Omit<SocialLink, "id">) => {
  const response = await api.patch(API_PATHS.INFLUENCER.UPDATE_SOCIAL_LINK(sociallinkId), data);
  return response.data;
};

export const deleteSocialLink = async (sociallinkId: string) => {
  const response = await api.delete(API_PATHS.INFLUENCER.DELETE_SOCIAL_LINK(sociallinkId));
  return response.data;
};
