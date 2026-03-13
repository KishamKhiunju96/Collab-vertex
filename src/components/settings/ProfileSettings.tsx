"use client";

import { useState } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { ProfileData } from "./types";
import { notify } from "@/utils/notify";

interface ProfileSettingsProps {
  initialData: ProfileData;
}

export default function ProfileSettings({ initialData }: ProfileSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialData);

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Profile updated successfully");
    } catch (error) {
      notify.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500">
              Update your personal details and public profile
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 px-6 py-6 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  username: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  email: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={profileData.company}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  company: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Your company"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  website: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                bio: e.target.value,
              })
            }
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            placeholder="Tell us about your brand..."
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Brief description for your profile. Max 200 characters.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
        <button
          onClick={handleProfileSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}