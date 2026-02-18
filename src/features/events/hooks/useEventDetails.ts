"use client";

import { useEffect, useState } from "react";
import { eventService } from "../services/event.service";
import { Event } from "../types/event.types";
import { notify } from "@/utils/notify";

export const useEventDetails = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await eventService.getEventById(eventId);
        if (!cancelled) {
          setEvent(data);
        }
      } catch {
        if (!cancelled) {
          notify.error("Failed to load event details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { event, loading, error };
};
