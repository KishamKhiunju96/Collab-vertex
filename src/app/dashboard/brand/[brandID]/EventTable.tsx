"use client";

import React from "react";
import { Event } from "@/api/types/event";

interface EventTableProps {
  events: Event[];
}

export default function EventTable({ events }: EventTableProps) {
  if (events.length === 0) return <p>No events created yet.</p>;

  return (
    <table className="min-w-full border border-gray-200 rounded overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Title</th>
          <th className="px-4 py-2 text-left">Date</th>
          <th className="px-4 py-2 text-left">Created At</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id} className="border-t">
            <td className="px-4 py-2">{event.title}</td>
            <td className="px-4 py-2">
              {new Date(event.start_date).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">
              {new Date(event.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
