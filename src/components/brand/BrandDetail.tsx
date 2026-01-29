"use client";

import { useState } from "react";
import { Brand, UpdateBrandPayload } from "@/api/services/brandService";
import UpdateBrandModal from "./UpdateBrandModal";

interface BrandDetailProps {
  brand: Brand;
  onCreateEvent: () => void;
  onUpdateBrand: (payload: UpdateBrandPayload) => void;
}

export default function BrandDetail({
  brand,
  onCreateEvent,
  onUpdateBrand,
}: BrandDetailProps) {
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 border rounded shadow-sm bg-white">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{brand.name}</h1>

        {brand.description && (
          <p className="text-gray-700">{brand.description}</p>
        )}

        {brand.location && (
          <p className="text-gray-600">Location: {brand.location}</p>
        )}

        {brand.websiteUrl && (
          <a
            href={brand.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Visit Website
          </a>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onCreateEvent}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Create Event
        </button>

        <button
          onClick={() => setShowUpdate(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Update Brand
        </button>
      </div>

      <UpdateBrandModal
        open={showUpdate}
        onClose={() => setShowUpdate(false)}
        onUpdate={onUpdateBrand}
        initial={{
          name: brand.name,
          description: brand.description,
          location: brand.location,
          websiteUrl: brand.websiteUrl, // Fixed camelCase
        }}
      />
    </div>
  );
}
