"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { eventService, Event } from "@/api/services/eventService";
import { useUserData } from "@/api/hooks/useUserData";
import { useInfluencerProfile } from "@/api/hooks/useInfluencerProfile";
import { notify } from "@/utils/notify";

export default function AppliedEventsPage() {
  const router = useRouter();
  const { user } = useUserData();
  const { profile, loading: profileLoading } = useInfluencerProfile();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedEvents = async () => {
      if (!profile?.id || profileLoading) return;

      try {
        setLoading(true);
        const data = await eventService.getAppliedEvents(profile.id);
        setEvents(data);
      } catch (error: unknown) {
        console.error("Error fetching applied events:", error);
        notify.error("Failed to load applied events");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedEvents();
  }, [profile?.id, profileLoading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view your applied events
          </p>
        </div>
      </div>
    );
  }

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading applied events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Applied Events
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track all the events you&apos;ve applied to
        </p>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Applied Events Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring and applying to events to see them here
          </p>
          <button
            onClick={() => router.push("/dashboard/influencer")}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Events
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/events/${event.id}`)}
            >
              {/* Event Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center text-indigo-100">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 space-y-4">
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                  {event.description}
                </p>

                {/* Info Grid */}
                <div className="space-y-3">
                  {/* Budget */}
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Budget
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(event.budget)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Location
                      </p>
                      <p className="font-semibold line-clamp-1">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Target Audience
                      </p>
                      <p className="font-semibold line-clamp-1">
                        {event.target_audience}
                      </p>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Event Period
                      </p>
                      <p className="font-semibold text-sm">
                        {formatDate(event.start_date)} -{" "}
                        {formatDate(event.end_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Applied Badge */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                    ✓ Applied
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <div className="px-6 pb-6">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
