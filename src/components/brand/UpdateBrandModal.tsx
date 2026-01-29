"use client";

import { useState, useEffect } from "react";
import type { UpdateBrandPayload } from "@/api/services/brandService";

interface UpdateBrandModalProps {
  initial: UpdateBrandPayload;
  open: boolean;
  onClose: () => void;
  onUpdate: (payload: UpdateBrandPayload) => void;
}

export default function UpdateBrandModal({
  initial,
  open,
  onClose,
  onUpdate,
}: UpdateBrandModalProps) {
  const [form, setForm] = useState<UpdateBrandPayload>(initial);

  // Update form state if `initial` changes
  useEffect(() => {
    setForm(initial);
  }, [initial]);

  if (!open) return null;

  const handleChange = (field: keyof UpdateBrandPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // prevent closing if clicked inside modal
      >
        <h2 className="text-xl font-bold mb-4">Update Brand Profile</h2>

        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Name"
          value={form.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        <textarea
          className="w-full mb-3 p-2 border rounded"
          placeholder="Description"
          value={form.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Location"
          value={form.location ?? ""}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Website URL"
          value={form.websiteUrl ?? ""}
          onChange={(e) => handleChange("websiteUrl", e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
