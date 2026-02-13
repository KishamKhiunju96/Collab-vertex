"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Pencil,
  Trash2,
  Check,
  Calendar,
  DollarSign,
  Tag,
  MapPin,
  MoreVertical,
} from "lucide-react";

import {
  eventService,
  Event,
  EventPayload,
  EventStatus,
} from "@/api/services/eventService";
import { notify } from "@/utils/notify";
import Modal from "@/components/ui/Modal";

interface EventTableProps {
  brandId: string;
  refreshKey?: number;
  onEventClick?: (eventId: string) => void;
}

export default function EventTable({
  brandId,
  refreshKey,
  onEventClick,
}: EventTableProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [updatePayload, setUpdatePayload] = useState<Partial<EventPayload>>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  /* =========================
     Fetch events
  ========================== */
  const fetchEvents = useCallback(async () => {
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
  }, [brandId]);

  useEffect(() => {
    if (brandId) fetchEvents();
  }, [brandId, refreshKey, fetchEvents]);

  /* =========================
     Actions
  ========================== */
  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

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
    setActiveMenu(null);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* =========================
     Loading State
  ========================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  /* =========================
     Empty State
  ========================== */
  if (!events.length) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No events yet
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Create your first event to start connecting with influencers and grow
          your brand reach.
        </p>
      </div>
    );
  }

  /* =========================
     Desktop Table View
  ========================== */
  return (
    <>
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                {/* Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {onEventClick ? (
                    <button
                      onClick={() => onEventClick(event.id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-left hover:underline transition-colors"
                    >
                      {event.title}
                    </button>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      {event.title}
                    </span>
                  )}
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {event.category || "Uncategorized"}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-red-400" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </td>

                {/* Budget */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {formatCurrency(event.budget)}
                    </span>
                  </div>
                </td>

                {/* Dates */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">
                      {formatDate(event.start_date)}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === "active"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {event.status.charAt(0).toUpperCase() +
                      event.status.slice(1)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Event"
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

      {/* Mobile Card View - Hidden on desktop */}
      <div className="lg:hidden space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {onEventClick ? (
                  <button
                    onClick={() => onEventClick(event.id)}
                    className="text-lg font-bold text-blue-600 hover:text-blue-800 hover:underline text-left w-full truncate"
                  >
                    {event.title}
                  </button>
                ) : (
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {event.title}
                  </h3>
                )}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-2 ${
                    event.status === "active"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>

              {/* Mobile Menu */}
              <div className="relative ml-2">
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === event.id ? null : event.id)
                  }
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {activeMenu === event.id && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setActiveMenu(null)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
                      <button
                        onClick={() => handleEdit(event)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={16} className="text-blue-600" />
                        <span className="font-medium">Edit Event</span>
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <Trash2 size={16} className="text-red-600" />
                        <span className="font-medium">Delete Event</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* Category */}
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.category || "Uncategorized"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Budget
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    {formatCurrency(event.budget)}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Event Period
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(event.start_date)} -{" "}
                    {formatDate(event.end_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          Edit Modal
      ========================== */}
      {editingEvent && (
        <Modal
          open
          title={`Update Event: ${editingEvent.title}`}
          onClose={() => setEditingEvent(null)}
        >
          <div className="space-y-5 text-gray-900">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                placeholder="Enter event title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={updatePayload.title || ""}
                onChange={(e) =>
                  setUpdatePayload({
                    ...updatePayload,
                    title: e.target.value,
                  })
                }
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                placeholder="Enter category"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={updatePayload.category || ""}
                onChange={(e) =>
                  setUpdatePayload({
                    ...updatePayload,
                    category: e.target.value,
                  })
                }
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={updatePayload.budget || 0}
                  onChange={(e) =>
                    setUpdatePayload({
                      ...updatePayload,
                      budget: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setEditingEvent(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateSubmit}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <Check size={18} />
                <span>Update Event</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
