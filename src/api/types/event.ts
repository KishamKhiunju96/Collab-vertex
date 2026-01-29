/* =======================
   Core Event Model
======================= */

export type EventStatus = "active" | "inactive" | "draft";

export interface Event {
  id: string;
  brandId: string;

  title: string;
  description: string;

  objectives?: string;
  budget?: number;

  startDate: string;
  endDate?: string;

  deliverables?: string;
  targetAudience?: string;
  category?: string;
  location?: string;

  status: EventStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* =======================
   Backend Raw Event
   (snake_case)
======================= */

export interface EventApiResponse {
  id: string;
  brand_id: string;

  title?: string;
  name?: string;
  description?: string;

  objectives?: string;
  budget?: number;

  start_date?: string;
  date?: string;
  end_date?: string;

  deliverables?: string;
  target_audience?: string;
  category?: string;
  location?: string;

  status?: EventStatus;

  created_at?: string;
  updated_at?: string;
}

/* =======================
   Payloads
======================= */

export interface CreateEventPayload {
  title: string;
  description?: string;

  objectives?: string;
  budget?: number;

  startDate: string;
  endDate?: string;

  deliverables?: string;
  targetAudience?: string;
  category?: string;
  location?: string;

  status?: EventStatus;
}

export interface UpdateEventPayload
  extends Partial<CreateEventPayload> {}

/* =======================
   Normalizers
======================= */

export const normalizeEvent = (
  raw: EventApiResponse | any,
): Event => ({
  id: String(raw?.id ?? ""),
  brandId: String(raw?.brand_id ?? raw?.brand?.id ?? ""),

  title: raw?.title ?? raw?.name ?? "",
  description: raw?.description ?? "",

  objectives: raw?.objectives ?? undefined,
  budget: raw?.budget ?? undefined,

  startDate: raw?.start_date ?? raw?.date ?? "",
  endDate: raw?.end_date ?? undefined,

  deliverables: raw?.deliverables ?? undefined,
  targetAudience: raw?.target_audience ?? undefined,
  category: raw?.category ?? undefined,
  location: raw?.location ?? undefined,

  status: raw?.status ?? "active",

  createdAt: raw?.created_at ?? undefined,
  updatedAt: raw?.updated_at ?? undefined,
});

export const normalizeEvents = (
  events: EventApiResponse[] | any[] = [],
): Event[] => events.map(normalizeEvent);
