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
    if (!name || typeof name !== "string") return "CV";
    
    const parts = name.split(" ").filter((n) => n.length > 0);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts.length > 0 ? parts[0].substring(0, 2).toUpperCase() : "CV";
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
          className={`text-slate-400 transition-all duration-300 relative z-10 ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="mt-3 rounded-xl bg-white/95 backdrop-blur-lg overflow-hidden border border-button-primary-DEFAULT/20 shadow-xl shadow-button-primary-DEFAULT/10 animate-[slideDown_0.3s_ease-out]">
          <button
            onClick={() => {
              router.push("/dashboard/profile");
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-text-primary hover:bg-gradient-to-r hover:from-button-primary-DEFAULT/10 hover:to-brand-accent-DEFAULT/10 transition-all duration-200 group"
          >
            <User size={16} className="text-brand-secondary-DEFAULT group-hover:scale-110 transition-transform" />
            <span className="font-medium">Profile</span>
          </button>

          <button
            onClick={() => {
              router.push("/dashboard/settings");
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-text-primary hover:bg-gradient-to-r hover:from-button-primary-DEFAULT/10 hover:to-brand-accent-DEFAULT/10 transition-all duration-200 border-t border-button-primary-DEFAULT/20 group"
          >
            <Settings size={16} className="text-brand-highlight-DEFAULT group-hover:scale-110 transition-transform" />
            <span className="font-medium">Settings</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-text-error hover:bg-brand-accent-DEFAULT/10 transition-all duration-200 border-t border-button-primary-DEFAULT/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-button-primary-DEFAULT/20">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gradient-to-br from-button-primary-DEFAULT/10 to-brand-secondary-DEFAULT/5 rounded-xl p-3 border border-button-primary-DEFAULT/20 hover:border-button-primary-DEFAULT/40 transition-all duration-200 cursor-pointer group">
            <p className="text-xs text-text-muted mb-1 font-medium">Active</p>
            <p className="text-lg font-bold bg-gradient-to-br from-brand-primary-400 to-brand-secondary-DEFAULT bg-clip-text text-transparent group-hover:scale-110 transition-transform">2</p>
          </div>
          <div className="bg-gradient-to-br from-brand-accent-DEFAULT/10 to-brand-highlight-DEFAULT/5 rounded-xl p-3 border border-brand-accent-DEFAULT/20 hover:border-brand-accent-DEFAULT/40 transition-all duration-200 cursor-pointer group">
            <p className="text-xs text-text-muted mb-1 font-medium">Total</p>
            <p className="text-lg font-bold bg-gradient-to-br from-brand-accent-light to-brand-highlight-DEFAULT bg-clip-text text-transparent group-hover:scale-110 transition-transform">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}
