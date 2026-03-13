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
  Loader2,
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
      color: "bg-pink-500",
    },
    {
      platform: "youtube",
      url: links.youtube,
      icon: Youtube,
      color: "bg-red-500",
    },
    {
      platform: "facebook",
      url: links.facebook,
      icon: Facebook,
      color: "bg-blue-600",
    },
    {
      platform: "twitter",
      url: links.twitter,
      icon: Twitter,
      color: "bg-sky-500",
    },
    {
      platform: "linkedin",
      url: links.linkedin,
      icon: Linkedin,
      color: "bg-blue-700",
    },
  ];

  const handleChange = (platform: string, value: string) => {
    setLinks((prev) => ({ ...prev, [platform]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      for (const [platform, url] of Object.entries(links)) {
        if (url.trim()) {
          const existingLink = socialLinks.find(
            (link) => link.platform.toLowerCase() === platform.toLowerCase()
          );

          if (existingLink) {
            await editLink(existingLink.id, {
              platform: platform,
              url: url,
            });
          } else {
            await addLink({
              platform: platform,
              url: url,
            });
          }
        } else {
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

  if (loading || linksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!authenticated || role !== "influencer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-4 max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Shield className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Access Denied
          </h2>
          <p className="text-sm text-gray-500">
            This page is only accessible to influencer accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Social Media Links
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect your social media accounts to showcase your reach to brands
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.platform}>
                <label
                  htmlFor={platform.platform}
                  className="mb-1.5 flex items-center gap-2 text-sm font-medium capitalize text-gray-700"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded ${platform.color}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                  {links[platform.platform] && (
                    <a
                      href={links[platform.platform]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-blue-600"
                    >
                      <LinkIcon className="h-4 w-4" />
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
            Changes are saved when you click Save
          </p>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              saved
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Statistics Preview */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Your Social Reach
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {platforms
              .filter((p) => links[p.platform])
              .map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.platform}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded ${platform.color}`}
                      >
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium capitalize text-gray-700">
                        {platform.platform}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Connect API to fetch stats
                    </p>
                  </div>
                );
              })}
          </div>
          {platforms.filter((p) => links[p.platform]).length === 0 && (
            <p className="text-center text-sm text-gray-500">
              Add your social links above to see your reach statistics
            </p>
          )}
        </div>
      </div>
    </div>
  );
}