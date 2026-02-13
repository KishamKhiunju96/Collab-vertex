// src/components/applications/ApplicationCard.tsx
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { EventApplication } from "@/features/events/types/event.types";
import {
  Users,
  MapPin,
  Target,
  TrendingUp,
  Mail,
  FileText,
} from "lucide-react";

type Props = {
  application: EventApplication;
  onUpdateStatus: (
    applicationId: string,
    status: "approved" | "rejected",
  ) => void;
};

export default function ApplicationCard({
  application,
  onUpdateStatus,
}: Props) {
  const formatNumber = (num?: number) => {
    if (!num) return "N/A";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {application.applicant_name}
          </h3>
          <ApplicationStatusBadge status={application.status} />
        </div>

        {/* Action Buttons */}
        {application.status === "pending" && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onUpdateStatus(application.id, "approved")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
            >
              Approve
            </button>
            <button
              onClick={() => onUpdateStatus(application.id, "rejected")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Influencer Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Niche */}
        {application.niche && (
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Niche</p>
              <p className="text-base text-gray-900">{application.niche}</p>
            </div>
          </div>
        )}

        {/* Location */}
        {application.location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-base text-gray-900">{application.location}</p>
            </div>
          </div>
        )}

        {/* Audience Size */}
        {application.audience_size !== undefined && (
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Audience Size</p>
              <p className="text-base font-semibold text-gray-900">
                {formatNumber(application.audience_size)}
              </p>
            </div>
          </div>
        )}

        {/* Engagement Rate */}
        {application.engagement_rate !== undefined && (
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Engagement Rate
              </p>
              <p className="text-base font-semibold text-gray-900">
                {application.engagement_rate}%
              </p>
            </div>
          </div>
        )}

        {/* Email */}
        {application.email && (
          <div className="flex items-start gap-3 md:col-span-2">
            <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <a
                href={`mailto:${application.email}`}
                className="text-base text-blue-600 hover:underline"
              >
                {application.email}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bio Section */}
      {application.bio && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {application.bio}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Date */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Applied on{" "}
          {new Date(application.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
