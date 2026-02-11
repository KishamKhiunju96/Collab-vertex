import axios, {
  AxiosError,
  AxiosResponse,
  AxiosHeaders,
} from "axios";
import { BASE_URL } from "./apiPaths";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ send HttpOnly cookies automatically
  timeout: 15000,
  headers: new AxiosHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  }),
});

api.interceptors.request.use(
  (config) => {
    // Nothing to attach — cookies are handled by browser
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/**
 * RESPONSE INTERCEPTOR
 * Handles auth errors globally
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – session expired or not logged in");

      // Optional: redirect to login
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
