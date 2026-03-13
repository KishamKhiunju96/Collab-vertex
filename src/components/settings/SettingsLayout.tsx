"use client";

import { ReactNode } from "react";
import { Settings, ChevronRight } from "lucide-react";
import { SettingsTab } from "./types";
import { SETTINGS_TABS } from "./constants";

interface SettingsLayoutProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  children: ReactNode;
}

export default function SettingsLayout({
  activeTab,
  onTabChange,
  children,
}: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Settings
            </h1>
          </div>
          <p className="ml-[52px] text-sm text-gray-500">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Settings Menu
                </p>
              </div>
              <nav className="p-2">
                {SETTINGS_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors last:mb-0 ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${
                          isActive ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate font-medium">{tab.label}</div>
                        <div
                          className={`truncate text-xs ${
                            isActive ? "text-blue-600" : "text-gray-400"
                          }`}
                        >
                          {tab.description}
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 shrink-0 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}