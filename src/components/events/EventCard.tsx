"use client";

import Link from "next/link";
import { Calendar, MapPin, DollarSign, Tag, Clock } from "lucide-react";
import { Event } from "@/api/services/eventService";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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

  return (
    <Link
      href={`/dashboard/events/${event.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg"
    >
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-red-500 transition-colors line-clamp-2">
              {event.title}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${getStatusColor(
                event.status,
              )}`}
            >
              {event.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {event.description || "No description provided"}
          </p>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="truncate">
                {event.category || "Uncategorized"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="truncate">{event.location || "Remote"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
              <span>{formatDate(event.start_date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-medium">
                ${event.budget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {formatDate(event.start_date)} – {formatDate(event.end_date)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
