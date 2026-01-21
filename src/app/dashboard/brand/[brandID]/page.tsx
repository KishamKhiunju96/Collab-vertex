"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/api/axiosInstance";
import UpdateBrandForm from "@/components/brand/UpdateBrandForm";
import CreateEventForm from "@/components/brand/CreateEventForm";
import EventTable from "@/components/brand/EventTable";

interface Brand {
  id: string;
  name: string;
  description: string;
  location?: string;
  websiteUrl?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function BrandDetailPage() {
  const params = useParams();
  const brandId = params.brandId as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);

  useEffect(() => {
    if (!brandId) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [brandRes, eventsRes] = await Promise.all([
          api.get<Brand>(`/brand/${brandId}`),
          api.get<Event[]>(`/event/byBrand/${brandId}`),
        ]);

        if (isMounted) {
          const normalizedEvents = eventsRes.data.map((e) => ({
            ...e,
            id: String(e.id),
          }));

          setBrand(brandRes.data);
          setEvents(normalizedEvents);
        }
      } catch (err: unknown) {
        let message = "Failed to load brand details";

        if (err instanceof AxiosError) {
          message = err.response?.data?.message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        if (isMounted) setError(message);
        console.error("Brand fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [brandId]);

  if (loading) {
    return <div className="p-6 text-center">Loading brand details...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!brand) {
    return <div className="p-6 text-center">Brand not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
      <p className="text-gray-600 mb-6">
        {brand.description || "No description available"}
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowUpdateForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {showUpdateForm ? "Hide Update Form" : "Update Brand"}
        </button>

        <button
          onClick={() => setShowCreateEventForm((prev) => !prev)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {showCreateEventForm ? "Hide Create Form" : "Create Event"}
        </button>
      </div>

      {showUpdateForm && (
        <div className="mb-10 border-t pt-6">
          <UpdateBrandForm
            brand={brand}
            onUpdate={(updated: Brand) => setBrand(updated)}
            onClose={() => setShowUpdateForm(false)}
          />
        </div>
      )}

      {showCreateEventForm && (
        <div className="mb-10 border-t pt-6">
          <CreateEventForm
            brandId={brand.id}
            onCreate={(newEvent) =>
              setEvents((prev) => [
                { ...newEvent, id: String(newEvent.id) },
                ...prev,
              ])
            }
            onClose={() => setShowCreateEventForm(false)}
          />
        </div>
      )}

      <div className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Events</h2>
        <EventTable events={events} />
      </div>
    </div>
  );
}
