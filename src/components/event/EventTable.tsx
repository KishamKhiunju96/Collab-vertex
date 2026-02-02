"use client";

import { useEffect, useState } from "react";
import { eventService, Event } from "@/api/services/eventService";
import { notify } from "@/utils/notify";

interface EventTableProps {
  brandId: string;
  refreshKey?: any; // optional key to trigger table refresh
}

export default function EventTable({ brandId, refreshKey }: EventTableProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEventsByBrand(brandId);
      setEvents(data);
    } catch (err) {
      console.error(err);
      notify.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on mount or when refreshKey changes
  useEffect(() => {
    if (brandId) fetchEvents();
  }, [brandId, refreshKey]);

  if (loading) return <p className="p-4 text-gray-500">Loading events...</p>;

  if (!events.length) {
    return <p className="p-4 text-center text-gray-500">No events created yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-center">Category</th>
            <th className="px-4 py-2 text-center">Budget</th>
            <th className="px-4 py-2 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t">
              <td className="px-4 py-2">{event.title}</td>
              <td className="px-4 py-2 text-center">{event.category || "—"}</td>
              <td className="px-4 py-2 text-center">{event.budget}</td>
              <td className="px-4 py-2 text-center">{event.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
