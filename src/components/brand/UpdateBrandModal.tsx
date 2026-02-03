"use client";

import { useState, useEffect } from "react";
import type { UpdateBrandPayload } from "@/api/services/brandService";

interface UpdateBrandModalProps {
  initial: UpdateBrandPayload;
  open: boolean;
  onClose: () => void;
  onUpdate: (payload: UpdateBrandPayload) => Promise<void> | void;
}

export default function UpdateBrandModal({
  initial,
  open,
  onClose,
  onUpdate,
}: UpdateBrandModalProps) {
  const [form, setForm] = useState<UpdateBrandPayload>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (
    field: keyof UpdateBrandPayload,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await onUpdate(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 text-text-primary"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">Update Brand Profile</h2>

        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          value={form.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="w-full mb-3 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
          rows={3}
          value={form.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <label className="block font-medium mb-1">Location</label>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Location"
          value={form.location ?? ""}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <label className="block font-medium mb-1">Website URL</label>
        <input
          type="url"
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Website URL"
          value={form.websiteUrl ?? ""}
          onChange={(e) => handleChange("websiteUrl", e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
