"use client";

import { useEffect, useState } from "react";
import { eventService } from "../services/event.service";
import { EventApplication } from "../types/event.types";

export const useEventApplications = (eventId: string) => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;

    const fetchApplications = async () => {
      try {
        const data = await eventService.getEventApplications(eventId);
        if (!cancelled) setApplications(data);
      } catch {
        if (!cancelled) setError("Failed to load applications");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchApplications();

    return () => {
      cancelled = true; // cleanup to avoid setting state on unmounted component
    };
  }, [eventId]);

  return { applications, loading, error };
};
