"use client";

import { useState } from "react";
import { eventService, EventPayload } from "@/api/services/eventService";
import { notify } from "@/utils/notify";

export interface CreateEventStepperProps {
  brandId: string;
  onCancel: () => void;
  onSubmit?: (data: EventPayload) => void;
}

const initialForm: EventPayload = {
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

export default function CreateEventStepper({
  brandId,
  onSubmit,
  onCancel,
}: CreateEventStepperProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<EventPayload>(initialForm);

  const update = <K extends keyof EventPayload>(
    key: K,
    value: EventPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    try {
      setLoading(true);
      await eventService.createEvent(brandId, form);
      notify.success("Event created successfully");
      onSubmit?.(form);
      onCancel();
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message || "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded ${
              step >= s ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-3">
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
          <textarea
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-3">
          <textarea
            className="input"
            placeholder="Objectives"
            value={form.objectives}
            onChange={(e) => update("objectives", e.target.value)}
          />
          <input
            type="number"
            className="input"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) => update("budget", Number(e.target.value))}
          />
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-3">
          <input
            type="date"
            className="input"
            value={form.start_date}
            onChange={(e) => update("start_date", e.target.value)}
          />
          <input
            type="date"
            className="input"
            value={form.end_date}
            onChange={(e) => update("end_date", e.target.value)}
          />
          <input
            className="input"
            placeholder="Category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          className="btn-outline"
        >
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        )}
      </div>
    </div>
  );
}
