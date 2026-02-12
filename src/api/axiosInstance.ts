import axios, { AxiosError, AxiosResponse, AxiosHeaders } from "axios";
import { BASE_URL, API_PATHS } from "./apiPaths";

// --------------------
// Axios Instance
// --------------------
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send HttpOnly cookies automatically
  timeout: 15000,
  headers: new AxiosHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  }),
});

// --------------------
// Request Interceptor
// --------------------
api.interceptors.request.use(
  (config) => {
    // Cookies are handled by browser automatically
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// --------------------
// Response Interceptor
// --------------------
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – session expired or not logged in");

      // Only redirect to login if we're NOT already on auth pages
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAuthPage =
          currentPath.startsWith("/login") ||
          currentPath.startsWith("/register") ||
          currentPath.startsWith("/verify_otp") ||
          currentPath.startsWith("/select-role");

        // Only redirect if not already on an auth page
        if (!isAuthPage) {
          window.location.replace("/login");
        }
      }
    }
    return Promise.reject(error);
  },
);

// --------------------
// Notification Types
// --------------------
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: "event_apply" | string; // extendable
  created_at: string;
}

// --------------------
// Notification API
// --------------------

// Fetch all offline notifications
export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get(API_PATHS.NOTIFICATION.GET_ALL);
  return res.data;
};

// Stream online notifications using SSE
export const streamNotifications = (
  onMessage: (notif: Notification) => void,
) => {
  const eventSource = new EventSource(
    `${BASE_URL}${API_PATHS.NOTIFICATION.STREAM}`,
  );

  eventSource.onmessage = (event) => {
    try {
      const data: Notification = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Notification parse error:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("Notification stream error:", err);
    eventSource.close();
  };

  return eventSource; // caller should close when unmounting
};

// Mark a single notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  const res = await api.post(
    API_PATHS.NOTIFICATION.MARK_AS_READ(notificationId),
  );
  return res.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const res = await api.post(API_PATHS.NOTIFICATION.MARK_ALL_AS_READ);
  return res.data;
};

// --------------------
// Export default api
// --------------------
export default api;
