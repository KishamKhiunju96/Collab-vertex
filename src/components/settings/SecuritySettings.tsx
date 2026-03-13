"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { PasswordData } from "./types";
import { getPasswordStrength, validatePassword, validatePasswordsMatch } from "./utils";
import { notify } from "@/utils/notify";

export default function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  const handlePasswordChange = async () => {
    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.valid) {
      notify.error(passwordValidation.message!);
      return;
    }

    const matchValidation = validatePasswordsMatch(
      passwordData.newPassword,
      passwordData.confirmPassword
    );
    if (!matchValidation.valid) {
      notify.error(matchValidation.message!);
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      notify.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    const doubleConfirm = confirm(
      "This will permanently delete all your data, brands, and collaborations. Are you absolutely sure?"
    );
    if (!doubleConfirm) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Account deleted");
      window.location.href = "/";
    } catch (error) {
      notify.error("Failed to delete account");
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Lock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-500">
                Ensure your account uses a strong, unique password
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6 sm:px-8">
          {/* Current Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Strength */}
            {passwordData.newPassword && (
              <div className="mt-2.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Password strength
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.label === "Weak"
                        ? "text-red-600"
                        : passwordStrength.label === "Fair"
                        ? "text-orange-600"
                        : passwordStrength.label === "Good"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className={`w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-2 ${
                  passwordData.confirmPassword &&
                  passwordData.confirmPassword !== passwordData.newPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : passwordData.confirmPassword &&
                      passwordData.confirmPassword === passwordData.newPassword
                    ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                    : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordData.confirmPassword &&
              passwordData.confirmPassword !== passwordData.newPassword && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <span>⚠</span> Passwords do not match
                </p>
              )}
            {passwordData.confirmPassword &&
              passwordData.confirmPassword === passwordData.newPassword && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle className="h-3 w-3" /> Passwords match
                </p>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
          <button
            onClick={handlePasswordChange}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {isSaving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}