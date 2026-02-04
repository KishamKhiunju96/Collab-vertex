import { jwtDecode } from "jwt-decode";

export type UserRole = "brand" | "influencer" | "admin";

interface DecodedToken {
  role: UserRole;
  exp: number; // in seconds
  sub?: string;
}

/**
 * Decode the access token stored in localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const getUserFromToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};

export const getUserRole = (): UserRole | null => {
  const user = getUserFromToken();
  return user?.role ?? null;
};

export const isLoggedIn = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Logout helper: clears localStorage and waits for optional delay
 */
export const logoutUser = (delay: number = 2500): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem("accessToken"); // remove client-side access token
    setTimeout(() => resolve(), delay); // wait before redirect
  });
};
