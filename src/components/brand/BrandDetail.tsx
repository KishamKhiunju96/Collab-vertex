"use client";

import { useState } from "react";
import type { Brand, UpdateBrandPayload } from "@/api/services/brandService";
import UpdateBrandModal from "./UpdateBrandModal";

interface BrandDetailProps {
  brand: Brand; // Fully loaded brand
  onCreateEvent: () => void;
  onUpdateBrand: (payload: UpdateBrandPayload) => void;
  updating?: boolean; // Optional loading state
  totalEvents?: number; // optional metric
  totalCollaborations?: number; // optional metric
}

export default function BrandDetail({
  brand,
  onCreateEvent,
  onUpdateBrand,
  updating = false,
  totalEvents = 0,
  totalCollaborations = 0,
}: BrandDetailProps) {
  const [showUpdate, setShowUpdate] = useState(false);

  if (!brand) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">

      <div className="flex-1 space-y-3 max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>

        {brand.description && (
          <p className="text-gray-700">{brand.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
          {brand.location && <span>📍 {brand.location}</span>}
          {brand.websiteUrl && (
            <a
              href={brand.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              🔗 Visit Website
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            🗓️ Events: {totalEvents}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            🤝 Collaborations: {totalCollaborations}
          </span>
        </div>

        {/* ---------------- Dates ---------------- */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
          <span>Created: {new Date(brand.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(brand.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* ---------------- Action Buttons ---------------- */}
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <button
          onClick={onCreateEvent}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Event
        </button>

        <button
          onClick={() => setShowUpdate(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Brand"}
        </button>
      </div>

      {showUpdate && (
        <UpdateBrandModal
          open={showUpdate}
          onClose={() => setShowUpdate(false)}
          onUpdate={(payload: UpdateBrandPayload) => {
            onUpdateBrand(payload);
            setShowUpdate(false);
          }}
          initial={{
            name: brand.name,
            description: brand.description ?? "",
            location: brand.location ?? "",
            websiteUrl: brand.websiteUrl ?? "",
          }}
        />
      )}
    </div>
  );
}
