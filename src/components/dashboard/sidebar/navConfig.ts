import {
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  Calendar,
  Link as LinkIcon,
  Shield,
} from "lucide-react";

export type UserRole = "brand" | "influencer" | "admin";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export const navConfig: Record<UserRole, NavItem[]> = {
  brand: [
    { href: "/dashboard/brand", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/events", label: "All Events", icon: Calendar },
    { href: "/dashboard/brand/events", label: "Manage Events", icon: Calendar },
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
    { href: "/dashboard/influencer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/events", label: "All Events", icon: Calendar },
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
    { href: "/dashboard/admin", label: "Admin Panel", icon: Shield },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
  ],
};
