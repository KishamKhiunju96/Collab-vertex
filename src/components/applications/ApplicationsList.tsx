// src/components/applications/ApplicationsList.tsx
"use client";

import { useState } from "react";
import ApplicationCard, { Application } from "./ApplicationCard";
import { useEventApplications } from "@/features/events/hooks/useEventApplications";
import { applicationService } from "@/features/applications/services/application.service";
import { Users, Loader2 } from "lucide-react";
import { EventApplication } from "@/features/events/types/event.types";

type Props = {
  eventId: string;
};

export default function ApplicationsList({ eventId }: Props) {
  const { applications, loading, error, refetch } =
    useEventApplications(eventId);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const mapToApplicationCard = (app: EventApplication): Application => ({
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
  });

  const handleUpdateStatus = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    if (!applicationId) {
      console.error("Application ID is required");
      alert("Error: Application ID is required");
      return;
    }

    setUpdatingId(applicationId);

    try {
      await applicationService.updateApplicationStatus(applicationId, {
        status,
      });

      if (refetch) {
        await refetch();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      alert(
        `Failed to update application status: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-7 w-7 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading applications…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />
        <p className="mb-1 text-sm font-medium text-gray-600">
          No applications yet
        </p>
        <p className="text-xs text-gray-400">
          Influencers who apply will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        {applications.length}{" "}
        {applications.length === 1 ? "application" : "applications"}
      </p>

      {applications.map((app, index) => {
        const mappedApp = mapToApplicationCard(app);
        return (
          <ApplicationCard
            key={app.id || `app-${index}`}
            application={mappedApp}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updatingId === app.id}
          />
        );
      })}
    </div>
  );
}