// services/eventService.ts
import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { Event, CreateEventPayload } from "@/api/types/event";
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

const normalizeEvent = (raw: any): Event => ({
  id: String(raw?.id ?? ""),
  brand_id: String(raw?.brand_id ?? raw?.brand?.id ?? ""),

  title: raw?.title ?? raw?.name ?? "",
  description: raw?.description ?? "",

  objectives: raw?.objectives ?? "",
  budget: Number(raw?.budget ?? 0),

  start_date: raw?.start_date ?? raw?.date ?? "",
  end_date: raw?.end_date ?? "",

  deliverables: raw?.deliverables ?? "",
  target_audience: raw?.target_audience ?? "",
  category: raw?.category ?? "",
  location: raw?.location ?? "",

  status: raw?.status ?? "active",
  created_at: raw?.created_at ?? "",
  updated_at: raw?.updated_at ?? "",
});

const normalizeEvents = (events: any[] = []): Event[] =>
  events.map(normalizeEvent);

/* =======================
   Event Service
======================= */

export const eventService = {
  /** Create event for a brand */
  createEvent: async (
    brandId: string,
    payload: CreateEventPayload,
  ): Promise<Event> => {
    const response = await api.post<ApiResponse<any> | any>(
      API_PATHS.EVENT.CREATE(brandId),
      { ...payload, brand_id: brandId },
    );

    const data =
      (response.data as ApiResponse<any>)?.data ?? response.data;

    return normalizeEvent(data);
  },

  /** Get events by brand */
  getEventsByBrand: async (
    brandId: string,
  ): Promise<Event[]> => {
    try {
      const response = await api.get<
        ApiResponse<any[]> | any[]
      >(API_PATHS.EVENT.GET_BY_BRAND(brandId));

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      return Array.isArray(data) ? normalizeEvents(data) : [];
    } catch (error) {
      console.error(
        `Failed to fetch events for brand ${brandId}:`,
        error,
      );
      return [];
    }
  },

  /** Update event */
  updateEvent: async (
    eventId: string,
    payload: Partial<CreateEventPayload>,
  ): Promise<Event> => {
    const response = await api.put<ApiResponse<any> | any>(
      API_PATHS.EVENT.UPDATE(eventId),
      payload,
    );

    const data =
      (response.data as ApiResponse<any>)?.data ?? response.data;

    return normalizeEvent(data);
  },

  /** Delete event */
  deleteEvent: async (eventId: string): Promise<void> => {
    await api.delete(API_PATHS.EVENT.DELETE(eventId));
  },

  /** Get all events (admin / influencer feed) */
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<
        ApiResponse<any[]> | any[]
      >("/event/all_events");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      return Array.isArray(data) ? normalizeEvents(data) : [];
    } catch (error) {
      console.error("Failed to fetch all events:", error);
      return [];
    }
  },
};
