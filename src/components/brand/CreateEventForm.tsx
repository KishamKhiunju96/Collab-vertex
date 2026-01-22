"use client";

import { useState } from "react";
import api from "@/api/axiosInstance";
import { AxiosError } from "axios";

// ── Import the real shared type ────────────────────────────────
import type { Event } from "@/api/types/event"; // ← adjust path if needed

interface CreateEventFormProps {
  brandId: string;
  onCreate: (newEvent: Event) => void; // ← use Event here
  onClose?: () => void;
}

export default function CreateEventForm({
  brandId,
  onCreate,
  onClose,
}: CreateEventFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post<Event>(
        `/brands/${brandId}/events`,

        {
          brandId,
          title: title.trim(),
          date,
        },
      );

      onCreate(response.data);

      setTitle("");
      setDate("");
      onClose?.();
    } catch (err: unknown) {
      console.error("Event creation failed:", err);

      let message = "Failed to create event. Please try again.";
      if (err instanceof AxiosError) {
        message = err.response?.data?.message || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-2"
      noValidate
    >
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Event Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Product Launch 2025"
          required
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Event Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !date}
          className={`
            px-5 py-2 rounded-md font-medium text-white transition-colors
            ${
              isLoading || !title.trim() || !date
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}
