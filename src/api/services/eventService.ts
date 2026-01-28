// services/eventService.ts
import { API_PATHS } from "@/api/apiPaths";
import api from "@/api/axiosInstance";

export interface Event {
  id: string;
  name: string;
  brand: {
    id: string;
    name: string;
  };
  date?: string;
  title?: string;
  description: string;
  objectives?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  deliverables?: string;
  target_audience?: string;
  category?: string;
  location?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Add any other event fields as needed
}

export interface CreateEventPayload {
  title: string;
  description: string;
  objectives?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  deliverables?: string;
  target_audience?: string;
  category?: string;
  location?: string;
  status?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// ------------------------
// Normalization helpers
// ------------------------
export const normalizeEvent = (event: Event): Event => ({
  ...event,
  id: String(event.id),
  brand: {
    id: String(event.brand.id),
    name: event.brand.name,
  },
  title: event.title ?? event.name ?? "",
  description: event.description ?? "",
  objectives: event.objectives ?? "",
  budget: event.budget ?? 0,
  start_date: event.start_date ?? event.date ?? "",
  end_date: event.end_date ?? "",
  deliverables: event.deliverables ?? "",
  target_audience: event.target_audience ?? "",
  category: event.category ?? "",
  location: event.location ?? "",
  status: event.status ?? "active",
  created_at: event.created_at ?? "",
  updated_at: event.updated_at ?? "",
});

export const normalizeEvents = (events: Event[]): Event[] =>
  events.map(normalizeEvent);

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

    if (Array.isArray(data)) return normalizeEvents(data);
    if (data && Array.isArray(data.data)) return normalizeEvents(data.data);

    console.warn(`Unexpected response format from getEventsByBrand(${brandId})`);
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
    const response = await api.put<Event>(API_PATHS.EVENT.UPDATE(eventId), payload);
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

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const res = await api.get<Event[]>("/event/all_events");
    return normalizeEvents(res.data);
  } catch (error) {
    console.error("Failed to fetch all events:", error);
    return [];
  }
};
