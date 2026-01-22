"use client";

import { useState } from "react";
import { createEvent } from "@/api/services/eventService";
import { CreateEventPayload } from "@/api/types/event";

interface CreateEventModalProps {
  open: boolean;
  brandId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateEventModal({
  open,
  brandId,
  onClose,
  onCreated,
}: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title || !date) {
      setError("Title and date are required.");
      return;
    }

    const payload: CreateEventPayload = {
      title,
      start_date: date,
      description: "",
      objectives: "",
      budget: 0,
      end_date: "",
      deliverables: "",
      target_audience: "",
      category: "",
      location: "",
      event_active: true,
    };

    try {
      setLoading(true);
      setError(null);

      await createEvent(brandId, payload);

      // reset form
      setTitle("");
      setDate("");

      onCreated();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to create event", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create event. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-lg font-semibold">Create Event</h2>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <input
          placeholder="Event title"
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <input
          type="date"
          className="border p-2 w-full rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
