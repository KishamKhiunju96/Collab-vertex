import axios from "../lib/axios";
import { API_PATHS } from "../api/apiPaths";

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  followers: number;
  linked_at: string;
}

export const createSocialLink = async (data: Omit<SocialLink, "id">) => {
  const response = await axios.post(API_PATHS.INFLUENCER.CREATE_SOCIAL_LINK, data);
  return response.data;
};

export const getSocialLinks = async () => {
  const response = await axios.get(API_PATHS.INFLUENCER.GET_SOCIAL_LINKS);
  return response.data;
};

export const updateSocialLink = async (sociallinkId: string, data: Omit<SocialLink, "id">) => {
  const response = await axios.patch(API_PATHS.INFLUENCER.UPDATE_SOCIAL_LINK(sociallinkId), data);
  return response.data;
};

export const deleteSocialLink = async (sociallinkId: string) => {
  const response = await axios.delete(API_PATHS.INFLUENCER.DELETE_SOCIAL_LINK(sociallinkId));
  return response.data;
};
