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
    if (eventId) fetchEvent();
  }, [eventId, fetchEvent]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        };
      case "inactive":
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          dot: "bg-gray-400",
          icon: XCircle,
        };
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
          icon: Clock,
        };
      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
          icon: AlertCircle,
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-400" />
          <p className="mt-3 text-sm text-gray-500">Loading event details…</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Calendar className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Event Not Found
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {error ||
              "The event you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusConfig(event.status);
  const durationDays = Math.ceil(
    (new Date(event.end_date).getTime() -
      new Date(event.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              {/* Title */}
              <h1 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                {event.title}
              </h1>

              {/* Status + meta row */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${status.bg} ${status.text} ${status.border}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                  />
                  {event.status}
                </span>

                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  Created {formatDate(event.created_at)}
                </span>
              </div>

              {/* Quick meta chips */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                  ${event.budget.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  {event.category || "Uncategorized"}
                </span>
              </div>
            </div>

            {/* Actions */}
            {user?.role === "brand" && (
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/events/${event.id}/edit`)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-5 lg:col-span-2">
            {/* Description */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">
                  Description
                </h2>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                {event.description || "No description provided"}
              </p>
            </section>

            {/* Objectives */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">
                  Objectives
                </h2>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                {event.objectives || "No objectives specified"}
              </p>
            </section>

            {/* Deliverables */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">
                  Deliverables
                </h2>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                {event.deliverables || "No deliverables specified"}
              </p>
            </section>

            {/* Applications */}
            {user?.role === "brand" && (
              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Influencer Applications
                    </h2>
                    <p className="text-xs text-gray-400">
                      Review and manage applications
                    </p>
                  </div>
                </div>
                <ApplicationsList eventId={eventId} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:col-span-1">
            {/* Details card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 border-b border-gray-100 pb-3 text-sm font-semibold text-gray-900">
                Event Details
              </h2>

              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <Tag className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-400">Category</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {event.category || "Uncategorized"}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-400">Location</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {event.location}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-400">Budget</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ${event.budget.toLocaleString()}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-400">Target Audience</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {event.target_audience || "Not specified"}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Timeline card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Timeline
                </h2>
              </div>

              <div className="relative pl-5">
                {/* Vertical line */}
                <div className="absolute bottom-1 left-[7px] top-1 w-px bg-gray-200" />

                <div className="space-y-5">
                  {/* Start */}
                  <div className="relative">
                    <div className="absolute -left-5 top-1 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-white" />
                    <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600">
                      Start Date
                    </p>
                    <p className="mt-0.5 text-sm text-gray-800">
                      {formatDateTime(event.start_date)}
                    </p>
                  </div>

                  {/* End */}
                  <div className="relative">
                    <div className="absolute -left-5 top-1 h-3.5 w-3.5 rounded-full border-2 border-gray-400 bg-white" />
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                      End Date
                    </p>
                    <p className="mt-0.5 text-sm text-gray-800">
                      {formatDateTime(event.end_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                <p className="text-[11px] text-gray-400">Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {durationDays}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    {durationDays === 1 ? "day" : "days"}
                  </span>
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Metadata
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] text-gray-400">Event ID</p>
                  <p className="mt-0.5 break-all rounded bg-white px-2 py-1.5 font-mono text-[11px] text-gray-500 border border-gray-200">
                    {event.id}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-gray-400">Created</p>
                    <p className="mt-0.5 text-xs text-gray-600">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Updated</p>
                    <p className="mt-0.5 text-xs text-gray-600">
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