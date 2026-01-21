"use client";

import { useState } from "react";
import api from "@/api/axiosInstance";
import { AxiosError } from "axios";

// Event returned by backend
export interface CreatedEvent {
  id: string | number;
  title: string;
  date: string;
  brandId: string;
  createdAt?: string;
}

interface CreateEventFormProps {
  brandId: string;
  onCreate: (newEvent: CreatedEvent) => void;
  onClose?: () => void; // Added onClose to allow closing modal
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
      const response = await api.post<CreatedEvent>("/event", {
        brandId,
        title: title.trim(),
        date,
      });

      // Normalize id to string to match Event type in BrandDetailPage
      const normalizedEvent: CreatedEvent = {
        ...response.data,
        id: String(response.data.id),
      };

      onCreate(normalizedEvent);

      // Reset form
      setTitle("");
      setDate("");

      // Close modal if onClose exists
      if (onClose) onClose();
    } catch (err: unknown) {
      console.error("Event creation failed:", err);
      let message = "Failed to create event. Please try again.";

      if (err instanceof AxiosError) {
        message = err.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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

      <button
        type="submit"
        disabled={isLoading || !title.trim() || !date}
        className={`
          px-4 py-2 rounded-md font-medium text-white
          ${
            isLoading || !title.trim() || !date
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
          transition-colors
        `}
      >
        {isLoading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
