"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthProtection } from "@/api/hooks/useAuth";

import {
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  Calendar,
  Link as LinkIcon,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const navConfig = {
  brand: [
    {
      href: "/dashboard/brand",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/brand/events",
      label: "Manage Events",
      icon: Calendar,
    },
    {
      href: "/dashboard/brand/influencers",
      label: "Find Influencers",
      icon: Users,
    },
    {
      href: "/dashboard/brand/collaborations",
      label: "Collaborations",
      icon: Megaphone,
    },
    {
      href: "/dashboard/brand/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      href: "/dashboard/brand/settings",
      label: "Settings",
      icon: Settings,
    },
  ],

  influencer: [
    {
      href: "/dashboard/influencer",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/influencer/events",
      label: "My Events",
      icon: Calendar,
    },
    {
      href: "/dashboard/influencer/collaborations",
      label: "Collaborations",
      icon: Megaphone,
    },
    {
      href: "/dashboard/influencer/social-links",
      label: "Social Links",
      icon: LinkIcon,
    },
    {
      href: "/dashboard/influencer/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      href: "/dashboard/influencer/settings",
      label: "Settings",
      icon: Settings,
    },
  ],

  admin: [
    {
      href: "/dashboard/admin",
      label: "Admin Panel",
      icon: Shield,
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
    },
  ],
};

export default function SideBar() {
  const { role } = useAuthProtection();
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await fetch("/user/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
      router.push("/login");
    }
  };

  const navItems = role ? navConfig[role] ?? [] : [];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen text-text-primary w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 ">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">
              C
            </span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">
            Collab Vertex
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {role && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                CV
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
              <p className="text-xs text-muted-foreground">Account</p>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full justify-start gap-2",
              isLoggingOut
                ? "text-muted-foreground"
                : "text-red-400 hover:text-red-300"
            )}
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      )}
    </aside>
  );
}
