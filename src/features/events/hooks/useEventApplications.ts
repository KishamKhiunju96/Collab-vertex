"use client";

import { useEffect, useState, useCallback } from "react";
import { eventService } from "../services/event.service";
import { EventApplication } from "../types/event.types";
import { notify } from "@/utils/notify";

export const useEventApplications = (eventId: string) => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventApplications(eventId);
      setApplications(data);
    } catch {
      notify.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    fetchApplications();
  }, [eventId, fetchApplications]);

  const refetch = async () => {
    await fetchApplications();
  };

  return { applications, loading, error, refetch };
};
