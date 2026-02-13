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
  category?: string;
};

export const navConfig: Record<UserRole, NavItem[]> = {
  brand: [
    {
      href: "/dashboard/brand",
      label: "Overview",
      icon: LayoutDashboard,
      category: "Main",
    },
    {
      href: "/dashboard/events",
      label: "All Events",
      icon: Calendar,
      category: "Main",
    },
    {
      href: "/dashboard/brand/events",
      label: "Manage Events",
      icon: Calendar,
      category: "Management",
    },
    {
      href: "/dashboard/brand/influencers",
      label: "Find Influencers",
      icon: Users,
      category: "Management",
    },
    {
      href: "/dashboard/brand/collaborations",
      label: "Collaborations",
      icon: Megaphone,
      category: "Management",
    },
    {
      href: "/dashboard/brand/analytics",
      label: "Analytics",
      icon: BarChart3,
      category: "Insights",
    },
    {
      href: "/dashboard/brand/settings",
      label: "Settings",
      icon: Settings,
      category: "Account",
    },
  ],

  influencer: [
    {
      href: "/dashboard/influencer",
      label: "Overview",
      icon: LayoutDashboard,
      category: "Main",
    },
    {
      href: "/dashboard/events",
      label: "All Events",
      icon: Calendar,
      category: "Main",
    },
    {
      href: "/dashboard/influencer/events",
      label: "My Events",
      icon: Calendar,
      category: "Management",
    },
    {
      href: "/dashboard/influencer/collaborations",
      label: "Collaborations",
      icon: Megaphone,
      category: "Management",
    },
    {
      href: "/dashboard/influencer/social-links",
      label: "Social Links",
      icon: LinkIcon,
      category: "Profile",
    },
    {
      href: "/dashboard/influencer/analytics",
      label: "Analytics",
      icon: BarChart3,
      category: "Insights",
    },
    {
      href: "/dashboard/influencer/settings",
      label: "Settings",
      icon: Settings,
      category: "Account",
    },
  ],

  admin: [
    {
      href: "/dashboard/admin",
      label: "Admin Panel",
      icon: Shield,
      category: "Main",
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
      category: "Management",
    },
  ],
};
