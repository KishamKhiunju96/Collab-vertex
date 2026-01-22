import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "collab_vertex_token";

export type UserRole = "brand" | "influencer" | "admin";

interface DecodedToken {
  role: UserRole;
  exp: number;
  sub?: string;
}

export const saveToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getUserFromToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch {
    return null;
  }
};

export const getUserRole = (): UserRole | null => {
  const user = getUserFromToken();
  return user?.role ?? null;
};

export const clearToken = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);

  const isProduction = process.env.NODE_ENV === "production";
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax; ${
    isProduction ? "Secure" : ""
  }`;
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
