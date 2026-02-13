// src/lib/apiClient.ts
import axios, { AxiosError, AxiosResponse, AxiosHeaders } from "axios";
import { BASE_URL, API_PATHS } from "./apiPaths";

/* ======================================================
   Axios Instance
====================================================== */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // HttpOnly cookies
  timeout: 15000,
  headers: new AxiosHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  }),
});

/* ======================================================
   Request Interceptor
====================================================== */
api.interceptors.request.use(
  (config) => {
    // Cookies handled automatically
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ======================================================
   Response Interceptor (Global Auth Handling)
====================================================== */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – session expired");

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAuthPage =
          currentPath.startsWith("/login") ||
          currentPath.startsWith("/register") ||
          currentPath.startsWith("/verify_otp") ||
          currentPath.startsWith("/select-role");

        if (!isAuthPage) {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  },
);

/* ======================================================
   Notification Types
====================================================== */
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: "event_apply" | string;
  created_at: string;
}

/* ======================================================
   Notification APIs
====================================================== */
export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get(API_PATHS.NOTIFICATION.GET_ALL);
  return res.data;
};

export const streamNotifications = (
  onMessage: (notif: Notification) => void,
) => {
  const eventSource = new EventSource(
    `${BASE_URL}${API_PATHS.NOTIFICATION.STREAM}`,
    { withCredentials: true },
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

  return eventSource;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const res = await api.post(
    API_PATHS.NOTIFICATION.MARK_AS_READ(notificationId),
  );
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.post(API_PATHS.NOTIFICATION.MARK_ALL_AS_READ);
  return res.data;
};

/* ======================================================
   Event & Application Types
====================================================== */
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface EventApplication {
  id: string;
  event_id: string;
  applicant_id: string;
  applicant_name: string;
  status: ApplicationStatus;
  created_at: string;

  // Extended influencer details
  niche?: string;
  audience_size?: number;
  engagement_rate?: number;
  bio?: string;
  location?: string;
  email?: string;
}

/* ======================================================
   Event APIs
====================================================== */
export const getEventApplications = async (
  eventId: string,
): Promise<EventApplication[]> => {
  const res = await api.get(API_PATHS.EVENT.GET_APPLICATIONS(eventId));
  return res.data;
};

/* ======================================================
   Application APIs
====================================================== */
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
) => {
  const res = await api.patch(
    API_PATHS.EVENT.UPDATE_APPLICATION_STATUS(applicationId),
    { status },
  );
  return res.data;
};

/* ======================================================
   Export Axios Instance
====================================================== */
export default api;
