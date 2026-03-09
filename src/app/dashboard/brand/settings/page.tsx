"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { useUserData } from "@/api/hooks/useUserData";
import { useState } from "react";
import { Shield } from "lucide-react";
import {
  SettingsLayout,
  ProfileSettings,
  NotificationSettings,
  SecuritySettings,
  SettingsTab,
  ProfileData,
  NotificationSettingsType,
} from "@/components/settings";

export default function SettingsPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const { user } = useUserData();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Initialize profile data from user
  const profileData: ProfileData = {
    username: user?.username || "",
    email: user?.email || "",
    company: "",
    website: "",
    bio: "",
  };

  // Initialize notification settings with defaults
  const notificationSettings: NotificationSettingsType = {
    emailNotifications: true,
    newCollaborations: true,
    eventUpdates: true,
    influencerMessages: true,
    weeklyReports: false,
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
          </div>
          <span className="text-lg text-gray-600 font-medium tracking-wide">
            Loading settings...
          </span>
        </div>
      </div>
    );
  }

  // Role protection
  if (!authenticated || role !== "brand") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500">
            This page is only accessible to brand accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "profile" && (
        <ProfileSettings initialData={profileData} />
      )}
      {activeTab === "notifications" && (
        <NotificationSettings initialSettings={notificationSettings} />
      )}
      {activeTab === "security" && <SecuritySettings />}
    </SettingsLayout>
  );
}

