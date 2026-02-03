"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  brandService,
  Brand,
  UpdateBrandPayload,
} from "@/api/services/brandService";

import { notify } from "@/utils/notify";

import UpdateBrandModal from "./UpdateBrandModal";
import Modal from "@/components/ui/Modal";
import CreateEventStepper from "../event/CreateEventStepper";
import EventTable from "./EventTable";

interface BrandDetailPageProps {
  brandId: string;
  
}

export default function BrandDetailPage({ brandId }: BrandDetailPageProps) {
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showUpdateBrand, setShowUpdateBrand] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [eventRefreshKey, setEventRefreshKey] = useState(0);

  const fetchBrand = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await brandService.getBrandById(brandId);
      setBrand(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load brand details");
      notify.error("Failed to load brand details.");
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading brand details...</div>;
  }

  if (error || !brand) {
    return <div className="p-6 text-red-600">{error || "Brand not found"}</div>;
  }

  const handleUpdateBrand = async (payload: UpdateBrandPayload) => {
    if (!brand) return;

    const updatePayload: UpdateBrandPayload = {
      name: payload.name || brand.name,
      description: payload.description ?? brand.description ?? "",
      location: payload.location || brand.location,
      websiteUrl: payload.websiteUrl ?? brand.websiteUrl ?? "",
    };

    try {
      const updatedBrand = await brandService.updateBrand(
        brand.id,
        updatePayload
      );
      setBrand(updatedBrand);
      notify.success("Brand updated successfully!");
      setShowUpdateBrand(false);
    } catch (err) {
      console.error(err);
      notify.error("Failed to update brand");
    }
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-text-primary">{brand.name}</h1>
          </div>

          <button
            onClick={() => setShowUpdateBrand(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
          >
            Update Brand
          </button>
        </div>

        <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
          <div>
            <h2 className="font-semibold text-gray-700">Description</h2>
            <p className="text-gray-600">
              {brand.description || "No description provided"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Location</h2>
            <p className="text-gray-600">{brand.location}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Website</h2>
            {brand.websiteUrl ? (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {brand.websiteUrl}
              </a>
            ) : (
              <p className="text-gray-500">No website provided</p>
            )}
          </div>

          <div className="flex gap-8 text-sm text-gray-600">
            <p>
              <span className="font-medium">Created:</span>{" "}
              {new Date(brand.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Updated:</span>{" "}
              {new Date(brand.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Events</h2>

          <EventTable
            brandId={brandId}
            refreshKey={eventRefreshKey}
          />
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowCreateEvent(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500 transition"
        >
          Create Event
        </button>
      </div>

      {brand && (
        <UpdateBrandModal
          initial={{
            name: brand.name,
            description: brand.description ?? "",
            location: brand.location,
            websiteUrl: brand.websiteUrl ?? "",
          }}
          open={showUpdateBrand}
          onClose={() => setShowUpdateBrand(false)}
          onUpdate={handleUpdateBrand}
        />
      )}

      <Modal
        open={showCreateEvent}
        title="Create Event"
        onClose={() => setShowCreateEvent(false)}
      >
        <CreateEventStepper
          brandId={brandId}
          onCancel={() => setShowCreateEvent(false)}
          onSubmit={() => {
            setShowCreateEvent(false);
            setEventRefreshKey((k) => k + 1); // 🔥 refresh table
          }}
        />
      </Modal>
    </>
  );
}
