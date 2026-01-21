import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { CreateEventPayload, Event } from "@/api/types/event";

export const createEvent = async (
  brandId: string,
  payload: CreateEventPayload,
): Promise<Event> => {
  const response = await api.post(API_PATHS.EVENT.CREATE(brandId), payload);
  return response.data;
};
