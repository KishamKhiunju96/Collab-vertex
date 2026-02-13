// src/components/applications/ApplicationsList.tsx
"use client";

import ApplicationCard from "./ApplicationCard";
import { useEventApplications } from "@/features/events/hooks/useEventApplications";
import { applicationService } from "@/features/applications/services/application.service";
import { Users } from "lucide-react";

type Props = {
  eventId: string;
};

export default function ApplicationsList({ eventId }: Props) {
  const { applications, loading, error } = useEventApplications(eventId);

  const handleUpdateStatus = async (
    applicationId: string,
    status: "approved" | "rejected",
  ) => {
    await applicationService.updateApplicationStatus(applicationId, { status });
    window.location.reload(); // replace with optimistic update later
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

  if (applications.length === 0) {
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
          application={app}
          onUpdateStatus={handleUpdateStatus}
        />
      ))}
    </div>
  );
}
