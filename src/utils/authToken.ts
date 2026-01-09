const TOKEN_KEY = "collab_vertex_token";

export const saveToken = (token: string) => {
  console.log(token, "token in save token");
  if (typeof window !== "undefined") {
    console.log("saving to localStorage and cookies");

    // Save to localStorage
    localStorage.setItem(TOKEN_KEY, token);

    // Save to cookies for middleware
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);

    // Clear cookie
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  }
};
