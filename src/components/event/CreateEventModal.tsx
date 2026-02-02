"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { eventService } from "@/api/services/eventService";
import { notify } from "@/utils/notify";
import { CreateEventPayload } from "@/api/types/event";

interface CreateEventModalProps {
  open: boolean;
  brandId: string;
  onClose: () => void;
  onCreated: () => void;
}

const initialForm: CreateEventPayload = {
  title: "",
  description: "",
  objectives: "",
  budget: 0,
  start_date: "",
  end_date: "",
  deliverables: "",
  target_audience: "",
  category: "",
  location: "",
  status: "active",
};

export default function CreateEventModal({
  open,
  brandId,
  onClose,
  onCreated,
}: CreateEventModalProps) {
  const [form, setForm] = useState<CreateEventPayload>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      notify.error("Event title is required");
      return;
    }

    if (!form.start_date || !form.end_date) {
      notify.error("Start and end dates are required");
      return;
    }

    try {
      setSubmitting(true);
      await eventService.createEvent(brandId, form);
      notify.success("Event created successfully 🎉");
      onCreated();
      onClose();
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message || "Failed to create event"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} title="Create Event" onClose={onClose}>
      <div className="space-y-4">
        <input
          placeholder="Event Title *"
          className="input"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Category"
          className="input"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Budget"
          className="input"
          value={form.budget}
          onChange={(e) =>
            setForm({ ...form, budget: Number(e.target.value) })
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            className="input"
            value={form.start_date}
            onChange={(e) =>
              setForm({ ...form, start_date: e.target.value })
            }
          />

          <input
            type="date"
            className="input"
            value={form.end_date}
            onChange={(e) =>
              setForm({ ...form, end_date: e.target.value })
            }
          />
        </div>

        <button
          className="btn-primary w-full disabled:opacity-60"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </div>
    </Modal>
  );
}
