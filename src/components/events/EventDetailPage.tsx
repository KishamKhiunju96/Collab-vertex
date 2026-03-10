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
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { eventService, Event } from "@/api/services/eventService";
import { notify } from "@/utils/notify";
import ApplicationsList from "@/components/applications/ApplicationsList";
import { useUserData } from "@/api/hooks/useUserData";

interface EventDetailPageProps {
  eventId: string;
}

export default function EventDetailPage({ eventId }: EventDetailPageProps) {
  const router = useRouter();
  const { user } = useUserData();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          className: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
          icon: CheckCircle2,
          dotColor: "bg-emerald-500",
        };
      case "inactive":
        return {
          className: "bg-gray-50 text-gray-600 border-gray-200 ring-gray-500/20",
          icon: XCircle,
          dotColor: "bg-gray-400",
        };
      case "pending":
        return {
          className: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20",
          icon: Clock,
          dotColor: "bg-amber-500",
        };
      default:
        return {
          className: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20",
          icon: AlertCircle,
          dotColor: "bg-blue-500",
        };
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await eventService.deleteEvent(event.id);
      notify.success("Event deleted successfully");
      router.push("/dashboard/events");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-red-500 animate-spin absolute top-0 left-0" />
          </div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
            <Calendar className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {error || "The event you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-red-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Events</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 space-y-4">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {event.title}
              </h1>

              {/* Status & Meta */}
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ring-1 ${statusConfig.className}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}></span>
                  {event.status}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Created {formatDate(event.created_at)}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-semibold">
                    ${event.budget.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Tag className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">{event.category || "Uncategorized"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {user?.role === "brand" && (
              <div className="flex gap-3 lg:flex-col xl:flex-row">
                <button
                  onClick={() => router.push(`/dashboard/events/${event.id}/edit`)}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 border border-white/20 transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Event</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500/90 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Description</h2>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.description || "No description provided"}
              </p>
            </div>

            {/* Objectives Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Objectives</h2>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.objectives || "No objectives specified"}
              </p>
            </div>

            {/* Deliverables Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Deliverables</h2>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.deliverables || "No deliverables specified"}
              </p>
            </div>

            {/* Applications Card - Brand Only */}
            {user?.role === "brand" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Influencer Applications
                    </h2>
                    <p className="text-sm text-gray-500">
                      Review and manage applications
                    </p>
                  </div>
                </div>
                <ApplicationsList eventId={eventId} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Event Details
              </h2>

              <div className="space-y-5">
                {/* Category */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Tag className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Category
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {event.category || "Uncategorized"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Budget
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${event.budget.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Target Audience
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {event.target_audience || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-cyan-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-purple-400"></div>

                <div className="space-y-6">
                  {/* Start Date */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg shadow-green-200">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                        Start Date
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(event.start_date)}
                      </p>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg shadow-purple-200">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
                        End Date
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(event.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Total Duration
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.ceil(
                      (new Date(event.end_date).getTime() -
                        new Date(event.start_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    <span className="text-base font-medium text-gray-500">days</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Metadata
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Event ID</p>
                  <p className="text-xs font-mono text-gray-600 bg-white rounded-lg px-3 py-2 break-all border border-gray-200">
                    {event.id}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Created</p>
                    <p className="text-xs font-medium text-gray-600">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Updated</p>
                    <p className="text-xs font-medium text-gray-600">
                      {new Date(event.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}