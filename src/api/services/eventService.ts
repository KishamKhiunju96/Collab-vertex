import axios from "@/lib/axios";

export type EventStatus = "active" | "inactive";

export interface Brand {
  id: string;
  name: string;
}

export interface Event {
  id: string;

  // existing
  brand_id: string;

  // optional (future-proof)
  brand?: Brand;
  brand_name?: string;

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

export interface EventHybridFilterPayload {
  location: string;
  categories: string[];
  budget_range: number[]; // [min, max]
  target_audience: string;
  start_date: string; // ISO string
}

/* ============================
   API Paths
============================ */

const EVENT_API = {
  CREATE: (brandId: string) => `/event/create_event/${brandId}`,
  GET_BY_BRAND: (brandId: string) => `/event/eventsbybrand/${brandId}`,
  GET_ALL: "/event/all_events",
  UPDATE: (eventId: string) => `/event/update_event/${eventId}`,
  DELETE: (eventId: string) => `/event/delete_event/${eventId}`,

  // 🔍 Hybrid filter
  HYBRID_FILTER: "/event/events_using_hybrid",
};

/* ============================
   Service
============================ */

export const eventService = {
  // ✅ Create event
  async createEvent(
    brandId: string,
    payload: EventPayload
  ): Promise<Event> {
    const { data } = await axios.post<Event>(
      EVENT_API.CREATE(brandId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  },

  // ✅ Brand dashboard
  async getEventsByBrand(brandId: string): Promise<Event[]> {
    const { data } = await axios.get<Event[]>(
      EVENT_API.GET_BY_BRAND(brandId)
    );
    return data;
  },

  // ✅ Influencer dashboard (no filters)
  async getAllEvents(): Promise<Event[]> {
    const { data } = await axios.get<Event[]>(
      EVENT_API.GET_ALL
    );
    return data;
  },

  // 🔍 Influencer dashboard (with filters)
  async getEventsUsingHybrid(
    payload: EventHybridFilterPayload
  ): Promise<Event[]> {
    const { data } = await axios.post<Event[]>(
      EVENT_API.HYBRID_FILTER,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  },

  // ✅ Update event
  async updateEvent(
    eventId: string,
    payload: Partial<EventPayload>
  ): Promise<Event> {
    const { data } = await axios.patch<Event>(
      EVENT_API.UPDATE(eventId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  },

  // ✅ Delete event
  async deleteEvent(eventId: string): Promise<void> {
    await axios.delete(EVENT_API.DELETE(eventId));
  },
};
