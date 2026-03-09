import api from "../axiosInstance";
import axios from "axios";
import { chatService } from "./chatService";

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

export async function handleLogin(
  username: string,
  password: string,
): Promise<HandleLoginResult> {
  try {
    await api.post("/auth/login", {
      username,
      password,
    });

    const userResponse = await api.get<User>("/user/me");
    const user = userResponse.data;

    // Mark all chat messages as delivered when user logs in
    // Use sessionStorage to prevent duplicate calls in same session
    const deliveredMarkedKey = `chat_delivered_marked_${user.id}`;
    const alreadyMarked = sessionStorage.getItem(deliveredMarkedKey);
    
    if (!alreadyMarked) {
      try {
        await chatService.markAllDelivered();
        // Set flag in sessionStorage to prevent duplicate calls this session
        sessionStorage.setItem(deliveredMarkedKey, 'true');
      } catch (error) {
        // Silently fail - don't break login flow
      }
    } else {
    }

    // 3️⃣ Decide redirect based on role
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

    return {
      success: true,
      redirectTo,
      user,
    };
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
    } else {
    }

    return { success: false, message };
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout"); // if backend supports it
  } catch {
    // ignore errors
  } finally {
    window.location.replace("/login");
  }
}
