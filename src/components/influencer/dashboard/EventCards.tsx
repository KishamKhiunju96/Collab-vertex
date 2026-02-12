"use client";

import { useEffect, useState } from "react";
import {
  eventService,
  Event,
  EventHybridFilterPayload,
} from "@/api/services/eventService";
import { useUserData } from "@/api/hooks/useUserData";
import { useInfluencerProfile } from "@/api/hooks/useInfluencerProfile";
import { notify } from "@/utils/notify";

const EVENT_LIMIT = 6;

export default function EventCards() {
  const { user } = useUserData();
  const { profile, loading: profileLoading } = useInfluencerProfile();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [applyingEventId, setApplyingEventId] = useState<string | null>(null);

  // 🔍 Filter UI state
  const [openFilter, setOpenFilter] = useState(false);

  // Only one active filter at a time
  const [activeFilter, setActiveFilter] = useState<{
    type: string;
    value: string;
  }>({
    type: "",
    value: "",
  });

  // Fetch all events initially
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Update the active filter
  const handleFilterChange = (type: string, value: string) => {
    setActiveFilter({ type, value }); // keep only the selected filter
  };

  // Apply filters
  const applyFilters = async () => {
    if (!activeFilter.type || !activeFilter.value) return;

    setLoading(true);
    try {
      // Build payload dynamically, only include active filter
      const payload: Partial<EventHybridFilterPayload> = {};

      switch (activeFilter.type) {
        case "location":
          payload.location = activeFilter.value;
          break;
        case "category":
          payload.categories = [activeFilter.value]; // array with value
          break;
        case "target_audience":
          payload.target_audience = activeFilter.value;
          break;
        case "start_date":
          payload.start_date = activeFilter.value;
          break;
        case "budget_range":
          payload.budget_range = [Number(activeFilter.value)]; // if filtering by budget
          break;
      }

      // Cast payload to EventHybridFilterPayload
      const data = await eventService.getEventsUsingHybrid(
        payload as EventHybridFilterPayload,
      );
      setEvents(data);
      setShowAll(false);
      setOpenFilter(false);
    } catch (err) {
      console.error("Failed to apply filters", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear filter
  const clearFilter = () => setActiveFilter({ type: "", value: "" });

  // Apply to event handler
  const handleApplyToEvent = async (eventId: string) => {
    // Debug logging to identify the issue
    console.log("=== Apply Event Debug ===");
    console.log("User:", user);
    console.log("Profile:", profile);
    console.log("Profile Loading:", profileLoading);
    console.log("Event ID:", eventId);
    console.log("========================");

    // Wait for profile to finish loading
    if (profileLoading) {
      notify.info("Loading your profile, please wait...");
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.error("Validation failed: User not found");
      notify.error("Please log in to apply to events");
      return;
    }

    // Check if influencer profile exists
    if (!profile || !profile.id) {
      console.error("Validation failed: Profile not found or missing ID");
      notify.error("Please complete your influencer profile first");
      return;
    }

    console.log(
      "Validation passed! Applying to event with influencer_id:",
      profile.id,
    );
    setApplyingEventId(eventId);

    try {
      const response = await eventService.applyEvent({
        event_id: eventId,
        influencer_id: profile.id,
      });

      notify.success(response.message || "Successfully applied to event!");
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Failed to apply to event";
      notify.error(errorMessage);
      console.error("Apply to event error:", err);
    } finally {
      setApplyingEventId(null);
    }
  };

  if (loading) return <p className="text-center py-10">Loading events...</p>;
  if (events.length === 0)
    return <p className="text-center py-10">No events available.</p>;

  const visibleEvents = showAll ? events : events.slice(0, EVENT_LIMIT);
  console.log("visible Events", visibleEvents);
  const showLoadMore = events.length > EVENT_LIMIT && !showAll;

  return (
    <div className="space-y-6 text-text-primary">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl mt-14 font-semibold">All Available Events</h2>

        {/* FILTER BUTTON */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter((p) => !p)}
            className="rounded-lg border px-4 py-2 text-sm mt-14 font-medium hover:bg-gray-100 transition"
          >
            Filter
          </button>

          {openFilter && (
            <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border bg-white p-4 shadow-lg">
              <div className="space-y-3">
                <input
                  placeholder="Location"
                  value={
                    activeFilter.type === "location" ? activeFilter.value : ""
                  }
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  placeholder="Category"
                  value={
                    activeFilter.type === "category" ? activeFilter.value : ""
                  }
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  placeholder="Target audience"
                  value={
                    activeFilter.type === "target_audience"
                      ? activeFilter.value
                      : ""
                  }
                  onChange={(e) =>
                    handleFilterChange("target_audience", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  type="date"
                  value={
                    activeFilter.type === "start_date" ? activeFilter.value : ""
                  }
                  onChange={(e) =>
                    handleFilterChange("start_date", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                <div className="flex justify-between gap-2 pt-2">
                  <button
                    onClick={clearFilter}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Clear
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpenFilter(false)}
                      className="text-sm text-gray-500 hover:text-black"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyFilters}
                      className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EVENT GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {event.brand_name ?? "Brand"}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  event.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {event.status}
              </span>
            </div>

            {/* BODY */}
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {event.description}
            </p>

            <div className="text-sm space-y-1 mb-4">
              <p>
                <span className="font-medium">Category:</span> {event.category}
              </p>
              <p>
                <span className="font-medium">Location:</span> {event.location}
              </p>
              <p>
                <span className="font-medium">Budget:</span> ₹{event.budget}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {new Date(event.start_date).toLocaleDateString()} –{" "}
                {new Date(event.end_date).toLocaleDateString()}
              </p>
            </div>

            {/* ACTION */}
            <button
              className="w-full rounded-lg bg-black text-white py-2 text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleApplyToEvent(event.id)}
              disabled={applyingEventId === event.id || profileLoading}
            >
              {profileLoading
                ? "Loading..."
                : applyingEventId === event.id
                  ? "Applying..."
                  : "Apply to Event"}
            </button>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {showLoadMore && (
        <div className="flex justify-center">
          <span
            onClick={() => setShowAll(true)}
            className="cursor-pointer text-sm font-medium text-gray-600 hover:text-black underline underline-offset-4 transition"
          >
            Load more
          </span>
        </div>
      )}
    </div>
  );
}
