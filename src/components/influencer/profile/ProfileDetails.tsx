"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
} from "@/api/services/influencerService";

type TabType = "overview" | "stats";

export default function ProfileDetails() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await influencerService.getProfile();
        setProfile(data);
      } catch {
        notify.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!profile) return <div className="p-4 text-center">No profile found.</div>;

  return (
    <div className="w-full text-text-primary">
      {/*Background */}
      <div className="relative h-64 bg-blue-500">
        {/* Profile Logo (half overlapping background) */}
        <div className="absolute left-8 -bottom-16">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-700">
            {profile.name[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/*  Name + Bio (FIXED POSITION)  */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="flex gap-6">
          {/* Spacer to align text with logo */}
          <div className="w-32" />

          {/* Name + Edit + Bio */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{profile.name}</h1>

              <button
                type="button"
                className="flex items-center gap-1 text-sm px-3 py-1.5 border rounded-md text-gray-600 hover:bg-gray-100 transition"
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {profile.bio}
            </p>
          </div>
        </div>
      </div>

      {/*  Tabs  */}
      <div className="max-w-5xl mx-auto px-4 mt-10">
        <div className="flex gap-6 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-2 ${
              activeTab === "stats"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Stats
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-2">
              <p>
                <strong>Location:</strong> {profile.location}
              </p>
              <p>
                <strong>Niche:</strong> {profile.niche}
              </p>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-2">
              <p>
                <strong>Audience Size:</strong>{" "}
                {profile.audience_size}
              </p>
              <p>
                <strong>Engagement Rate:</strong>{" "}
                {profile.engagement_rate}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
