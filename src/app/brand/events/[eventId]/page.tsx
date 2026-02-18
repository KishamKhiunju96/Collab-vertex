"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import ApplicationsList from "@/components/applications/ApplicationsList";
import { eventService, Event } from "@/api/services/eventService";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default function EventApplicationsPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEventById(resolvedParams.eventId);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [resolvedParams.eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          {/* Event Title and Info */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event?.title || "Event Applications"}
              </h1>
              <p className="text-gray-600">
                Review and manage influencer applications for this event
              </p>
            </div>

            {/* Quick Stats */}
            {event && (
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        event.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <p className="text-sm font-bold text-gray-900 capitalize">
                      {event.status}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Budget
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    ₹{event.budget?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Details Card */}
        {event && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Category</p>
                  <p className="text-base font-semibold text-gray-900">
                    {event.category}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-base font-semibold text-gray-900">
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Event Period */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Event Period
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Applications Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Applications
                </h2>
                <p className="text-sm text-gray-500">
                  Review influencer profiles and manage applications
                </p>
              </div>
            </div>

            {/* Status Legend */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-gray-600">
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-600">
                  Accepted
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-gray-600">
                  Rejected
                </span>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <ApplicationsList eventId={resolvedParams.eventId} />
        </div>
      </div>
    </div>
  );
}
