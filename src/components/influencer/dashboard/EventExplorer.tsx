"use client";

// This component is currently not in use.
// EventCards already handles its own event fetching and filtering logic.
// If you want to use this EventExplorer component, you'll need to refactor EventCards
// to accept props instead of managing its own state.

/*
import { useEffect, useState } from "react";
import EventCards from "./EventCards";
import EventFilter from "./EventFilter";
import {
  eventService,
  EventHybridFilterPayload,
  Event,
} from "@/api/services/eventService";

const PAGE_SIZE = 6;

export default function EventExplorer() {
  // Events list
  const [events, setEvents] = useState<Event[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  // Filters state (strongly typed)
  const [filters, setFilters] = useState<EventHybridFilterPayload>({
    location: "",
    categories: [],
    budget_range: [], // ✅ matches [number, number] | []
    target_audience: "",
    start_date: "",
  });

  // Fetch events using hybrid filter API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEventsUsingHybrid(filters);
      setEvents(data);
      setVisibleCount(PAGE_SIZE); // reset visible count on filter
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle See More button
  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <EventCards
          events={events}
          visibleCount={visibleCount}
          loading={loading}
          onSeeMore={handleSeeMore}
        />
      </div>

      <EventFilter
        filters={filters}
        onChange={setFilters}
        onApply={fetchEvents}
      />
    </div>
  );
}
*/

// Temporary placeholder export to prevent build errors
export default function EventExplorer() {
  return null;
}
