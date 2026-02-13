import api from "@/api/axiosInstance";
import { Event } from "../types/event.types";
import { EventApplication } from "../types/event.types";

export const eventService = {
  async getEventById(eventId: string): Promise<Event> {
    const res = await api.get(`/event/${eventId}`);
    return res.data;
  },

  async getEventApplications(eventId: string): Promise<EventApplication[]> {
    const res = await api.get(`/event/event_applications/${eventId}`);
    return res.data;
  },
};
