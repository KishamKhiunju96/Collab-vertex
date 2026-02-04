import api from "@/api/axiosInstance";

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


export const influencerService = {
  // Create influencer profile
  createProfile: async (payload: CreateInfluencerPayload) => {
    const response = await api.post("/influencer/create_influencerprofile", payload);
    return response.data;
  },

  // Get influencer profile of the logged-in user
  getProfileByUser: async (): Promise<CreateInfluencerPayload | null> => {
    try {
      const response = await api.get<CreateInfluencerPayload>("/influencer/get_influencer_by_user");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch influencer profile", err);
      return null; // return null if no profile exists
    }
  },
  getProfile: async (): Promise<InfluencerProfile> => {
    const response = await api.get<InfluencerProfile>("/influencer/get_influencer_by_user");
    return response.data;
  },
};