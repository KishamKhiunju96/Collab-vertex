"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Tag,
  Users,
  Target,
  FileText,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";

import { eventService, Event } from "@/api/services/eventService";
import { notify } from "@/utils/notify";
import ApplicationsList from "@/components/applications/ApplicationsList";

interface EventDetailPageProps {
  eventId: string;
}

export default function EventDetailPage({ eventId }: EventDetailPageProps) {
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch event by ID using the eventService
      const data = await eventService.getEventById(eventId);
      setEvent(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load event details");
      notify.error("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, fetchEvent]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${event.title}"?`,
    );
    if (!confirmed) return;

    try {
      await eventService.deleteEvent(event.id);
      notify.success("Event deleted successfully");
      router.push("/dashboard/events");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete event");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The event you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Events</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    event.status,
                  )}`}
                >
                  {event.status}
                </span>
                <span className="text-sm text-gray-500">
                  Created {formatDate(event.created_at)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  router.push(`/dashboard/events/${event.id}/edit`)
                }
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description || "No description provided"}
              </p>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-400" />
                Objectives
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.objectives || "No objectives specified"}
              </p>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                Deliverables
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.deliverables || "No deliverables specified"}
              </p>
            </div>

            {/* Influencer Applications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                Influencer Applications
              </h2>
              <ApplicationsList eventId={eventId} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Event Details
              </h2>

              {/* Category */}
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-base text-gray-900">
                    {event.category || "Uncategorized"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-base text-gray-900">{event.location}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${event.budget.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Target Audience
                  </p>
                  <p className="text-base text-gray-900">
                    {event.target_audience || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                Timeline
              </h2>

              {/* Start Date */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Start Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-base text-gray-900">
                    {formatDateTime(event.start_date)}
                  </p>
                </div>
              </div>

              {/* End Date */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  End Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-base text-gray-900">
                    {formatDateTime(event.end_date)}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Duration
                </p>
                <p className="text-base text-gray-900">
                  {Math.ceil(
                    (new Date(event.end_date).getTime() -
                      new Date(event.start_date).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Metadata
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Event ID</p>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    {event.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="text-gray-900">
                    {formatDateTime(event.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="text-gray-900">
                    {formatDateTime(event.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
