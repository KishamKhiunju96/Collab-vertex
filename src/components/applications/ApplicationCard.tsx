"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  MapPin,
  Target,
  TrendingUp,
  Mail,
  FileText,
  ExternalLink,
  Check,
  X,
  Clock,
  Sparkles,
} from "lucide-react";

export type Application = {
  id?: string;
  status: "pending" | "accepted" | "rejected";
  event: {
    id: string;
    title: string;
  };
  influencer: {
    id: string;
    name: string;
    niche?: string;
    location?: string;
    audience_size?: number;
    engagement_rate?: number;
    email?: string;
    bio?: string;
  };
  applied_at?: string;
};

type Props = {
  application: Application;
  onUpdateStatus: (
    applicationId: string,
    status: "accepted" | "rejected",
  ) => void;
};

export default function ApplicationCard({
  application,
  onUpdateStatus,
}: Props) {
  const router = useRouter();
  const influencer = application.influencer;
  const [isProcessing, setIsProcessing] = useState(false);

  const formatNumber = (num?: number) => {
    if (!num) return "N/A";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = () => {
    switch (application.status) {
      case "accepted":
        return {
          bg: "bg-gradient-to-r from-green-50 to-emerald-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: Check,
          label: "Accepted",
        };
      case "rejected":
        return {
          bg: "bg-gradient-to-r from-red-50 to-rose-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: X,
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const handleStatusUpdate = async (status: "accepted" | "rejected") => {
    setIsProcessing(true);
    try {
      await onUpdateStatus(application.id ?? "", status);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewProfile = () => {
    router.push(`/dashboard/influencerprofile?id=${influencer.id}`);
  };

  return (
    <div className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Status Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          application.status === "accepted"
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : application.status === "rejected"
              ? "bg-gradient-to-r from-red-500 to-rose-500"
              : "bg-gradient-to-r from-yellow-500 to-amber-500"
        }`}
      />

      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg">
                  {influencer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {influencer.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Applied for{" "}
                  <span className="font-semibold text-gray-700">
                    {application.event.title}
                  </span>
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 mt-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} border-2`}
              >
                <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                <span className={`text-sm font-bold ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {application.status === "pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("accepted")}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-900  text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  <Check className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span>Accept</span>
                </button>

                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-900   text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  <X className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span>Reject</span>
                </button>
              </>
            )}

            <button
              onClick={handleViewProfile}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/view"
            >
              <span>View Profile</span>
            </button>
          </div>
        </div>

        {/* Influencer Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Niche */}
          {influencer.niche && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                    Niche
                  </p>
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">
                    {influencer.niche}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {influencer.location && (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                    Location
                  </p>
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">
                    {influencer.location}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Audience Size */}
          {influencer.audience_size !== undefined && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    Audience
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatNumber(influencer.audience_size)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Rate */}
          {influencer.engagement_rate !== undefined && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                    Engagement
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {influencer.engagement_rate}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {influencer.email && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${influencer.email}`}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-2 group/mail"
                  >
                    {influencer.email}
                    <ExternalLink className="w-3 h-3 group-hover/mail:translate-x-0.5 group-hover/mail:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bio Section */}
        {influencer.bio && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                    About
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {influencer.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Applied {formatDate(application.applied_at)}</span>
            </div>

            {application.status !== "pending" && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  Application {application.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Corner Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
