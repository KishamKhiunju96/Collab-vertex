// src/api/types/auth.ts
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: "brand" | "influencer" | "admin";
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: "brand" | "influencer" | "admin";
  };
}
