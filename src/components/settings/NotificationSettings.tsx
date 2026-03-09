"use client";

import { useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Notification settings updated");
    } catch (error) {
      notify.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Notification Preferences
            </h2>
            <p className="text-sm text-gray-500">
              Choose what notifications you&apos;d like to receive
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 sm:px-8 py-2">
        {NOTIFICATION_OPTIONS.map((item, index) => (
          <div
            key={item.key}
            className={`
              flex items-center justify-between py-5 group
              ${index !== NOTIFICATION_OPTIONS.length - 1 ? "border-b border-gray-100" : ""}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Custom Toggle */}
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={notificationSettings[item.key]}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    [item.key]: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div
                className="
                w-12 h-7 bg-gray-200 rounded-full
                peer-focus:ring-4 peer-focus:ring-red-500/10
                peer-checked:bg-gradient-to-r peer-checked:from-red-500 peer-checked:to-red-600
                after:content-[''] after:absolute after:top-[3px] after:left-[3px]
                after:bg-white after:rounded-full after:h-[22px] after:w-[22px]
                after:transition-all after:duration-300 after:ease-in-out
                after:shadow-sm
                peer-checked:after:translate-x-[20px]
                transition-all duration-300
                hover:bg-gray-300 peer-checked:hover:from-red-600 peer-checked:hover:to-red-700
              "
              ></div>
            </label>
          </div>
        ))}
      </div>

      {/* Card Footer */}
      <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleNotificationSave}
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
            <CheckCircle size={18} />
          )}
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
