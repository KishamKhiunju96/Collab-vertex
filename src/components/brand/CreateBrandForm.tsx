"use client";
import React, { useState } from "react";
import { brandService, CreateBrandPayload } from "@/api/services/brandService";

export default function CreateBrandForm() {
  const [form, setForm] = useState<CreateBrandPayload>({
    name: "",
    description: "",
    location: "",
    websiteUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ Use createBrand via the brandService object
      const newBrand = await brandService.createBrand(form);
      console.log("Brand created:", newBrand);
      setForm({ name: "", description: "", location: "", websiteUrl: "" });
    } catch (err) {
      console.error("Failed to create brand:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded">
      <input
        placeholder="Brand Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        placeholder="Website URL"
        value={form.websiteUrl}
        onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Create Brand
      </button>
    </form>
  );
}
