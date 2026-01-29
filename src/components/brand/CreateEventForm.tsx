"use client";

import React, { useState } from "react";
import { brandService, CreateBrandPayload, Brand } from "@/api/services/brandService";

interface CreateBrandFormProps {
  onSuccess: (brand: Brand) => void;
  onCancel: () => void;
}

export default function CreateBrandForm({ onSuccess, onCancel }: CreateBrandFormProps) {
  const [form, setForm] = useState<CreateBrandPayload>({
    name: "",
    description: "",
    location: "",
    websiteUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.location) {
      setError("Brand name and location are required.");
      return;
    }

    try {
      setLoading(true);
      const brand = await brandService.createBrand(form);
      onSuccess(brand);
    } catch (err: any) {
      setError(err?.message || "Failed to create brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <input
        autoFocus
        placeholder="Brand Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border rounded-md p-2 resize-none focus:ring-2 focus:ring-green-500 outline-none"
        rows={3}
      />

      <input
        placeholder="Location *"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        placeholder="Website URL"
        value={form.websiteUrl}
        onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Brand"}
        </button>
      </div>
    </form>
  );
}
