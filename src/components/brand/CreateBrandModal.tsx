"use client";
import { useState } from "react";
import { createBrand } from "@/api/services/brandService";

export default function CreateBrandModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    websiteUrl: "",
  });

  const handleSubmit = async () => {
    try {
      await createBrand(form);
      onCreated();
    } catch (err) {
      console.error("Failed to create brand:", err);
    } finally {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-[420px] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
          aria-label="Close modal"
        >
          ×
        </button>

        <h3 className="text-xl font-semibold text-gray-900 mb-6 pr-8">
          Create Brand
        </h3>

        <input
          type="text"
          placeholder="Brand Name *"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className="w-full px-4 py-2.5 mt-4 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full px-4 py-2.5 mt-4 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          className="w-full px-4 py-2.5 mt-4 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          placeholder="Website URL[](https://...)"
          value={form.websiteUrl}
          onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
        />

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()} // basic required field check
            className="px-6 py-2.5 bg-red-700 text-white rounded-md hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
