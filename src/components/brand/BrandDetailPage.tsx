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

  /* Loading State */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium">
            Loading brand details...
          </p>
        </div>
      </div>
    );
  }

  /* Error State */
  if (error || !brand) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center max-w-sm w-full px-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Brand Not Found
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {error || "The brand you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* Main Content */
  return (
    <>
      <div className="flex flex-col h-screen bg-white">
        {/* Top Section - Brand Info */}
        <div className="flex-shrink-0 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-5">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-4 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            {/* Brand Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-gray-200 overflow-hidden">
              {/* Colored Background */}
              <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-700 sm:h-32"></div>

              {/* Content */}
              <div className="px-4 py-5 sm:px-5 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-14 sm:-mt-20">
                  {/* Brand Info */}
                  <div className="flex items-end gap-4">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-10 h-10 sm:w-14 sm:h-14 text-blue-600" />
                    </div>
                    <div className="pb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {brand.name}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Joined{" "}
                        {new Date(brand.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Update Button */}
                  <button
                    onClick={() => setShowUpdateBrand(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Update Brand
                  </button>
                </div>

                {/* Brand Details Grid */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* Description - Full Width */}
                  <div className="lg:col-span-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Description
                      </p>
                      <p className="text-sm text-gray-900 leading-relaxed line-clamp-2">
                        {brand.description || (
                          <span className="text-gray-400 italic">
                            No description provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Location
                      </p>
                    </div>
                    <p className="text-sm text-gray-900 truncate">
                      {brand.location}
                    </p>
                  </div>

                  {/* Website */}
                  {brand.websiteUrl && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Website
                        </p>
                      </div>
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {brand.websiteUrl}
                      </a>
                    </div>
                  )}

                  {/* Status Badge */}
                  {!brand.websiteUrl && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Status
                      </p>
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Events (Scrollable) */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-5">
            <div className="bg-white border border-gray-200 rounded-xl flex flex-col">
              <div className="px-4 py-4 sm:px-5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <h2 className="text-base font-semibold text-gray-900">Events</h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Manage and track your brand events
                </p>
              </div>

              <div className="px-4 py-4 sm:px-5 flex-1">
                <EventTable
                  brandId={brandId}
                  refreshKey={eventRefreshKey}
                  onEventClick={handleEventClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB - Create Event Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowCreateEvent(true)}
          className="flex items-center gap-2.5 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-medium text-sm group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Create Event</span>
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