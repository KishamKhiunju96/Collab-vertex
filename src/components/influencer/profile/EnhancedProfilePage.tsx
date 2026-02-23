"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Plus,
  User,
  MapPin,
  Target,
  Users,
  TrendingUp,
  FileText,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  ExternalLink,
  Trash2,
  Check,
  X,
  Globe,
  BarChart3,
  Calendar,
  Award,
  Sparkles,
  Eye,
} from "lucide-react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
  CreateInfluencerPayload,
} from "@/api/services/influencerService";
import { useSocialLinks } from "@/api/hooks/useSocialLinks";
import { SocialLink } from "@/api/services/influencerService";

type TabType = "overview" | "social" | "stats";

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram size={20} className="text-pink-600" />,
  twitter: <Twitter size={20} className="text-sky-500" />,
  facebook: <Facebook size={20} className="text-blue-600" />,
  youtube: <Youtube size={20} className="text-red-600" />,
  linkedin: <Linkedin size={20} className="text-blue-700" />,
  tiktok: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  other: <Globe size={20} className="text-gray-600" />,
};

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];

export default function EnhancedProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);

  const {
    socialLinks,
    loading: linksLoading,
    addLink,
    editLink,
    removeLink,
  } = useSocialLinks();

  const [formData, setFormData] = useState<CreateInfluencerPayload>({
    name: "",
    niche: "",
    audience_size: 0,
    engagement_rate: 0,
    bio: "",
    location: "",
  });

  const [socialFormData, setSocialFormData] = useState({
    platform: "instagram",
    url: "",
    followers: 0,
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

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!socialFormData.url) {
      notify.error("Please provide a valid URL");
      return;
    }

    try {
      if (editingSocialId) {
        await editLink(editingSocialId, socialFormData);
        notify.success("Social link updated successfully!");
      } else {
        await addLink(socialFormData);
        notify.success("Social link added successfully!");
      }
      resetSocialForm();
    } catch (error) {
      console.error("Social link error:", error);
      notify.error("Failed to save social link");
    }
  };

  const handleEditSocial = (link: SocialLink) => {
    setEditingSocialId(link.id);
    setSocialFormData({
      platform: link.platform,
      url: link.url,
      followers: link.followers || 0,
    });
    setShowSocialForm(true);
  };

  const handleDeleteSocial = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this social link?")) {
      try {
        await removeLink(id);
        notify.success("Social link deleted successfully!");
      } catch (error) {
        notify.error("Failed to delete social link");
      }
    }
  };

  const resetSocialForm = () => {
    setShowSocialForm(false);
    setEditingSocialId(null);
    setSocialFormData({
      platform: "instagram",
      url: "",
      followers: 0,
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <Sparkles
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse"
              size={24}
            />
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile && !showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2"></div>
            <div className="p-12 text-center">
              <div className="mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User size={56} className="text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Create Your Influencer Profile
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Join our community of influencers and start collaborating with
                  top brands. Build your presence and unlock exciting
                  opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <Target size={28} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    Showcase Your Niche
                  </h3>
                  <p className="text-sm text-gray-700">
                    Highlight your expertise and attract brands in your
                    industry.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <TrendingUp size={28} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    Display Your Stats
                  </h3>
                  <p className="text-sm text-gray-700">
                    Show your audience size and engagement rate to potential
                    partners.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <Users size={28} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    Connect with Brands
                  </h3>
                  <p className="text-sm text-gray-700">
                    Get discovered by brands looking for influencers like you.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateForm(true)}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-semibold text-lg flex items-center gap-3 mx-auto shadow-lg"
              >
                <Plus size={24} />
                Create My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2"></div>
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Create Your Influencer Profile
                </h2>
                <p className="text-gray-600">
                  Fill in your details to get started on your journey
                </p>
              </div>

              <form onSubmit={handleCreateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Target size={16} className="inline mr-2" />
                      Niche *
                    </label>
                    <input
                      type="text"
                      value={formData.niche}
                      onChange={(e) =>
                        setFormData({ ...formData, niche: e.target.value })
                      }
                      placeholder="e.g., Fashion, Tech, Fitness"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Users size={16} className="inline mr-2" />
                      Total Followers *
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
                      placeholder="e.g., 50000"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      placeholder="e.g., 4.5"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FileText size={16} className="inline mr-2" />
                      Bio *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Tell brands about yourself, your content style, and what makes you unique..."
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Creating Profile...
                      </span>
                    ) : (
                      "Create Profile"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    disabled={isCreating}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const totalFollowers = socialLinks.reduce(
    (sum, link) => sum + (link.followers || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header Section */}
      <div className="relative">
        <div className="h-72 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Profile Avatar */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative -mt-20">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl border-4 border-white shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">
                    {profile.name[0].toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <Award size={20} className="text-white" />
                </div>
              </div>

              <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full">
                        <Target size={14} className="text-blue-600" />
                        {profile.niche}
                      </span>
                      <span className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-full">
                        <MapPin size={14} className="text-purple-600" />
                        {profile.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/influencer/${profile.id}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                    >
                      <Eye size={16} />
                      View Public Profile
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(profile.audience_size)}
            </p>
            <p className="text-sm text-gray-600 font-medium">Total Reach</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {profile.engagement_rate}%
            </p>
            <p className="text-sm text-gray-600 font-medium">Engagement Rate</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(totalFollowers)}
            </p>
            <p className="text-sm text-gray-600 font-medium">
              Social Followers
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Globe size={24} className="text-pink-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {socialLinks.length}
            </p>
            <p className="text-sm text-gray-600 font-medium">Platforms</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 font-semibold transition-all relative ${
                  activeTab === "overview"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
                {activeTab === "overview" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("social")}
                className={`py-4 font-semibold transition-all relative ${
                  activeTab === "social"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Social Links
                {activeTab === "social" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("stats")}
                className={`py-4 font-semibold transition-all relative ${
                  activeTab === "stats"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Analytics
                {activeTab === "stats" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                    {profile.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin size={20} className="text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Location</h4>
                    </div>
                    <p className="text-gray-700 font-medium">
                      {profile.location}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Target size={20} className="text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Niche</h4>
                    </div>
                    <p className="text-gray-700 font-medium">{profile.niche}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={20} className="text-amber-600" />
                    <h4 className="font-semibold text-gray-900">
                      Member Since
                    </h4>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "Recently joined"}
                  </p>
                </div>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Globe size={20} className="text-blue-600" />
                    My Social Platforms
                  </h3>
                  <button
                    onClick={() => setShowSocialForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
                  >
                    <Plus size={18} />
                    Add Platform
                  </button>
                </div>

                {/* Social Form */}
                {showSocialForm && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-4">
                      {editingSocialId
                        ? "Edit Social Link"
                        : "Add New Social Link"}
                    </h4>
                    <form onSubmit={handleSocialSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Platform *
                          </label>
                          <select
                            value={socialFormData.platform}
                            onChange={(e) =>
                              setSocialFormData({
                                ...socialFormData,
                                platform: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            required
                          >
                            {platforms.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Profile URL *
                          </label>
                          <input
                            type="url"
                            value={socialFormData.url}
                            onChange={(e) =>
                              setSocialFormData({
                                ...socialFormData,
                                url: e.target.value,
                              })
                            }
                            placeholder="https://..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Followers
                          </label>
                          <input
                            type="number"
                            value={socialFormData.followers}
                            onChange={(e) =>
                              setSocialFormData({
                                ...socialFormData,
                                followers: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                            min="0"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                        >
                          <Check size={18} />
                          {editingSocialId ? "Update" : "Add"} Link
                        </button>
                        <button
                          type="button"
                          onClick={resetSocialForm}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Social Links List */}
                {linksLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading social links...</p>
                  </div>
                ) : socialLinks.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Globe size={48} className="text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No Social Links Yet
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Start by adding your social media profiles to showcase
                      your reach
                    </p>
                    <button
                      onClick={() => setShowSocialForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                      <Plus size={18} />
                      Add Your First Platform
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              {platformIcons[link.platform] ||
                                platformIcons.other}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 capitalize">
                                {link.platform}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatNumber(link.followers || 0)} followers
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Visit profile"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 truncate bg-gray-50 px-3 py-2 rounded-lg">
                            {link.url}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSocial(link)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSocial(link.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-600" />
                  Performance Analytics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Users size={28} className="text-white" />
                      </div>
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatNumber(profile.audience_size)}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Total Audience Size
                    </p>
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-xs text-gray-600">
                        Across all platforms
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp size={28} className="text-white" />
                      </div>
                      <Award className="text-green-600" size={24} />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {profile.engagement_rate}%
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Engagement Rate
                    </p>
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-xs text-gray-600">
                        {profile.engagement_rate > 3
                          ? "Above average"
                          : "Growing"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Globe size={28} className="text-white" />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {socialLinks.length}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Connected Platforms
                    </p>
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <p className="text-xs text-gray-600">
                        Active social channels
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-8 rounded-xl border border-pink-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChart3 size={28} className="text-white" />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatNumber(totalFollowers)}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Social Media Reach
                    </p>
                    <div className="mt-4 pt-4 border-t border-pink-200">
                      <p className="text-xs text-gray-600">
                        Combined followers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <Sparkles size={32} />
                    <h4 className="text-2xl font-bold">Profile Strength</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Profile Completion</span>
                      <span className="font-bold">
                        {socialLinks.length > 0 ? "100%" : "80%"}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-white rounded-full h-3 transition-all duration-500"
                        style={{
                          width: socialLinks.length > 0 ? "100%" : "80%",
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-white/90 mt-4">
                      {socialLinks.length > 0
                        ? "🎉 Your profile is complete! You're ready to attract top brands."
                        : "Add social links to complete your profile and increase visibility."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
