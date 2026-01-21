"use client";

import { useState } from "react";
import api from "@/api/axiosInstance";
import { AxiosError } from "axios";

// Reuse Brand interface
interface Brand {
  id: string;
  name: string;
  description: string;
  location?: string;
  websiteUrl?: string;
}

interface UpdateBrandFormProps {
  brand: Brand;
  onUpdate: (updatedBrand: Brand) => void; // <-- FIXED: unknown -> Brand
  onClose?: () => void;
}

export default function UpdateBrandForm({
  brand,
  onUpdate,
  onClose,
}: UpdateBrandFormProps) {
  const [name, setName] = useState(brand.name);
  const [description, setDescription] = useState(brand.description);
  const [location, setLocation] = useState(brand.location || "");
  const [websiteUrl, setWebsiteUrl] = useState(brand.websiteUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.put("/brand/update_brandprofile", {
        id: brand.id,
        name,
        description,
        location,
        websiteUrl,
      });

      onUpdate(res.data); // Type-safe now
      if (onClose) onClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || "Failed to update brand profile",
        );
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
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Brand Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded-md"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded-md"
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <input
        type="text"
        placeholder="Website URL"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Updating..." : "Update Brand"}
      </button>
    </form>
  );
}
