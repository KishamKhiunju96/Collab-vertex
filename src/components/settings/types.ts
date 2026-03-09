// Settings types
export type SettingsTab = "profile" | "notifications" | "security";

export interface ProfileData {
  username: string;
  email: string;
  company: string;
  website: string;
  bio: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newCollaborations: boolean;
  eventUpdates: boolean;
  influencerMessages: boolean;
  weeklyReports: boolean;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordStrength {
  label: string;
  color: string;
  width: string;
}
