// src/types/notification.ts

export interface NotificationData {
  application_id?: string;
  event_id?: string;
  influencer_id?: string;
  brand_id?: string;
  [key: string]: string | number | undefined;
}

export interface NotificationRead {
  id: string;
  type: string;
  title: string;
  message: string;
  data: NotificationData;
  is_read: boolean;
  created_at: string; // ISO string
}
