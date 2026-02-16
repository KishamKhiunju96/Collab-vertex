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
import {
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Users,
  X,
  Loader2,
  ExternalLink,
  TrendingUp,
  Sparkles,
} from "lucide-react";

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
    <div className="space-y-6 sm:space-y-8">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-brand-primary" />
            Available Events
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Discover and apply to exciting collaboration opportunities
          </p>
        </div>

        {/* FILTER BUTTON */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter((p) => !p)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 ${
              activeFilter.type
                ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg"
                : "bg-white border-2 border-border-subtle text-text-primary hover:border-brand-primary hover:shadow-md"
            }`}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">
              {activeFilter.type ? "Filtered" : "Filter Events"}
            </span>
            {activeFilter.type && (
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            )}
          </button>

          {/* FILTER DROPDOWN */}
          {openFilter && (
            <div className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl border-2 border-border-subtle bg-white shadow-2xl animate-scale-in overflow-hidden">
              {/* Filter Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-background-hero to-white border-b border-border-subtle">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-text-primary flex items-center gap-2">
                    <Filter className="w-5 h-5 text-brand-primary" />
                    Filter Events
                  </h3>
                  <button
                    onClick={() => setOpenFilter(false)}
                    className="p-1 rounded-lg hover:bg-background-hoverFade transition-colors"
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
                {activeFilter.type && (
                  <p className="text-xs text-brand-primary mt-1">
                    Active filter: {activeFilter.type.replace("_", " ")}
                  </p>
                )}
              </div>

              {/* Filter Inputs */}
              <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                {/* Location */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                    Location
                  </label>
                  <input
                    placeholder="e.g., Mumbai, Delhi"
                    value={
                      activeFilter.type === "location" ? activeFilter.value : ""
                    }
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    className="w-full rounded-xl border-2 border-border-subtle px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Tag className="w-4 h-4 text-brand-accent" />
                    Category
                  </label>
                  <input
                    placeholder="e.g., Fashion, Tech"
                    value={
                      activeFilter.type === "category" ? activeFilter.value : ""
                    }
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full rounded-xl border-2 border-border-subtle px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Users className="w-4 h-4 text-brand-secondary" />
                    Target Audience
                  </label>
                  <input
                    placeholder="e.g., Gen Z, Millennials"
                    value={
                      activeFilter.type === "target_audience"
                        ? activeFilter.value
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterChange("target_audience", e.target.value)
                    }
                    className="w-full rounded-xl border-2 border-border-subtle px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      activeFilter.type === "start_date"
                        ? activeFilter.value
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterChange("start_date", e.target.value)
                    }
                    className="w-full rounded-xl border-2 border-border-subtle px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="px-5 py-4 bg-background-hero border-t border-border-subtle flex items-center justify-between gap-3">
                <button
                  onClick={clearFilter}
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  Clear Filter
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpenFilter(false)}
                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-background-hoverFade"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    Apply
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Badge */}
      {activeFilter.type && (
        <div className="flex items-center gap-2 animate-fade-in">
          <span className="text-sm text-text-muted">Active filter:</span>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-full">
            <span className="text-sm font-semibold text-brand-primary capitalize">
              {activeFilter.type.replace("_", " ")}: {activeFilter.value}
            </span>
            <button
              onClick={clearFilter}
              className="p-0.5 rounded-full hover:bg-brand-primary/20 transition-colors"
            >
              <X className="w-3 h-3 text-brand-primary" />
            </button>
          </div>
        </div>
      )}

      {/* EVENT GRID */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {visibleEvents.map((event, index) => (
          <div
            key={event.id}
            className="group bg-white rounded-2xl border-2 border-border-subtle hover:border-brand-primary shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Card Header */}
            <div className="relative bg-gradient-to-br from-brand-primary/5 via-brand-accent/5 to-brand-secondary/5 p-5 border-b border-border-subtle">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {event.brand_name ?? "Brand Partner"}
                  </p>
                </div>

                <span
                  className={`flex-shrink-0 px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                    event.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {event.status?.toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                {event.description}
              </p>

              {/* Category Tag */}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-accent" />
                <span className="text-xs font-semibold text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3">
              {/* Event Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span className="text-text-secondary font-medium">
                    {event.location}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-text-secondary font-medium">
                    ₹{event.budget?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-brand-accent flex-shrink-0" />
                  <span className="text-text-secondary font-medium text-xs">
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(event.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => handleApplyToEvent(event.id)}
                disabled={applyingEventId === event.id || profileLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-accent hover:to-brand-primary text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group/btn"
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : applyingEventId === event.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <span>Apply Now</span>
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-brand-primary" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            No events found
          </h3>
          <p className="text-text-muted">
            Try adjusting your filters or check back later for new opportunities
          </p>
        </div>
      )}

      {/* LOAD MORE */}
      {showLoadMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAll(true)}
            className="group px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-semibold hover:bg-brand-primary hover:text-white transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Load More Events</span>
            <TrendingUp className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
