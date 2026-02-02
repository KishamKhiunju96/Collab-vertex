"use client";

import { useState } from "react";
import { ArrowLeft, Globe, Pencil } from "lucide-react";
import {
  Brand,
  UpdateBrandPayload,
  brandService,
} from "@/api/services/brandService";
import UpdateBrandModal from "./UpdateBrandModal";
import { notify } from "@/utils/notify";

interface Props {
  brand: Brand;
  onBack: () => void;
  onBrandUpdated: () => void;
}

export default function BrandInfoCard({
  brand,
  onBack,
  onBrandUpdated,
}: Props) {
  const [showUpdate, setShowUpdate] = useState(false);

  // Optimistic brand state
  const [optimisticBrand, setOptimisticBrand] =
    useState<Brand>(brand);

  const handleUpdateBrand = async (
    payload: UpdateBrandPayload
  ) => {
    const previousBrand = optimisticBrand;

    // 🚀 Optimistic update
    setOptimisticBrand((prev) => ({
      ...prev,
      ...payload,
    }));

    try {
      await brandService.updateBrand(brand.id, payload);

      notify.success("Brand updated successfully");
      onBrandUpdated(); // re-fetch fresh data
    } catch (error) {
      console.error(error);

      // ❌ Rollback on failure
      setOptimisticBrand(previousBrand);
      notify.error("Failed to update brand");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <h1 className="text-3xl font-bold">
            {optimisticBrand.name}
          </h1>
        </div>

        {/* Update Brand Button */}
        <button
          onClick={() => setShowUpdate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded border hover:bg-gray-50"
        >
          <Pencil className="h-4 w-4" />
          Update Brand
        </button>
      </div>

      {/* Brand Info */}
      <div className="bg-white rounded-lg shadow border p-6 space-y-4">
        {optimisticBrand.description && (
          <p className="text-gray-700">
            {optimisticBrand.description}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">
              {optimisticBrand.location || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Website</p>
            {optimisticBrand.websiteUrl ? (
              <a
                href={optimisticBrand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                {optimisticBrand.websiteUrl}
              </a>
            ) : (
              <p>—</p>
            )}
          </div>
        </div>
      </div>

      {/* Update Brand Modal */}
      {showUpdate && (
        <UpdateBrandModal
          open={showUpdate}
          initial={{
            name: optimisticBrand.name,
            description: optimisticBrand.description ?? "",
            location: optimisticBrand.location ?? "",
            websiteUrl: optimisticBrand.websiteUrl ?? "",
          }}
          onClose={() => setShowUpdate(false)}
          onUpdate={async (payload) => {
            await handleUpdateBrand(payload);
            setShowUpdate(false);
          }}
        />
      )}
    </>
  );
}
