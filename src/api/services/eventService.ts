import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { CreateEventPayload, Event } from "@/api/types/event";

export type { Event, CreateEventPayload };

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const createEvent = async (
  brandId: string,
  payload: CreateEventPayload,
): Promise<Event> => {
  try {
    const response = await api.post<Event>(API_PATHS.EVENT.CREATE(brandId), {
      ...payload,
      brand_id: brandId,
    });

    return normalizeEvent(response.data);
  } catch (error) {
    console.error(`Failed to create event for brand ${brandId}:`, error);
    throw error;
  }
};

export const getEventsByBrand = async (brandId: string): Promise<Event[]> => {
  try {
    const response = await api.get<ApiResponse<Event[]> | Event[]>(
      API_PATHS.EVENT.GET_BY_BRAND(brandId),
    );

    const data = response.data;

    if (Array.isArray(data)) {
      return normalizeEvents(data);
    }

    if (data && Array.isArray(data.data)) {
      return normalizeEvents(data.data);
    }

    console.warn(
      `Unexpected response format from getEventsByBrand(${brandId})`,
    );
    return [];
  } catch (error) {
    console.error(`Failed to fetch events for brand ${brandId}:`, error);
    return [];
  }
};

export const updateEvent = async (
  eventId: string,
  payload: Partial<CreateEventPayload>,
): Promise<Event> => {
  try {
    const response = await api.put<Event>(
      API_PATHS.EVENT.UPDATE(eventId),
      payload,
    );

    return normalizeEvent(response.data);
  } catch (error) {
    console.error(`Failed to update event ${eventId}:`, error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await api.delete(API_PATHS.EVENT.DELETE(eventId));
  } catch (error) {
    console.error(`Failed to delete event ${eventId}:`, error);
    throw error;
  }
};

export const normalizeEvent = (event: Event): Event => ({
  ...event,
  id: String(event.id),
  brand_id: String(event.brand_id),
  title: event.title ?? "",
  description: event.description ?? "",
  objectives: event.objectives ?? "",
  budget: event.budget ?? 0,
  start_date: event.start_date ?? "",
  end_date: event.end_date ?? "",
  deliverables: "deliverables" in event ? event.deliverables : "",
  target_audience: "target_audience" in event ? event.target_audience : "",
  category: "category" in event ? event.category : "",
  location: "location" in event ? event.location : "",
  status: event.status ?? "active",
  created_at: event.created_at ?? "",
  updated_at: event.updated_at ?? "",
});

export const normalizeEvents = (events: Event[]): Event[] =>
  events.map(normalizeEvent);
