import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "collab_vertex_token";

export type UserRole = "brand" | "Influencer" | "admin";

interface DecodedToken {
  role: UserRole
  exp: number;
}

export const saveToken = (token: string) => {
  if (typeof window === "undefined") {

    // Save to localStorage
    localStorage.setItem(TOKEN_KEY, token);

    // Save to cookies for middleware
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
};

export const getUserFromToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try{
    const decoded = jwtDecode<DecodedToken>(token);

    if(decoded.exp *1000<Date.now()){
      clearToken();
      return null;
    }
    return decoded;
  }catch{
    clearToken();
    return null;
  }
};
export const clearToken = () => {
  if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);

    // Clear cookie
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};
