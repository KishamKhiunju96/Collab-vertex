import { User, Bell, Lock } from "lucide-react";
import { SettingsTab } from "./types";

export const SETTINGS_TABS = [
  {
    id: "profile" as SettingsTab,
    label: "Profile",
    icon: User,
    description: "Personal information",
  },
  {
    id: "notifications" as SettingsTab,
    label: "Notifications",
    icon: Bell,
    description: "Alert preferences",
  },
  {
    id: "security" as SettingsTab,
    label: "Security",
    icon: Lock,
    description: "Password & safety",
  },
] as const;

export const NOTIFICATION_OPTIONS = [
  {
    key: "emailNotifications" as const,
    title: "Email Notifications",
    description: "Receive notifications via email",
    icon: "📧",
  },
  {
    key: "newCollaborations" as const,
    title: "New Collaborations",
    description: "Get notified when influencers accept your invitations",
    icon: "🤝",
  },
  {
    key: "eventUpdates" as const,
    title: "Event Updates",
    description: "Receive updates about your events",
    icon: "📅",
  },
  {
    key: "influencerMessages" as const,
    title: "Influencer Messages",
    description: "Get notified when influencers send you messages",
    icon: "💬",
  },
  {
    key: "weeklyReports" as const,
    title: "Weekly Reports",
    description: "Receive weekly performance reports",
    icon: "📊",
  },
] as const;
