"use client";

import React from "react";
import { Event } from "@/api/types/event";
import { Pencil, Trash2 } from "lucide-react";

interface EventTableProps {
  events: Event[];
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export default function EventTable({
  events,
  onEdit,
  onDelete,
}: EventTableProps) {
  if (events.length === 0) {
    return <p className="text-sm text-gray-500 mt-4">No events created yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Start Date</th>
            <th className="px-4 py-3 text-left">Created At</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t text-sm hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{event.title}</td>

              <td className="px-4 py-2">
                {new Date(event.start_date).toLocaleDateString()}
              </td>

              <td className="px-4 py-2 text-gray-500">
                {new Date(event.created_at).toLocaleDateString()}
              </td>

              <td className="px-4 py-2">
                <div className="flex justify-center gap-3">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(event)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Event"
                    >
                      <Pencil size={16} />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(event.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
