import api from "@/api/axiosInstance";

export type UserRole = "brand" | "influencer" | "admin";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
}

/**
 * Get currently authenticated user from backend
 * Uses HttpOnly cookie automatically
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const res = await api.get<AuthUser>("/user/me");
    return res.data;
  } catch {
    return null; // not logged in
  }
};

/**
 * Check login status
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

/**
 * Get role of logged-in user
 */
export const getUserRole = async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();
  return user?.role ?? null;
};

/**
 * Logout helper with optional delay
 */
export const logoutUser = async (delay: number = 2500): Promise<void> => {
  try {
    await api.post("/auth/logout"); // if backend supports it
  } catch {
    // ignore
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });
};
