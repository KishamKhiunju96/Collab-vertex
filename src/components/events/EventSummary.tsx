"use client";

import { useEventDetails } from "@/features/events/hooks/useEventDetails";

export default function EventSummary({ eventId }: { eventId: string }) {
  const { event, loading } = useEventDetails(eventId);

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div className="rounded-lg border p-5">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-600 mt-2">{event.description}</p>
    </div>
  );
}
