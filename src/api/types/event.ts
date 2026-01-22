export interface CreateEventPayload {
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
  status: "active" | "inactive";
  brand_id: string;
}

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
  status: "active" | "inactive";
  created_at: string;
  updated_at?: string;
}
