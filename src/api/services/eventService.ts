import axios from "axios";

export type EventStatus = "active" | "inactive";

export interface Event {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  objectives: string;
  budget: number;
  start_date: string;
  end_date: string;
  deliverables: string;
  target_audience: string;
  category: string;
  location: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface EventPayload {
  title: string;
  description: string;
  objectives: string;
  budget: number;
  start_date: string;
  end_date: string;
  deliverables: string;
  target_audience: string;
  category: string;
  location: string;
  status: EventStatus;
}

const EVENT_API = {
  CREATE: (brandId: string) => `/event/create_event/${brandId}`,
  GET_BY_BRAND: (brandId: string) => `/event/get_events_by_brand/${brandId}`,
  GET_BY_ID: (eventId: string) => `/event/${eventId}`,
  UPDATE: (eventId: string) => `/event/update_event/${eventId}`,
  DELETE: (eventId: string) => `/event/delete_event/${eventId}`,
};

export const eventService = {
  async createEvent(brandId: string, payload: EventPayload): Promise<Event> {
    const { data } = await axios.post<Event>(
      EVENT_API.CREATE(brandId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  },

  async getEventsByBrand(brandId: string): Promise<Event[]> {
    const { data } = await axios.get<Event[]>(EVENT_API.GET_BY_BRAND(brandId));
    return data;
  },

  async getEventById(eventId: string): Promise<Event> {
    const { data } = await axios.get<Event>(EVENT_API.GET_BY_ID(eventId));
    return data;
  },

  async updateEvent(eventId: string, payload: Partial<EventPayload>): Promise<Event> {
    const { data } = await axios.put<Event>(
      EVENT_API.UPDATE(eventId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  },

  async deleteEvent(eventId: string): Promise<void> {
    await axios.delete(EVENT_API.DELETE(eventId));
  },
};
