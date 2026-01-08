const TOKEN_KEY = "collab_vertex_token";

export const saveToken = (token: string) => {
    console.log(token,"token in save token")
  if (typeof window !== "undefined") {
    console.log("checked")
    localStorage.setItem(TOKEN_KEY, token);
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
  }
};


