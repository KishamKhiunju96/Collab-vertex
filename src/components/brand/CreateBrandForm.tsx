"use client";

import React, { useState } from "react";
import { brandService, CreateBrandPayload, Brand } from "@/api/services/brandService";
import { notify } from "@/utils/notify";

interface CreateBrandFormProps {
  onSuccess?: (brand: Brand) => void;
  onCancel?: () => void;
}

export default function CreateBrandForm({
  onSuccess,
  onCancel,
}: CreateBrandFormProps) {
  const [form, setForm] = useState<CreateBrandPayload>({
    name: "",
    description: "",
    location: "",
    websiteUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.location) {
      notify.error("Name and Location are required");
      return;
    }

    try {
      setLoading(true);

      const newBrand = await brandService.createBrand(form);

      notify.success(`Brand "${newBrand.name}" created successfully`);

      setForm({
        name: "",
        description: "",
        location: "",
        websiteUrl: "",
      });

      onSuccess?.(newBrand);
    } catch (err: any) {
      console.error("Failed to create brand:", err);

      notify.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create brand"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 border rounded bg-white shadow-md"
    >
      <input
        placeholder="Brand Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Location *"
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Website URL"
        value={form.websiteUrl}
        onChange={(e) =>
          setForm({ ...form, websiteUrl: e.target.value })
        }
        className="border p-2 w-full rounded"
      />

      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Brand"}
        </button>
      </div>
    </form>
  );
}
