"use client";

import { useEffect, useState } from "react";
import { eventService, Event } from "@/api/services/eventService";

export default function EventCards() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading events...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center py-10">No events available.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-text-primary">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {event.brand_name ?? "Brand"}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                event.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {event.status}
            </span>
          </div>

          {/* BODY */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {event.description}
          </p>

          <div className="text-sm space-y-1 mb-4">
            <p>
              <span className="font-medium">Category:</span> {event.category}
            </p>
            <p>
              <span className="font-medium">Location:</span> {event.location}
            </p>
            <p>
              <span className="font-medium">Budget:</span> ₹{event.budget}
            </p>
            <p>
              <span className="font-medium">Duration:</span>{" "}
              {new Date(event.start_date).toLocaleDateString()} –{" "}
              {new Date(event.end_date).toLocaleDateString()}
            </p>
          </div>

          {/* ACTION */}
          <button
            className="w-full rounded-lg bg-black text-white py-2 text-sm hover:bg-gray-800 transition"
            onClick={() => {
              console.log("Apply to event", event.id);
            }}
          >
            Apply to Event
          </button>
        </div>
      ))}
    </div>
  );
}
