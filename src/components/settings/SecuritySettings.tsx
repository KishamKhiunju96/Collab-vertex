"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, Trash2 } from "lucide-react";
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
      // TODO: Replace with actual API call
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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Account deleted");
      window.location.href = "/";
    } catch (error) {
      notify.error("Failed to delete account");
    }
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-500">
                Ensure your account uses a strong, unique password
              </p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 sm:px-8 py-6">
          <div className="space-y-5">
            {/* Current Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl
                    focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                    outline-none transition-all duration-200
                    hover:border-gray-300 text-gray-900 placeholder-gray-400
                    bg-gray-50 focus:bg-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl
                    focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                    outline-none transition-all duration-200
                    hover:border-gray-300 text-gray-900 placeholder-gray-400
                    bg-gray-50 focus:bg-white"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {passwordData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">
                      Password strength
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength.label === "Weak"
                          ? "text-red-500"
                          : passwordStrength.label === "Fair"
                          ? "text-orange-500"
                          : passwordStrength.label === "Good"
                          ? "text-yellow-600"
                          : "text-green-500"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-600 transition-colors">
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
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl
                    focus:ring-4 outline-none transition-all duration-200
                    text-gray-900 placeholder-gray-400
                    bg-gray-50 focus:bg-white
                    ${
                      passwordData.confirmPassword &&
                      passwordData.confirmPassword !==
                        passwordData.newPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : passwordData.confirmPassword &&
                          passwordData.confirmPassword ===
                            passwordData.newPassword
                        ? "border-green-300 focus:border-green-500 focus:ring-green-500/10"
                        : "border-gray-200 focus:border-red-500 focus:ring-red-500/10 hover:border-gray-300"
                    }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {passwordData.confirmPassword &&
                passwordData.confirmPassword !==
                  passwordData.newPassword && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span>⚠</span> Passwords do not match
                  </p>
                )}
              {passwordData.confirmPassword &&
                passwordData.confirmPassword ===
                  passwordData.newPassword && (
                  <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                    <CheckCircle size={12} /> Passwords match
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={handlePasswordChange}
            disabled={isSaving}
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-gradient-to-r from-red-500 to-red-600 text-white
              rounded-xl font-semibold text-sm
              hover:from-red-600 hover:to-red-700
              active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30
            "
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Lock size={18} />
            )}
            {isSaving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>

      {/* Danger Zone - Commented out in original, included here for completeness */}
      {/* Uncomment to enable account deletion */}
      {/* 
      <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-700">
                Danger Zone
              </h2>
              <p className="text-sm text-red-400">
                Irreversible and destructive actions
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Delete your account
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Once you delete your account, there is no going back.
                All your data, brands, and collaborations will be
                permanently removed.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="
                inline-flex items-center gap-2 px-5 py-2.5
                bg-white text-red-600 border-2 border-red-200
                rounded-xl font-semibold text-sm
                hover:bg-red-600 hover:text-white hover:border-red-600
                active:scale-[0.98]
                transition-all duration-200 flex-shrink-0
              "
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
      */}
    </div>
  );
}
