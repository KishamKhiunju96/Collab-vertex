import { useState } from "react";
import {
  Pencil,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Link as LinkIcon,
  ExternalLink,
  MapPin,
  Target,
  Users,
  TrendingUp,
  BarChart3,
  Share2,
} from "lucide-react";
import { InfluencerProfile, SocialLink } from "@/api/services/influencerService";
import { useSocialLinks } from "@/api/hooks/useSocialLinks";
import EditProfileForm from "./EditProfileForm";

type TabType = "overview" | "stats";

interface ProfileViewProps {
  profile: InfluencerProfile;
  onProfileUpdate: (updatedProfile: InfluencerProfile) => void;
}

export default function ProfileView({
  profile,
  onProfileUpdate,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showEditForm, setShowEditForm] = useState(false);
  const { socialLinks, loading: socialLinksLoading, refetch } = useSocialLinks();

  const handleProfileUpdated = (updatedProfile: InfluencerProfile) => {
    onProfileUpdate(updatedProfile);
    setShowEditForm(false);
    refetch();
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    refetch();
  };

  const getSocialIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    const iconSize = 20;

    if (lowerPlatform.includes("facebook"))
      return <Facebook size={iconSize} className="text-blue-600" />;
    if (lowerPlatform.includes("twitter") || lowerPlatform.includes("x.com"))
      return <Twitter size={iconSize} className="text-sky-500" />;
    if (lowerPlatform.includes("instagram"))
      return <Instagram size={iconSize} className="text-pink-500" />;
    if (lowerPlatform.includes("linkedin"))
      return <Linkedin size={iconSize} className="text-blue-700" />;
    if (lowerPlatform.includes("youtube"))
      return <Youtube size={iconSize} className="text-red-600" />;
    if (lowerPlatform.includes("website") || lowerPlatform.includes("web"))
      return <Globe size={iconSize} className="text-emerald-600" />;

    return <LinkIcon size={iconSize} className="text-gray-500" />;
  };

  const getSocialBg = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes("facebook")) return "bg-blue-50 border-blue-100 hover:bg-blue-100/70";
    if (lowerPlatform.includes("twitter") || lowerPlatform.includes("x.com"))
      return "bg-sky-50 border-sky-100 hover:bg-sky-100/70";
    if (lowerPlatform.includes("instagram")) return "bg-pink-50 border-pink-100 hover:bg-pink-100/70";
    if (lowerPlatform.includes("linkedin")) return "bg-blue-50 border-blue-100 hover:bg-blue-100/70";
    if (lowerPlatform.includes("youtube")) return "bg-red-50 border-red-100 hover:bg-red-100/70";
    if (lowerPlatform.includes("website") || lowerPlatform.includes("web"))
      return "bg-emerald-50 border-emerald-100 hover:bg-emerald-100/70";
    return "bg-gray-50 border-gray-100 hover:bg-gray-100/70";
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const totalFollowers = socialLinks.reduce(
    (sum, link) => sum + (link.followers || 0),
    0
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {showEditForm && (
        <EditProfileForm
          profile={profile}
          onCancel={handleCancelEdit}
          onSuccess={handleProfileUpdated}
        />
      )}

      {/* Hero Banner */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="h-56 sm:h-64 md:h-72 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/3 w-48 h-48 bg-white rounded-full blur-2xl" />
          </div>
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Profile Card overlapping banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 self-center sm:self-start">
                  <div className="relative group">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-5xl font-bold text-white shadow-md ring-4 ring-white">
                      {profile.name[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 border-[3px] border-white rounded-full" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        {profile.name}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                        {profile.location && (
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                            <MapPin size={14} className="text-gray-400" />
                            {profile.location}
                          </span>
                        )}
                        {profile.niche && (
                          <span className="inline-flex items-center gap-1.5 text-sm">
                            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                              {profile.niche}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowEditForm(true)}
                      className="inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 self-center sm:self-start"
                    >
                      <Pencil size={14} />
                      Edit Profile
                    </button>
                  </div>

                  {profile.bio && (
                    <p className="text-gray-600 mt-4 text-sm leading-relaxed max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  {/* Quick Stats Row */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 leading-none">
                          Audience
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {profile.audience_size
                            ? formatNumber(profile.audience_size)
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <TrendingUp size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 leading-none">
                          Engagement
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {profile.engagement_rate
                            ? `${profile.engagement_rate}%`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Share2 size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 leading-none">
                          Platforms
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {socialLinks.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-16">
        {/* Tab Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-100 p-1.5 inline-flex gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "stats"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Stats
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* ====== OVERVIEW TAB ====== */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column – About & Details */}
              <div className="lg:col-span-1 space-y-6">
                {/* About Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      About
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {profile.bio ? (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No bio added yet.
                      </p>
                    )}

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <MapPin size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 leading-none mb-0.5">
                            Location
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {profile.location || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <Target size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 leading-none mb-0.5">
                            Niche
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {profile.niche || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <Users size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 leading-none mb-0.5">
                            Audience Size
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {profile.audience_size
                              ? formatNumber(profile.audience_size)
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <BarChart3 size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 leading-none mb-0.5">
                            Engagement Rate
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {profile.engagement_rate
                              ? `${profile.engagement_rate}%`
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column – Social Links */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Social Links
                    </h3>
                    {totalFollowers > 0 && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        {formatNumber(totalFollowers)} total followers
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    {socialLinksLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-16 bg-gray-100 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : socialLinks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {socialLinks.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-4 border rounded-xl transition-all duration-200 group ${getSocialBg(
                              link.platform
                            )}`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                              {getSocialIcon(link.platform)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-800 capitalize truncate">
                                {link.platform}
                              </p>
                              {link.followers != null && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {formatNumber(link.followers)} followers
                                </p>
                              )}
                            </div>
                            <ExternalLink
                              size={15}
                              className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0"
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 px-4">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                          <Share2 size={24} className="text-gray-400" />
                        </div>
                        <h4 className="text-base font-semibold text-gray-800 mb-1">
                          No social links yet
                        </h4>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                          Add your social media profiles to increase your
                          visibility and help brands connect with you.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowEditForm(true)}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors"
                        >
                          <LinkIcon size={14} />
                          Add Social Links
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== STATS TAB ====== */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Audience Size
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {profile.audience_size
                      ? formatNumber(profile.audience_size)
                      : "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Total reach</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <TrendingUp size={20} className="text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Engagement Rate
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {profile.engagement_rate
                      ? `${profile.engagement_rate}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Avg. interaction rate
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Share2 size={20} className="text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Platforms
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {socialLinks.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Connected accounts
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <BarChart3 size={20} className="text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Followers
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalFollowers > 0 ? formatNumber(totalFollowers) : "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Across all platforms
                  </p>
                </div>
              </div>

              {/* Per-platform Breakdown */}
              {socialLinks.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Platform Breakdown
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {socialLinks.map((link) => {
                      const pct =
                        totalFollowers > 0 && link.followers
                          ? (link.followers / totalFollowers) * 100
                          : 0;
                      return (
                        <div
                          key={link.id}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                            {getSocialIcon(link.platform)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 capitalize">
                              {link.platform}
                            </p>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-sm font-bold text-gray-900">
                              {link.followers
                                ? formatNumber(link.followers)
                                : "—"}
                            </p>
                            {pct > 0 && (
                              <p className="text-xs text-gray-400">
                                {pct.toFixed(1)}%
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}