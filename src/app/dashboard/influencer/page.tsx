"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Plus,
  TrendingUp,
  Target,
  Calendar,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-background-hero via-white to-background-alternate">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-brand-primary/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-brand-primary border-r-brand-accent rounded-full animate-spin"></div>
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/10"></div>
            </div>
            <p className="text-text-secondary font-medium text-lg">
              Loading your dashboard...
            </p>
            <p className="text-text-muted text-sm mt-2">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-hero via-white to-background-alternate">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Profile Creation Prompt */}
        {!hasProfile && (
          <div className="mb-8 relative group animate-fade-in-up">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-grid-white bg-grid-md opacity-10 rounded-2xl"></div>

            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 text-white border border-white/20">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-6">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        Complete Your Profile
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base">
                        Create your influencer profile to unlock all features
                        and start collaborating with top brands!
                      </p>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Showcase Niche</p>
                        <p className="text-white/80 text-xs">
                          Highlight your expertise
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Display Stats</p>
                        <p className="text-white/80 text-xs">Show your reach</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Get Discovered</p>
                        <p className="text-white/80 text-xs">
                          Connect with brands
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="w-full lg:w-auto flex flex-col gap-3">
                  <button
                    onClick={() => router.push("/dashboard/influencerprofile")}
                    className="px-6 sm:px-8 py-4 bg-white text-brand-primary rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105 group/btn"
                  >
                    <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" />
                    <span className="text-base sm:text-lg">
                      Create Profile Now
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-white/80 text-xs text-center lg:text-right">
                    Takes less than 5 minutes ⏱️
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Stats Cards (when profile exists) */}
        {hasProfile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-fade-in-up">
            {/* Active Events Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-border-subtle group hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/10 to-brand-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-brand-primary" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">0</h3>
              <p className="text-text-muted text-sm">Active Events</p>
            </div>

            {/* Applications Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-border-subtle group hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-accent/10 to-brand-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-brand-accent" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">0</h3>
              <p className="text-text-muted text-sm">Applications</p>
            </div>

            {/* Collaborations Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-border-subtle group hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary/10 to-brand-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-brand-secondary" />
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  Count
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">0</h3>
              <p className="text-text-muted text-sm">Collaborations</p>
            </div>

            {/* Performance Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-border-subtle group hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/10 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  Rate
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">0%</h3>
              <p className="text-text-muted text-sm">Success Rate</p>
            </div>
          </div>
        )}

        {/* Events Section */}
        <EventCards />
      </main>
    </div>
  );
}
