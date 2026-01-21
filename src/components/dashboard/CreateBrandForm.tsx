"use client";

import React, { useState } from "react";
import { createBrand } from "@/api/services/brandService";

interface BrandForm {
  name: string;
  description: string;
  location: string;
  website_url: string;
}

interface CreateBrandFormProps {
  onSuccess?: () => void;
}

const CreateBrandForm: React.FC<CreateBrandFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<BrandForm>({
    name: "",
    description: "",
    location: "",
    website_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBrand({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        location: form.location.trim(),
        website_url: form.website_url.trim() || undefined,
      });

      setForm({
        name: "",
        description: "",
        location: "",
        website_url: "",
      });

      onSuccess?.();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create brand. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Brand name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border text-text-primary p-3 rounded-md focus:ring-2 focus:ring-green-500"
      />

      <textarea
        name="description"
        placeholder="Brand description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full border text-text-primary p-3 rounded-md focus:ring-2 focus:ring-green-500"
      />

      <input
        type="text"
        name="location"
        placeholder="City, Country"
        value={form.location}
        onChange={handleChange}
        required
        className="w-full border text-text-primary p-3 rounded-md focus:ring-2 focus:ring-green-500"
      />

      <input
        type="url"
        name="website_url"
        placeholder="https://brand.com"
        value={form.website_url}
        onChange={handleChange}
        className="w-full border text-text-primary p-3 rounded-md focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Brand"}
      </button>
    </form>
  );
};

export default CreateBrandForm;
