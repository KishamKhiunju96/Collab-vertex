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

  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
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

    if (decoded.exp * 1000 < Date.now()) {
      clearToken();
      return null;
    }

    return decoded;
  } catch {
    clearToken();
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

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax; Secure`;
};
