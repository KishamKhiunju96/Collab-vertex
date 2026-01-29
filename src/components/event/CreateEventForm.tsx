"use client";

import { useState } from "react";
import { eventService } from "@/api/services/eventService";

export default function CreateEventForm({
  brandId,
  onSuccess,
}: {
  brandId: string;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    objectives: "",
    budget: 1,
    start_date: "",
    end_date: "",
    deliverables: "",
    target_audience: "",
    category: "",
    location: "",
    status: "active",
  });

  const handleSubmit = async () => {
    await eventService.createEvent(brandId, form);
    onSuccess();
  };

  return (
    <div className="space-y-3">
      <input
        placeholder="Title"
        className="input"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="input"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded"
      >
        Create Event
      </button>
    </div>
  );
}
