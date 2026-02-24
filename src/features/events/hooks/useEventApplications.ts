"use client";

import { useEffect, useState, useCallback } from "react";
import { eventService } from "../services/event.service";
import { EventApplication } from "../types/event.types";
import { notify } from "@/utils/notify";

export const useEventApplications = (eventId: string) => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!eventId) {
      console.warn("Cannot fetch applications: eventId is missing");
      setLoading(false);
      return;
    }

    try {
      console.log(
        "useEventApplications: Fetching applications for event:",
        eventId,
      );
      setLoading(true);
      setError(null);
      const data = await eventService.getEventApplications(eventId);
      console.log("useEventApplications: Received applications:", data?.length);
      setApplications(data);
    } catch (err) {
      console.error("useEventApplications: Error fetching applications:", err);
      setError("Failed to load applications");
      notify.error("Failed to load applications");
      setApplications([]);
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
