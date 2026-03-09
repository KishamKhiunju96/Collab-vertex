"use client";

import { useState } from "react";
import { User, Save } from "lucide-react";
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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Profile updated successfully");
    } catch (error) {
      notify.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500">
              Update your personal details and public profile
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 sm:px-8 py-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                  outline-none transition-all duration-200
                  hover:border-gray-300 text-gray-900 placeholder-gray-400
                  bg-gray-50 focus:bg-white"
                placeholder="Your username"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                  outline-none transition-all duration-200
                  hover:border-gray-300 text-gray-900 placeholder-gray-400
                  bg-gray-50 focus:bg-white"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                  outline-none transition-all duration-200
                  hover:border-gray-300 text-gray-900 placeholder-gray-400
                  bg-gray-50 focus:bg-white"
                placeholder="Your company"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                  outline-none transition-all duration-200
                  hover:border-gray-300 text-gray-900 placeholder-gray-400
                  bg-gray-50 focus:bg-white"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                outline-none transition-all duration-200
                hover:border-gray-300 text-gray-900 placeholder-gray-400
                bg-gray-50 focus:bg-white resize-none"
              placeholder="Tell us about your brand..."
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Brief description for your profile. Max 200 characters.
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleProfileSave}
          disabled={isSaving}
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gradient-to-r from-red-500 to-red-600 text-white
            rounded-xl font-semibold text-sm
            hover:from-red-600 hover:to-red-700
            active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30
          "
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
