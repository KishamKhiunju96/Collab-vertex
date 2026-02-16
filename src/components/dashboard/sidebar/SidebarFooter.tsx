"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronUp, Settings, User } from "lucide-react";

import axios from "@/features/lib/axios";
import { useUserData } from "@/api/hooks/useUserData";

interface SidebarFooterProps {
  role: string;
}

export default function SidebarFooter({ role }: SidebarFooterProps) {
  const router = useRouter();
  const { user } = useUserData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await axios.post("/user/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "CV";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="sidebar-footer">
      {/* User Profile Card */}
      <div className="sidebar-user" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="sidebar-user-avatar">
          {getInitials(user?.username || user?.email)}
        </div>

        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.username || "User"}</p>
          <p className="sidebar-user-role">{role} account</p>
        </div>

        <ChevronUp
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="mt-2 rounded-lg bg-gray-800 overflow-hidden border border-gray-700 shadow-lg animate-[slideDown_0.2s_ease-out]">
          <button
            onClick={() => {
              router.push("/dashboard/profile");
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <User size={16} />
            <span>Profile</span>
          </button>

          <button
            onClick={() => {
              router.push("/dashboard/settings");
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors border-t border-gray-700"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-colors border-t border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={16} />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-800 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1">Active</p>
            <p className="text-lg font-bold text-white">2</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1">Total</p>
            <p className="text-lg font-bold text-white">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}
