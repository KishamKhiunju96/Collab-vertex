import api from "../axiosInstance";
import axios from "axios";
import { saveToken, clearToken } from "@/utils/auth";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "brand" | "influencer" | "admin";
  is_active: boolean;
  is_verified: boolean;
}

export interface HandleLoginResult {
  success: boolean;
  redirectTo?: string;
  user?: User;
  message?: string;
}

/**
 * Token-based login function
 */
export async function handleLogin(
  username: string,
  password: string,
): Promise<HandleLoginResult> {
  try {
    // 1️⃣ Call login → backend returns JSON with access_token
    const loginRes = await api.post<{ access_token: string }>("/auth/login", {
      username,
      password,
    });

    const token = loginRes.data.access_token;

    // 2️⃣ Save token in cookie
    saveToken(token);

    // 3️⃣ Fetch current user using token (axios instance will attach Authorization header)
    const userResponse = await api.get<User>("/user/me");
    const user = userResponse.data;

    // 4️⃣ Determine redirect path based on role
    let redirectTo: string;
    switch (user.role) {
      case "brand":
        redirectTo = "/dashboard/brand";
        break;
      case "influencer":
        redirectTo = "/dashboard/influencer";
        break;
      case "admin":
        redirectTo = "/dashboard/admin";
        break;
      default:
        redirectTo = "/select-role";
    }

    return { success: true, redirectTo, user };
  } catch (err: unknown) {
    let message = "Login failed";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || err.message;
      console.error(
        "Axios error in handleLogin:",
        err.response?.status,
        message,
      );
    } else if (err instanceof Error) {
      message = err.message;
      console.error("Error in handleLogin:", message);
    } else {
      console.error("Unknown error in handleLogin:", err);
    }

    return { success: false, message };
  }
}

/**
 * Logout function
 */
export function logout() {
  clearToken();
  // optional: redirect to login
  // window.location.href = "/login";
}
