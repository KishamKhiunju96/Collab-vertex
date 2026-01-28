import { jwtDecode } from "jwt-decode";
import { setCookie, getCookie, deleteCookie } from "./cookie";

const TOKEN_KEY = "collab_vertex_token";

export type UserRole = "brand" | "influencer" | "admin";

interface DecodedToken {
  role: UserRole;
  exp: number;
  sub?: string;
}


export const saveToken = (token: string) => {
  if (typeof window === "undefined") return;
  setCookie(TOKEN_KEY, token);
};


export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return getCookie(TOKEN_KEY);
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
  deleteCookie(TOKEN_KEY);
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
