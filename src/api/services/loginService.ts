import { saveToken } from "@/utils/authToken";
import api from "../axiosInstance";
import axios from "axios";

export interface LoginResponseData {
  access_token?: string;
  token_type?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "brand" | "influencer";
  is_active: boolean;
  is_verified: boolean;
}

export interface HandleLoginResult {
  success: boolean;
  redirectTo?: string;
  user?: User;
}

export async function handleLogin(
  responseData: LoginResponseData,
): Promise<HandleLoginResult> {
  try {
    console.log("handleLogin received:", responseData);

    const token = responseData?.access_token;
    if (!token) {
      console.error("No access_token found in login response");
      return { success: false };
    }

    // Save token for subsequent requests
    saveToken(token);
    console.log("Token saved successfully");

    // Fetch current user using api instance
    const userResponse = await api.get<User>("/user/me", {
      headers: { Authorization: `Bearer ${token}` }, // double ensure header
    });
    const user = userResponse.data;

    console.log("Fetched current user:", user);

    // Determine redirect route
    let redirectTo: string;
    switch (user.role) {
      case "brand":
        redirectTo = "/dashboard/brand";
        break;
      case "influencer":
        redirectTo = "/dashboard/influencer";
        break;
      default:
        redirectTo = "/select-role";
    }

    return { success: true, redirectTo, user };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        "Axios error in handleLogin:",
        err.response?.status,
        err.response?.data || err.message,
      );
    } else if (err instanceof Error) {
      console.error("Error in handleLogin:", err.message);
    } else {
      console.error("Unknown error in handleLogin:", err);
    }
    return { success: false };
  }
}
