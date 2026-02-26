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
        return "bg-status-successBg text-status-successText border-green-300";
      case "inactive":
        return "bg-background-surface text-text-secondary border-border-subtle";
      default:
        return "bg-status-infoBg text-status-infoText border-blue-300";
    }
  };

  return (
    <Link
      href={`/dashboard/events/${event.id}`}
      className="block focus:outline-none focus:ring-4 focus:ring-button-primary-ring rounded-2xl"
    >
      <div className="bg-white rounded-2xl border border-border-subtle hover:shadow-hover hover:border-border-accent transition-all duration-200 overflow-hidden group">
        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-button-primary-DEFAULT transition-colors line-clamp-2">
              {event.title}
            </h3>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 shadow-xs ${getStatusColor(
                event.status,
              )}`}
            >
              {event.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm line-clamp-2">
            {event.description || "No description provided"}
          </p>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Tag className="h-4 w-4 text-icon-default shrink-0" />
              <span className="truncate">
                {event.category || "Uncategorized"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin className="h-4 w-4 text-icon-default shrink-0" />
              <span className="truncate">{event.location || "Remote"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar className="h-4 w-4 text-icon-default shrink-0" />
              <span>{formatDate(event.start_date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-primary">
              <DollarSign className="h-4 w-4 text-brand-highlight-DEFAULT shrink-0" />
              <span className="font-semibold">
                ${event.budget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 pt-3 border-t border-border-subtle">
            <Clock className="h-4 w-4 text-icon-muted" />
            <span className="text-xs text-text-muted">
              {formatDate(event.start_date)} – {formatDate(event.end_date)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
