import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { ChatableBrand } from "@/chat/types/chatable";

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

export interface UpdateInfluencerPayload {
  name?: string;
  niche?: string;
  audience_size?: number;
  engagement_rate?: number;
  bio?: string;
  location?: string;
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

  // Update influencer profile
  updateProfile: async (
    influencerId: string,
    payload: UpdateInfluencerPayload,
  ): Promise<InfluencerProfile> => {
    const response = await api.put<InfluencerProfile>(
      API_PATHS.INFLUENCER.UPDATE_PROFILE(influencerId),
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
      return null; // return null if no profile exists
    }
  },

  // Get current user's full profile
  getProfile: async (): Promise<InfluencerProfile> => {
    const response = await api.get<InfluencerProfile>(
      API_PATHS.INFLUENCER.GET_BY_USER,
    );
    return response.data;
  },

  // Get influencer profile by ID
  getProfileById: async (influencerId: string): Promise<InfluencerProfile> => {
    const response = await api.get<InfluencerProfile>(
      API_PATHS.INFLUENCER.GET_BY_ID(influencerId),
    );
    return response.data;
  },

  // Get influencer profile by name (NEW - for view profile functionality)
  getProfileByName: async (name: string): Promise<InfluencerProfile> => {
    const response = await api.get<InfluencerProfile>(
      API_PATHS.INFLUENCER.GET_BY_NAME(name),
    );
    return response.data;
  },

  // Search influencer by name (alias for backward compatibility)
  searchByName: async (name: string): Promise<InfluencerProfile> => {
    const response = await api.get<InfluencerProfile>(
      API_PATHS.INFLUENCER.GET_BY_NAME(name),
    );
    return response.data;
  },

  /**
   * Get list of brands that the influencer can chat with
   * Returns brands whose events the influencer has applied to
   * IMPORTANT: Use user_id for WebSocket connections, NOT the brand profile id
   */
  getChatableBrands: async (): Promise<ChatableBrand[]> => {
    const response = await api.get<ChatableBrand[]>(
      API_PATHS.INFLUENCER.GET_CHATABLE_BRANDS
    );
    return response.data;
  },

  // Get influencer profile with social links (NEW - comprehensive view)
  getFullProfile: async (identifier: string, byName = false): Promise<{
    profile: InfluencerProfile;
    socialLinks: SocialLink[];
  }> => {
    try {
      // Fetch profile
      const profileResponse = byName
        ? await api.get<InfluencerProfile>(API_PATHS.INFLUENCER.GET_BY_NAME(identifier))
        : await api.get<InfluencerProfile>(API_PATHS.INFLUENCER.GET_BY_ID(identifier));

      const profile = profileResponse.data;

      // Fetch social links
      const linksResponse = await api.get<SocialLink[]>(
        API_PATHS.INFLUENCER.GET_SOCIAL_LINKS_BY_ID(profile.id)
      );

      return {
        profile,
        socialLinks: linksResponse.data,
      };
    } catch (error) {
      console.error("Error fetching full profile:", error);
      throw error;
    }
  },
};

// Social Links functions
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const response = await api.get<SocialLink[]>(
    API_PATHS.INFLUENCER.GET_SOCIAL_LINKS,
  );
  return response.data;
};

export const getSocialLinksById = async (
  influencerId: string,
): Promise<SocialLink[]> => {
  const response = await api.get<SocialLink[]>(
    API_PATHS.INFLUENCER.GET_SOCIAL_LINKS_BY_ID(influencerId),
  );
  return response.data;
};

export const createSocialLink = async (
  link: Omit<SocialLink, "id" | "created_at" | "updated_at">,
): Promise<SocialLink> => {
  const response = await api.post<SocialLink>(
    API_PATHS.INFLUENCER.CREATE_SOCIAL_LINK,
    link,
  );
  return response.data;
};

export const updateSocialLink = async (
  id: string,
  link: Omit<SocialLink, "id" | "created_at" | "updated_at">,
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