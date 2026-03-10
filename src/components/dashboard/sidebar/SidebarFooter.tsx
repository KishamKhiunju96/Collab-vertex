"use client";

import { useState, useRef, useEffect } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);

  // close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

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
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts.length > 0 ? parts[0].substring(0, 2).toUpperCase() : "CV";
  };

  const displayName = user?.username || "User";
  const initials = getInitials(user?.username || user?.email);

  return (
    <div ref={menuRef} className="relative px-2 pb-3 pt-2">

      {/* Dropdown menu — sits above the trigger */}
      {isMenuOpen && (
        <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
          <button
            onClick={() => { router.push("/dashboard/profile"); setIsMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User className="w-4 h-4 text-gray-400" />
            Profile
          </button>

          <button
            onClick={() => { router.push("/dashboard/settings"); setIsMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            Settings
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-2" />

      {/* User card trigger */}
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
            {displayName}
          </p>
          <p className="text-[11px] text-gray-500 capitalize leading-tight mt-0.5">
            {role}
          </p>
        </div>

        {/* Chevron */}
        <ChevronUp
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isMenuOpen ? "" : "rotate-180"
          }`}
        />
      </button>
    </div>
  );
}