"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Plus, TrendingUp, Target } from "lucide-react";
import DashboardHeader from "@/components/influencer/dashboard/DashboardHeader";
import EventCards from "@/components/influencer/dashboard/EventCards";
import { influencerService } from "@/api/services/influencerService";

export default function InfluencerDashboardPage() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await influencerService.getProfileByUser();
        setHasProfile(!!profile);
      } catch (error) {
        // 404 means no profile exists, which is fine
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) {
          setHasProfile(false);
        } else {
          console.error("Error checking profile:", error);
          setHasProfile(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DashboardHeader />

      {/* Profile Creation Prompt */}
      {!hasProfile && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-bold">Complete Your Profile</h2>
              </div>
              <p className="text-white/90 mb-4">
                Create your influencer profile to unlock all features and start
                collaborating with brands!
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  <span>Showcase your niche</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span>Display your stats</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Get discovered by brands</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/influencerprofile")}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Create Profile Now
            </button>
          </div>
        </div>
      )}

      <EventCards />
    </div>
  );
}
