import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";

export interface CreateInfluencerPayload {
  id?: string; // optional for responses
  name: string;
  niche: string;
  audience_size: number;
  engagement_rate: number;
  bio: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface InfluencerProfile {
  id: string;
  name: string;
  niche: string;
  audience_size: number;
  engagement_rate: number;
  bio: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  followers?: number;
  created_at?: string;
  updated_at?: string;
}

export const influencerService = {
  // Create influencer profile
  createProfile: async (payload: CreateInfluencerPayload) => {
    const response = await api.post(
      API_PATHS.INFLUENCER.CREATE_PROFILE,
      payload,
    );
    return response.data;
  },

  // Get influencer profile of the logged-in user
  getProfileByUser: async (): Promise<CreateInfluencerPayload | null> => {
    try {
      const response = await api.get<CreateInfluencerPayload>(
        API_PATHS.INFLUENCER.GET_BY_USER,
      );
      return response.data;
    } catch (err) {
      console.error("Failed to fetch influencer profile", err);
      return null; // return null if no profile exists
    }
  },
  getProfile: async (): Promise<InfluencerProfile> => {
    const response = await api.get<InfluencerProfile>(
      API_PATHS.INFLUENCER.GET_BY_USER,
    );
    return response.data;
  },

  // Search influencer by name
  searchByName: async (name: string): Promise<InfluencerProfile> => {
    const response = await api.get<InfluencerProfile>(
      API_PATHS.INFLUENCER.GET_BY_NAME(name),
    );
    return response.data;
  },
};

// Social Links functions
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const response = await api.get<SocialLink[]>(
    API_PATHS.INFLUENCER.GET_SOCIAL_LINKS,
  );
  return response.data;
};

export const createSocialLink = async (
  link: Omit<SocialLink, "id">,
): Promise<SocialLink> => {
  const response = await api.post<SocialLink>(
    API_PATHS.INFLUENCER.CREATE_SOCIAL_LINK,
    link,
  );
  return response.data;
};

export const updateSocialLink = async (
  id: string,
  link: Omit<SocialLink, "id">,
): Promise<SocialLink> => {
  const response = await api.put<SocialLink>(
    API_PATHS.INFLUENCER.UPDATE_SOCIAL_LINK(id),
    link,
  );
  return response.data;
};

export const deleteSocialLink = async (id: string): Promise<void> => {
  await api.delete(API_PATHS.INFLUENCER.DELETE_SOCIAL_LINK(id));
};
