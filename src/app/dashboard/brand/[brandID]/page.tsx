"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import BrandDetail from "@/components/brand/BrandDetail";
import CreateEventModal from "@/components/event/CreateEventModal";

import type { Event } from "@/api/types/event";
import { Brand } from "@/types/brand";
import EventTable from "@/components/brand/EventTable";

interface BrandPageProps {
  params: {
    brandId?: string;
  };
}

export default function BrandPage({ params }: BrandPageProps) {
  const brandId = params?.brandId;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  /* =======================
     Normalizers
  ======================= */
  const normalizeBrand = (raw: any): Brand => ({
    id: String(raw?.id ?? ""),
    name: raw?.name ?? "",
    description: raw?.description ?? undefined,
    location: raw?.location ?? "",
    websiteUrl: raw?.website_url ?? undefined,
    createdAt: raw?.created_at ?? "",
    updatedAt: raw?.updated_at ?? "",
  });

  const normalizeEvent = (raw: any): Event => ({
    id: String(raw?.id ?? ""),
    brandId: String(raw?.brand_id ?? raw?.brand?.id ?? ""),
    title: raw?.title ?? raw?.name ?? "",
    description: raw?.description ?? "",
    objectives: raw?.objectives ?? undefined,
    budget: raw?.budget ?? undefined,
    startDate: raw?.start_date ?? raw?.date ?? "",
    endDate: raw?.end_date ?? undefined,
    deliverables: raw?.deliverables ?? undefined,
    targetAudience: raw?.target_audience ?? undefined,
    category: raw?.category ?? undefined,
    location: raw?.location ?? undefined,
    status: raw?.status ?? "active",
    createdAt: raw?.created_at ?? undefined,
    updatedAt: raw?.updated_at ?? undefined,
  });

  /* =======================
     Fetch Brand & Events
  ======================= */
  const fetchBrandPageData = useCallback(async () => {
    if (!brandId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch brand
      const brandRes = await axios.get(`/get/brand/brandbyid/${brandId}`);
      const brandData = normalizeBrand(brandRes.data);
      setBrand(brandData);

      // Fetch events for this brand
      const eventsRes = await axios.get(
        `/forpost/event/eventsusinghybrid?brand_id=${brandData.id}`,
      );
      const eventsData = Array.isArray(eventsRes.data)
        ? eventsRes.data.map(normalizeEvent)
        : [];
      setEvents(eventsData);
    } catch (err: unknown) {
      console.error("Failed to load brand page:", err);
      setBrand(null);
      setEvents([]);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load brand data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrandPageData();
  }, [fetchBrandPageData]);

  /* =======================
     Event Handlers
  ======================= */
  const handleEventCreated = (newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
    setEventModalOpen(false);
  };

  const handleUpdateBrand = async (payload: Partial<Brand>) => {
    if (!brand) return;

    try {
      setLoading(true);
      const res = await axios.put(
        `/update/brand/${brand.id}`,
        {
          name: payload.name,
          description: payload.description,
          location: payload.location,
          website_url: payload.websiteUrl,
        },
      );
      setBrand(normalizeBrand(res.data));
      alert("Brand profile updated successfully.");
    } catch (err: unknown) {
      console.error("Brand update failed:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update brand profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Render States
  ======================= */
  if (!brandId) {
    return (
      <div className="p-8 text-red-600">
        Error: Brand ID is missing from the route.
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-text-primary">Loading brand details…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!brand) {
    return <div className="p-6 text-text-primary">Brand not found.</div>;
  }

  /* =======================
     Page Layout
  ======================= */
  return (
    <div className="p-4 space-y-6">
      <BrandDetail
        brand={brand}
        onCreateEvent={() => setEventModalOpen(true)}
        onUpdateBrand={handleUpdateBrand}
      />

      <EventTable events={events} />

      <CreateEventModal
        open={eventModalOpen}
        brandId={brand.id}
        onClose={() => setEventModalOpen(false)}
        onCreate={handleEventCreated}
      />
    </div>
  );
}
