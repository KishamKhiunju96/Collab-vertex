"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

import { brandService, Brand, UpdateBrandPayload } from "@/api/services/brandService";
import { eventService, Event, EventPayload } from "@/api/services/eventService";

import { notify } from "@/utils/notify";

interface BrandDetailPageProps {
  brandId: string; 
}

export default function BrandDetailPage({ brandId }: BrandDetailPageProps) {
  const router = useRouter();

  console.log("Brand ID in client component:", brandId);

  const [brand, setBrand] = useState<Brand | null>(null);
  const [events] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showUpdateBrand, setShowUpdateBrand] = useState(false);

  const fetchBrand = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await brandService.getBrandById(brandId);
      setBrand(data);
    } catch (err) {
      console.error(err);
      notify.error("Failed to load brand details.");
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);


  if (loading) return <div className="p-6 text-gray-500">Loading brand details...</div>;
  if (error || !brand) return <div className="p-6 text-red-600">{error || "Brand not found"}</div>;

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between text-text-primary">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}><ArrowLeft /></button>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
          </div>

          <button
            onClick={() => setShowUpdateBrand(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Update Brand
          </button>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden text-text-primary ">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left ">Title</th>
                <th className="px-4 py-2 text-center">Category</th>
                <th className="px-4 py-2 text-center">Budget</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">No events created yet</td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-2">{event.title}</td>
                    <td className="px-4 py-2 text-center">{event.category}</td>
                    <td className="px-4 py-2 text-center">{event.budget}</td>
                    <td className="px-4 py-2 text-center">{event.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={() => setShowCreateEvent(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-full"
      >
        <Plus className="inline mr-2" />
        Create Event
      </button>
    </>
  );
}
