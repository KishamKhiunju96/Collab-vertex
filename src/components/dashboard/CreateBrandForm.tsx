"use client";

import { createBrand } from "@/api/services/brandService";
import { useState } from "react";

interface BrandForm {
  name: string;
  description: string;
  location: string;
  website_url: string;
}

export default function CreateBrandForm() {
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const timestamp = new Date().toISOString();

      await createBrand({
        ...form,
        created_at: timestamp,
        updated_at: timestamp,
      });

      alert("Brand created successfully!");
      setForm({
        name: "",
        description: "",
        location: "",
        website_url: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create brand";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium">
          Brand Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter brand name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Tell us about your brand..."
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="location" className="block text-sm font-medium">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="City, Country"
          value={form.location}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="website_url" className="block text-sm font-medium">
          Website URL
        </label>
        <input
          type="url"
          id="website_url"
          name="website_url"
          placeholder="https://yourbrand.com"
          value={form.website_url}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`
          w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium
          hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        {loading ? "Creating..." : "Create Brand"}
      </button>
    </form>
  );
}
