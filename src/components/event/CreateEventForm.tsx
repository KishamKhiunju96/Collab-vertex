"use client";

import { useState } from "react";
import { eventService, EventPayload } from "@/api/services/eventService";
import { notify } from "@/utils/notify";

interface CreateEventFormProps {
  brandId: string;
  onSuccess: () => void;
}

const INITIAL_FORM_STATE: EventPayload = {
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
};

export default function CreateEventForm({ brandId, onSuccess }: CreateEventFormProps) {
  const [form, setForm] = useState<EventPayload>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof EventPayload>(field: K, value: EventPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      notify.error("Title is required");
      return false;
    }
    if (!form.start_date || !form.end_date) {
      notify.error("Start and end dates are required");
      return false;
    }
    if (new Date(form.end_date) < new Date(form.start_date)) {
      notify.error("End date cannot be before start date");
      return false;
    }
    if (form.budget <= 0) {
      notify.error("Budget must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateForm()) return;

    try {
      setLoading(true);
      await eventService.createEvent(brandId, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        objectives: form.objectives.trim(),
        deliverables: form.deliverables.trim(),
        target_audience: form.target_audience.trim(),
        category: form.category.trim(),
        location: form.location.trim(),
      });

      notify.success("Event created successfully");
      onSuccess();
      setForm(INITIAL_FORM_STATE);
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message || error?.message || "Failed to create event";
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        className="input"
        placeholder="Title"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Description"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Objectives"
        value={form.objectives}
        onChange={(e) => updateField("objectives", e.target.value)}
      />

      <input
        type="number"
        min={1}
        className="input"
        placeholder="Budget"
        value={form.budget}
        onChange={(e) => updateField("budget", Number(e.target.value))}
      />

      <input
        type="date"
        className="input"
        value={form.start_date}
        onChange={(e) => updateField("start_date", e.target.value)}
      />

      <input
        type="date"
        className="input"
        value={form.end_date}
        onChange={(e) => updateField("end_date", e.target.value)}
      />

      <input
        className="input"
        placeholder="Deliverables"
        value={form.deliverables}
        onChange={(e) => updateField("deliverables", e.target.value)}
      />

      <input
        className="input"
        placeholder="Target Audience"
        value={form.target_audience}
        onChange={(e) => updateField("target_audience", e.target.value)}
      />

      <input
        className="input"
        placeholder="Category"
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
      />

      <input
        className="input"
        placeholder="Location"
        value={form.location}
        onChange={(e) => updateField("location", e.target.value)}
      />

      <select
        className="input"
        value={form.status}
        onChange={(e) =>
          updateField("status", e.target.value as "active" | "inactive")
        }
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2 rounded text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-900"
        }`}
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </div>
  );
}
