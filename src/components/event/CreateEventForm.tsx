"use client";

import { useState } from "react";
import { eventService, EventPayload } from "@/api/services/eventService";
import { notify } from "@/utils/notify";
import { 
  Calendar,
  DollarSign,
  MapPin,
  Target,
  Users,
  Package,
  FileText,
  Tag
} from "lucide-react";

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

export default function CreateEventForm({
  brandId,
  onSuccess,
}: CreateEventFormProps) {
  const [form, setForm] = useState<EventPayload>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof EventPayload>(
    field: K,
    value: EventPayload[K],
  ) => {
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
    } catch (error: unknown) {
      console.error(error);
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Failed to create event";
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-button-primary-DEFAULT to-brand-primary-600 px-6 py-5">
        <h2 className="text-2xl font-bold text-white">Create New Event</h2>
        <p className="text-brand-primary-100 text-sm mt-1">
          Define your campaign details and requirements
        </p>
      </div>

      <div className="p-6 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide">
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
            <FileText size={16} className="text-button-primary-DEFAULT" />
            Event Title <span className="text-text-error">*</span>
          </label>
          <input
            className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted"
            placeholder="Enter event title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
            <FileText size={16} className="text-brand-secondary-DEFAULT" />
            Description <span className="text-text-error">*</span>
          </label>
          <textarea
            className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted resize-none"
            placeholder="Describe your event and collaboration goals"
            rows={4}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Start Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <Calendar size={16} className="text-brand-accent-DEFAULT" />
              Start Date <span className="text-text-error">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary"
              value={form.start_date}
              onChange={(e) => updateField("start_date", e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <Calendar size={16} className="text-brand-accent-DEFAULT" />
              End Date <span className="text-text-error">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary"
              value={form.end_date}
              onChange={(e) => updateField("end_date", e.target.value)}
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
            <DollarSign size={16} className="text-brand-highlight-DEFAULT" />
            Budget <span className="text-text-error">*</span>
          </label>
          <input
            type="number"
            min={1}
            className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted"
            placeholder="Enter budget amount"
            value={form.budget}
            onChange={(e) => updateField("budget", Number(e.target.value))}
          />
        </div>

        {/* Objectives */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
            <Target size={16} className="text-button-primary-DEFAULT" />
            Objectives
          </label>
          <textarea
            className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted resize-none"
            placeholder="Define your campaign objectives"
            rows={3}
            value={form.objectives}
            onChange={(e) => updateField("objectives", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Deliverables */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <Package size={16} className="text-brand-secondary-DEFAULT" />
              Deliverables
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted"
              placeholder="e.g., 5 Instagram posts"
              value={form.deliverables}
              onChange={(e) => updateField("deliverables", e.target.value)}
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <Users size={16} className="text-brand-accent-DEFAULT" />
              Target Audience
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted"
              placeholder="e.g., Young professionals"
              value={form.target_audience}
              onChange={(e) => updateField("target_audience", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <Tag size={16} className="text-brand-highlight-DEFAULT" />
              Category
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted"
              placeholder="e.g., Fashion, Tech, Lifestyle"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <MapPin size={16} className="text-brand-accent-DEFAULT" />
              Location
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted"
              placeholder="Event location"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
            Status
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary bg-white"
            value={form.status}
            onChange={(e) =>
              updateField("status", e.target.value as "active" | "inactive")
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-background-surface border-t border-border-subtle flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-button-primary-DEFAULT to-brand-primary-600 text-white font-semibold rounded-xl hover:from-button-primary-hover hover:to-brand-primary-700 transition-all duration-200 shadow-md hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Event...
            </span>
          ) : (
            "Create Event"
          )}
        </button>
      </div>
    </div>
  );
}
