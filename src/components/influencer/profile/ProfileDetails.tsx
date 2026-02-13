"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  User,
  MapPin,
  Target,
  Users,
  TrendingUp,
  FileText,
} from "lucide-react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
  CreateInfluencerPayload,
} from "@/api/services/influencerService";

type TabType = "overview" | "stats";

export default function ProfileDetails() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<CreateInfluencerPayload>({
    name: "",
    niche: "",
    audience_size: 0,
    engagement_rate: 0,
    bio: "",
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await influencerService.getProfileByUser();
        if (data) {
          setProfile(data as InfluencerProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        // 404 means no profile exists yet, which is fine
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) {
          setProfile(null);
        } else {
          notify.error("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.niche ||
      !formData.bio ||
      !formData.location
    ) {
      notify.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const newProfile = await influencerService.createProfile(formData);
      setProfile(newProfile as InfluencerProfile);
      setShowCreateForm(false);
      notify.success("Profile created successfully!");
    } catch (error) {
      console.error("Create profile error:", error);
      notify.error("Failed to create profile. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile && !showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Create Your Influencer Profile
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              You haven&apos;t created your influencer profile yet. Set up your
              profile to start collaborating with brands and accessing exciting
              opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Target size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Showcase Your Niche
              </h3>
              <p className="text-sm text-gray-600">
                Highlight your expertise and attract brands in your industry.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Display Your Stats
              </h3>
              <p className="text-sm text-gray-600">
                Show your audience size and engagement rate to potential
                partners.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Connect with Brands
              </h3>
              <p className="text-sm text-gray-600">
                Get discovered by brands looking for influencers like you.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg flex items-center gap-2 mx-auto shadow-lg"
          >
            <Plus size={24} />
            Create My Profile
          </button>
        </div>
      </div>
    );
  }

  if (showCreateForm && !profile) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Your Influencer Profile
            </h2>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target size={16} className="inline mr-2" />
                Niche *
              </label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) =>
                  setFormData({ ...formData, niche: e.target.value })
                }
                placeholder="e.g., Fashion, Tech, Fitness, Travel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users size={16} className="inline mr-2" />
                  Audience Size *
                </label>
                <input
                  type="number"
                  value={formData.audience_size}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audience_size: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Total followers"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp size={16} className="inline mr-2" />
                  Engagement Rate (%) *
                </label>
                <input
                  type="number"
                  value={formData.engagement_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      engagement_rate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.0"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-2" />
                Bio *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell brands about yourself and what you do..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating Profile..." : "Create Profile"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                disabled={isCreating}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!profile) return null;

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

            <p className="text-sm text-gray-600 mt-2">{profile.bio}</p>
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
                <strong>Audience Size:</strong> {profile.audience_size}
              </p>
              <p>
                <strong>Engagement Rate:</strong> {profile.engagement_rate}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
