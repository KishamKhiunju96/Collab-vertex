"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Calendar, Plus } from "lucide-react";
import { Event } from "@/api/services/eventService";
import { notify } from "@/utils/notify";
import EventCard from "./EventCard";
import EventSkeleton from "./EventSkeleton";
import EmptyState from "./EmptyState";
import { useRouter } from "next/navigation";

export default function EventListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all events from the API
      const response = await fetch("https://api.dixam.me/event/allevents", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
      notify.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Apply filters whenever search query or filters change
  useEffect(() => {
    let result = [...events];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (event) => event.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((event) => event.category === categoryFilter);
    }

    setFilteredEvents(result);
  }, [searchQuery, statusFilter, categoryFilter, events]);

  // Get unique categories for filter dropdown
  const categories = Array.from(
    new Set(events.map((event) => event.category).filter(Boolean)),
  );

  const handleCreateEvent = () => {
    // Redirect to brand page or show create modal
    router.push("/dashboard/brand");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Events
              </h1>
              <p className="text-gray-600 mt-2">
                Discover and manage collaboration events
              </p>
            </div>

            <button
              onClick={handleCreateEvent}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create Event</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by title, description, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Active Filters Summary */}
            {(searchQuery ||
              statusFilter !== "all" ||
              categoryFilter !== "all") && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    Search: &quot;{searchQuery}&quot;
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Status: {statusFilter}
                  </span>
                )}
                {categoryFilter !== "all" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Category: {categoryFilter}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="text-sm text-red-600 hover:text-red-700 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          filteredEvents.length === 0 &&
          events.length === 0 && (
            <EmptyState
              title="No events available"
              description="There are no events created yet. Be the first to create an event!"
              action={{
                label: "Create Event",
                onClick: handleCreateEvent,
              }}
            />
          )}

        {/* No Results from Filters */}
        {!loading &&
          !error &&
          filteredEvents.length === 0 &&
          events.length > 0 && (
            <EmptyState
              title="No events match your filters"
              description="Try adjusting your search or filter criteria to find events."
            />
          )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
