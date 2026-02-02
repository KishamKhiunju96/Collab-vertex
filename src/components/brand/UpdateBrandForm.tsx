"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { Brand, UpdateBrandPayload, brandService } from "@/api/services/brandService";

interface UpdateBrandFormProps {
  brand: Brand; 
  onUpdate: (updatedBrand: Brand) => void;
  onClose?: () => void;
}

export default function UpdateBrandForm({ brand, onUpdate, onClose }: UpdateBrandFormProps) {
  const [form, setForm] = useState<UpdateBrandPayload>({
    name: brand.name,
    description: brand.description ?? "",
    location: brand.location,
    websiteUrl: brand.websiteUrl ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedBrand = await brandService.updateBrand(brand.id, form);

      onUpdate({
        ...brand,
        name: updatedBrand.name,
        description: updatedBrand.description,
        location: updatedBrand.location,
        websiteUrl: updatedBrand.websiteUrl ?? form.websiteUrl,
        updatedAt: updatedBrand.updatedAt ?? new Date().toISOString(),
      });

      onClose?.();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to update brand profile");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update brand profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        name="name"
        type="text"
        placeholder="Brand Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border p-2 text-text-primary rounded-md"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 text-text-primary rounded-md"
      />

      <input
        name="location"
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full border p-2 text-text-primary rounded-md"
      />

      <input
        name="websiteUrl"
        type="text"
        placeholder="Website URL"
        value={form.websiteUrl}
        onChange={handleChange}
        className="w-full border text-text-primary p-2 rounded-md"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500 transition"
      >
        {loading ? "Updating..." : "Update Brand"}
      </button>
    </form>
  );
}
