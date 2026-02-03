"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Check } from "lucide-react";

import { eventService, Event, EventPayload, EventStatus } from "@/api/services/eventService";
import { notify } from "@/utils/notify";
import Modal from "@/components/ui/Modal";

interface EventTableProps {
  brandId: string;
  refreshKey?: any;
}

export default function EventTable({ brandId, refreshKey }: EventTableProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [updatePayload, setUpdatePayload] = useState<Partial<EventPayload>>({});

  // Fetch events
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

  useEffect(() => {
    if (brandId) fetchEvents();
  }, [brandId, refreshKey]);

  const handleDelete = async (eventId: string) => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      await eventService.deleteEvent(eventId);
      notify.success("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete event");
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setUpdatePayload({
      title: event.title,
      description: event.description,
      objectives: event.objectives,
      budget: event.budget,
      start_date: event.start_date,
      end_date: event.end_date,
      deliverables: event.deliverables,
      target_audience: event.target_audience,
      category: event.category,
      location: event.location,
      status: event.status,
    });
  };

  const handleUpdateSubmit = async () => {
    if (!editingEvent) return;

    try {
      await eventService.updateEvent(editingEvent.id, updatePayload);
      notify.success("Event updated successfully");
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      notify.error("Failed to update event");
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-500">Loading events...</p>;
  }

  if (!events.length) {
    return (
      <p className="p-4 text-center text-gray-500">No events created yet.</p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden text-text-primary">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-center">Category</th>
              <th className="px-4 py-2 text-center">Budget</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{event.title}</td>
                <td className="px-4 py-2 text-center">{event.category || "—"}</td>
                <td className="px-4 py-2 text-center">{event.budget}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      event.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>

                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEvent && (
        <Modal
          open={!!editingEvent}
          title={`Update Event: ${editingEvent.title}`}
          onClose={() => setEditingEvent(null)}
        >
          <div className="space-y-4 text-text-primary">
            <input
              type="text"
              placeholder="Title"
              className="w-full border p-2 rounded"
              value={updatePayload.title || ""}
              onChange={(e) =>
                setUpdatePayload({ ...updatePayload, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full border p-2 rounded"
              value={updatePayload.category || ""}
              onChange={(e) =>
                setUpdatePayload({ ...updatePayload, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Budget"
              className="w-full border p-2 rounded"
              value={updatePayload.budget || 0}
              onChange={(e) =>
                setUpdatePayload({
                  ...updatePayload,
                  budget: Number(e.target.value),
                })
              }
            />
            <select
              className="w-full border p-2 rounded"
              value={updatePayload.status || "active"}
              onChange={(e) =>
                setUpdatePayload({
                  ...updatePayload,
                  status: e.target.value as EventStatus,
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center gap-2"
              >
                <Check size={16} /> Update
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
