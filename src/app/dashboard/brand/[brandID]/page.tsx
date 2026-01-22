"use client";

import { useState, useEffect } from "react";
import BrandDetail from "./BrandDetail";
import EventTable from "./EventTable";
import CreateEventModal from "./CreateEventModal";
import { getBrandById, Brand } from "@/api/services/brandService";
import { getEventsByBrand } from "@/api/services/eventService";
import { Event } from "@/api/types/event";

export default function BrandPage({ params }: { params: { brandId: string } }) {
  const { brandId } = params;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const brandData = await getBrandById(brandId);
        const eventsData = await getEventsByBrand(brandId);
        setBrand(brandData);
        setEvents(eventsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brandId]);

  const handleEventCreated = (newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
    setModalOpen(false);
  };

  const handleUpdateBrand = () => {
    // TODO: Implement brand update functionality
    console.log("Update brand clicked");
  };

  if (loading) return <div>Loading...</div>;
  if (!brand) return <div>Brand not found!</div>;

  return (
    <div className="p-4 space-y-6">
      <BrandDetail
        brand={brand}
        onCreateEvent={() => setModalOpen(true)}
        onUpdateBrand={handleUpdateBrand}
      />
      <EventTable events={events} />
      <CreateEventModal
        open={modalOpen}
        brandId={brandId}
        onClose={() => setModalOpen(false)}
        onCreate={handleEventCreated}
      />
    </div>
  );
}
