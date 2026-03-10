"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { useSocialLinks } from "@/api/hooks/useSocialLinks";
import { useState, useEffect } from "react";
import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  TrendingUp,
  Save,
  Shield,
  Link as LinkIcon,
  Check,
} from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  followers?: number;
  icon: React.ElementType;
  color: string;
}

export default function SocialLinksPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const {
    socialLinks,
    loading: linksLoading,
    addLink,
    editLink,
    removeLink,
  } = useSocialLinks();

  const [links, setLinks] = useState<Record<string, string>>({
    instagram: "",
    youtube: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize links from socialLinks array
  useEffect(() => {
    if (socialLinks && socialLinks.length > 0) {
      const linksMap: Record<string, string> = {
        instagram: "",
        youtube: "",
        facebook: "",
        twitter: "",
        linkedin: "",
      };
      socialLinks.forEach((link) => {
        linksMap[link.platform.toLowerCase()] = link.url;
      });
      setLinks(linksMap);
    }
  }, [socialLinks]);

  const platforms: SocialLink[] = [
    {
      platform: "instagram",
      url: links.instagram,
      icon: Instagram,
      color: "from-purple-600 to-pink-500",
    },
    {
      platform: "youtube",
      url: links.youtube,
      icon: Youtube,
      color: "from-red-600 to-red-500",
    },
    {
      platform: "facebook",
      url: links.facebook,
      icon: Facebook,
      color: "from-blue-600 to-blue-500",
    },
    {
      platform: "twitter",
      url: links.twitter,
      icon: Twitter,
      color: "from-sky-500 to-blue-500",
    },
    {
      platform: "linkedin",
      url: links.linkedin,
      icon: Linkedin,
      color: "from-blue-700 to-blue-600",
    },
  ];

  const handleChange = (platform: string, value: string) => {
    setLinks((prev) => ({ ...prev, [platform]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update or create each social link
      for (const [platform, url] of Object.entries(links)) {
        if (url.trim()) {
          // Check if link already exists
          const existingLink = socialLinks.find(
            (link) => link.platform.toLowerCase() === platform.toLowerCase()
          );

          if (existingLink) {
            // Update existing link
            await editLink(existingLink.id, {
              platform: platform,
              url: url,
            });
          } else {
            // Create new link
            await addLink({
              platform: platform,
              url: url,
            });
          }
        } else {
          // Remove link if URL is empty
          const existingLink = socialLinks.find(
            (link) => link.platform.toLowerCase() === platform.toLowerCase()
          );
          if (existingLink) {
            await removeLink(existingLink.id);
          }
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save social links:", error);
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading || linksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          </div>
          <span className="text-lg text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Role protection
  if (!authenticated || role !== "influencer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-purple-100">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500">
            This page is only accessible to influencer accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Social Media Links
          </h1>
          <p className="text-gray-600 mt-2">
            Connect your social media accounts to showcase your reach to brands
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Boost Your Profile
            </h4>
            <p className="text-sm text-blue-700">
              Adding your social media links helps brands discover you and
              evaluate your reach. Make sure your profiles are public and
              up-to-date.
            </p>
          </div>
        </div>

        {/* Social Links Form */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.platform} className="space-y-2">
                <label
                  htmlFor={platform.platform}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 capitalize"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {platform.platform}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id={platform.platform}
                    value={links[platform.platform]}
                    onChange={(e) =>
                      handleChange(platform.platform, e.target.value)
                    }
                    placeholder={`https://${platform.platform}.com/yourusername`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                  {links[platform.platform] && (
                    <a
                      href={links[platform.platform]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Changes are saved automatically when you click Save
          </p>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition
              ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }
              ${saving ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Statistics Preview (placeholder) */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Social Reach
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {platforms
              .filter((p) => links[p.platform])
              .map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.platform}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded bg-gradient-to-br ${platform.color} flex items-center justify-center`}
                      >
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {platform.platform}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Connect API to fetch stats
                    </p>
                  </div>
                );
              })}
          </div>
          {platforms.filter((p) => links[p.platform]).length === 0 && (
            <p className="text-center text-gray-500">
              Add your social links above to see your reach statistics
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
