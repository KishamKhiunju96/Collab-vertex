export interface CreateEventPayload {
  title: string;
  description?: string;
  objectives?: string;
  budget?: number;
  start_date: string;
  end_date?: string;
  deliverables?: string;
  target_audience?: string;
  category?: string;
  location?: string;
}
