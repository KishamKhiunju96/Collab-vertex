"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
  Globe,
  Calendar,
  Award,
  Sparkles,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
  SocialLink,
  getSocialLinks,
  getSocialLinksById,
} from "@/api/services/influencerService";
import { Event, eventService } from "@/api/services/eventService";
import EventCard from "@/components/events/EventCard";

interface InfluencerProfileViewProps {
  influencerId: string;
  isOwnProfile?: boolean;
}

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

export default function InfluencerProfileView({
  influencerId,
  isOwnProfile = false,
}: InfluencerProfileViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "events">("overview");

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // If it's own profile, use the current user's profile
        if (isOwnProfile) {
          const data = await influencerService.getProfileByUser();
          if (data) {
            setProfile(data as InfluencerProfile);
          }
        } else {
          // For public profiles, fetch by ID
          const data = await influencerService.getProfileById(influencerId);
          if (data) {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        notify.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSocialLinks = async () => {
      try {
        if (isOwnProfile) {
          // Fetch social links for own profile
          const links = await getSocialLinks();
          setSocialLinks(links);
        } else {
          // Fetch social links by influencer ID for public profiles
          const links = await getSocialLinksById(influencerId);
          setSocialLinks(links);
        }
      } catch (error) {
        console.error("Failed to load social links", error);
      }
    };

    const fetchEvents = async () => {
      if (!influencerId) return;

      setEventsLoading(true);
      try {
        const data = await eventService.getAllEvents(influencerId);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events", error);
        notify.error("Failed to load events.");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchProfileData();
    fetchSocialLinks();
    fetchEvents();
  }, [influencerId, isOwnProfile]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalFollowers = socialLinks.reduce(
    (sum, link) => sum + (link.followers || 0),
    0,
  );

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
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-12 text-center">
            <User size={56} className="text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              This influencer profile doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        {!isOwnProfile && (
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white">
                <User size={48} className="text-gray-600" />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                  <Award className="text-yellow-500" size={32} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-blue-600" />
                    <span className="font-medium">{profile.niche}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-red-600" />
                    <span>{profile.location}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {profile.bio}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={20} className="text-blue-600" />
                      <p className="text-sm text-gray-600 font-medium">
                        Audience
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(profile.audience_size)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={20} className="text-green-600" />
                      <p className="text-sm text-gray-600 font-medium">
                        Engagement
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.engagement_rate}%
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={20} className="text-purple-600" />
                      <p className="text-sm text-gray-600 font-medium">
                        Social Links
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {socialLinks.length}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={20} className="text-orange-600" />
                      <p className="text-sm text-gray-600 font-medium">
                        Total Followers
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(totalFollowers)}
                    </p>
                  </div>
                </div>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => router.push("/influencer/profile")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Events ({events.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="text-blue-600" />
                Social Media Presence
              </h2>

              {socialLinks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Globe size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No social links added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            {platformIcons[link.platform.toLowerCase()] ||
                              platformIcons.other}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 capitalize">
                              {link.platform}
                            </p>
                            {link.followers !== undefined && (
                              <p className="text-sm text-gray-600">
                                {formatNumber(link.followers)} followers
                              </p>
                            )}
                          </div>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <ExternalLink size={20} className="text-blue-600" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="text-purple-600" />
                About
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                    Niche
                  </label>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-gray-900 font-medium">{profile.niche}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                    Location
                  </label>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
                    <p className="text-gray-900 font-medium">
                      {profile.location}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                    Member Since
                  </label>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <p className="text-gray-900 font-medium">
                      {new Date(profile.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="text-blue-600" />
              Available Events
            </h2>

            {eventsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={48} />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No events available</p>
                <p className="text-sm mt-2">
                  Check back later for new collaboration opportunities
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
