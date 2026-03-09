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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Settings
            </h1>
          </div>
          <p className="text-gray-500 ml-[52px] text-sm sm:text-base">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium
                        transition-all duration-200 ease-in-out mb-1 last:mb-0 group
                        ${
                          isActive
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 scale-[1.02]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }
                      `}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold">{tab.label}</div>
                        <div
                          className={`text-[11px] ${
                            isActive ? "text-red-100" : "text-gray-400"
                          }`}
                        >
                          {tab.description}
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`
                        transition-all duration-200
                        ${
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                        }
                      `}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
