import { API_PATHS } from "@/api/apiPaths";
import api from "../axiosInstance";
import { clearToken, saveToken } from "@/utils/authToken";

export interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  role: "brand" | "influencer" | "admin";
}

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const res = await api.post(API_PATHS.USER.LOGIN, data);

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error("Access token not found in login response");
    }

    saveToken(access_token);

    return true;
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await api.get(API_PATHS.USER.ME);
    return res.data;
  },

  register: (data: {
    username: string;
    password: string;
    email: string;
    role: string;
  }) => api.post(API_PATHS.USER.REGISTER, data),

  verifyOtp: (data: { email: string; otp: string }) =>
    api.post(API_PATHS.USER.VERIFY_OTP, data),

  resendOtp: (data: { email: string }) => api.post("/otp/resend_otp", data),

  logout: async () => {
    try {
    } finally {
      clearToken();
      window.location.replace("/login");
    }
  },
};
