import api from "@/api/axiosInstance";
import { NotificationRead } from "@/types/notification";
import { API_PATHS } from "@/api/apiPaths";

// Fetch all notifications
export const fetchNotifications = async (): Promise<NotificationRead[]> => {
  const { data } = await api.get(API_PATHS.NOTIFICATION.GET_ALL);
  return data;
};

// Get unread notification count
export const fetchUnreadCount = async (): Promise<number> => {
  const { data } = await api.get(API_PATHS.NOTIFICATION.GET_UNREAD_COUNT);
  return data.count || 0;
};

// Mark a single notification as read (PATCH)
export const markNotificationAsRead = async (notificationId: string) => {
  const { data } = await api.patch(
    API_PATHS.NOTIFICATION.MARK_AS_READ(notificationId),
  );
  return data;
};

// Mark all notifications as read (POST)
export const markAllNotificationsAsRead = async () => {
  const { data } = await api.post(API_PATHS.NOTIFICATION.MARK_ALL_AS_READ);
  return data;
};
