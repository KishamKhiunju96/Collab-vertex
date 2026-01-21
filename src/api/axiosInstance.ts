import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "./apiPaths";
import { clearToken, getToken } from "@/utils/3.";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized - clearing token and redirecting");
      clearToken();

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
