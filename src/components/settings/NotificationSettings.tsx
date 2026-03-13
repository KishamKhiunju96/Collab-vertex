"use client";

import { useState } from "react";
import { Bell, CheckCircle, Loader2 } from "lucide-react";
import { NotificationSettings as NotificationSettingsType } from "./types";
import { NOTIFICATION_OPTIONS } from "./constants";
import { notify } from "@/utils/notify";

interface NotificationSettingsProps {
  initialSettings: NotificationSettingsType;
}

export default function NotificationSettings({
  initialSettings,
}: NotificationSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettingsType>(initialSettings);

  const handleNotificationSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Notification settings updated");
    } catch (error) {
      notify.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Bell className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Notification Preferences
            </h2>
            <p className="text-sm text-gray-500">
              Choose what notifications you'd like to receive
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-2 sm:px-8">
        {NOTIFICATION_OPTIONS.map((item, index) => (
          <div
            key={item.key}
            className={`flex items-center justify-between py-5 ${
              index !== NOTIFICATION_OPTIONS.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-lg">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Toggle */}
            <label className="relative inline-flex shrink-0 cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notificationSettings[item.key]}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    [item.key]: e.target.checked,
                  })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-blue-500/20"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
        <button
          onClick={handleNotificationSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}