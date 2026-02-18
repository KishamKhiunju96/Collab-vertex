// src/components/applications/ApplicationsList.tsx
"use client";

import ApplicationCard, { Application } from "./ApplicationCard";
import { useEventApplications } from "@/features/events/hooks/useEventApplications";
import { applicationService } from "@/features/applications/services/application.service";
import { Users } from "lucide-react";
import { EventApplication } from "@/features/events/types/event.types";

type Props = {
  eventId: string;
};

export default function ApplicationsList({ eventId }: Props) {
  const { applications, loading, error, refetch } =
    useEventApplications(eventId);

  // Map EventApplication to Application type
  const mapToApplicationCard = (app: EventApplication): Application => {
    return {
      id: app.id,
      status: app.status,
      event: {
        id: app.event_id,
        title: app.event_title || "Event",
      },
      influencer: {
        id: app.influencer_id,
        name: app.influencer_name || "Influencer",
        niche: app.niche,
        location: app.location,
        audience_size: app.audience_size,
        engagement_rate: app.engagement_rate,
        email: app.email,
        bio: app.bio,
      },
      applied_at: app.applied_at,
    };
  };

  const handleUpdateStatus = async (
    applicationId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, {
        status,
      });

      // Refetch applications after status update
      if (refetch) {
        await refetch();
      } else {
        window.location.reload(); // fallback
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">No applications yet</p>
        <p className="text-gray-500 text-sm">
          Influencers who apply to this event will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        {applications.length}{" "}
        {applications.length === 1 ? "application" : "applications"}
      </p>

      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={mapToApplicationCard(app)}
          onUpdateStatus={handleUpdateStatus}
        />
      ))}
    </div>
  );
}
