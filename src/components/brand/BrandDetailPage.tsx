"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Calendar,
  Plus,
  Edit3,
  Loader2,
} from "lucide-react";

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

  const handleUpdateBrand = async (payload: UpdateBrandPayload) => {
    if (!brand) return;

    try {
      const updatedBrand = await brandService.updateBrand(brand.id, {
        name: payload.name || brand.name,
        description: payload.description ?? brand.description ?? "",
        location: payload.location || brand.location,
        websiteUrl: payload.websiteUrl ?? brand.websiteUrl ?? "",
      });

      setBrand(updatedBrand);
      notify.success("Brand updated successfully!");
      setShowUpdateBrand(false);
    } catch (err) {
      console.error(err);
      notify.error("Failed to update brand");
    }
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  /* =========================
     Loading State
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading brand details...</p>
        </div>
      </div>
    );
  }

  /* =========================
     Error State
  ========================== */
  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Brand Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The brand you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     Main Content
  ========================== */
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            {/* Brand Header Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32 sm:h-40"></div>
              <div className="px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16">
                  {/* Brand Icon */}
                  <div className="flex items-end gap-4 sm:gap-6 mb-4 sm:mb-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                      <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
                    </div>
                    <div className="pb-2">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                        {brand.name}
                      </h1>
                      <p className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Joined{" "}
                        {new Date(brand.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Update Button */}
                  <button
                    onClick={() => setShowUpdateBrand(true)}
                    className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md w-full sm:w-auto"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Update Brand</span>
                  </button>
                </div>

                {/* Brand Info Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Description */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Description
                        </p>
                        <p className="text-base text-gray-900 break-words">
                          {brand.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Location
                      </p>
                      <p className="text-base text-gray-900 truncate">
                        {brand.location}
                      </p>
                    </div>
                  </div>

                  {/* Website */}
                  {brand.websiteUrl && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Globe className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Website
                        </p>
                        <a
                          href={brand.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-blue-600 hover:underline truncate block"
                        >
                          {brand.websiteUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Events
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track all your brand events
              </p>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <EventTable
                brandId={brandId}
                refreshKey={eventRefreshKey}
                onEventClick={handleEventClick}
              />
            </div>
          </div>

          {/* Mobile Bottom Spacing */}
          <div className="h-24 sm:h-0"></div>
        </div>
      </div>

      {/* Floating Create Event Button */}
      <div className="fixed bottom-6 right-4 sm:right-6 lg:right-8 z-40">
        <button
          onClick={() => setShowCreateEvent(true)}
          className="group flex items-center gap-3 bg-blue-600 text-white pl-4 pr-5 sm:px-6 py-3 sm:py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold text-sm sm:text-base hidden xs:inline">
            Create Event
          </span>
        </button>
      </div>

      {/* Modals */}
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
            setEventRefreshKey((k) => k + 1);
          }}
        />
      </Modal>
    </>
  );
}
