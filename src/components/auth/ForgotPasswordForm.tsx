"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { authService } from "@/api/services/authService";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Password strength calculator
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 1)
      return {
        score,
        label: "Weak",
        color: "text-red-600",
        bgColor: "bg-red-500",
      };
    if (score <= 3)
      return {
        score,
        label: "Fair",
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
      };
    if (score === 4)
      return {
        score,
        label: "Good",
        color: "text-blue-600",
        bgColor: "bg-blue-500",
      };
    return {
      score,
      label: "Strong",
      color: "text-green-600",
      bgColor: "bg-green-500",
    };
  };

  const passwordStrength = newPassword
    ? calculatePasswordStrength(newPassword)
    : null;

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password requirements
  const passwordRequirements = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    {
      label: "Contains uppercase & lowercase",
      test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
    },
    { label: "Contains a number", test: (p: string) => /\d/.test(p) },
    {
      label: "Contains special character",
      test: (p: string) => /[^a-zA-Z\d]/.test(p),
    },
  ];

  const validateForm = (): boolean => {
    const errors: {
      email?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (passwordStrength && passwordStrength.score < 2) {
      errors.newPassword = "Password is too weak. Please choose a stronger one";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        email: email.trim(),
        new_password: newPassword,
      });

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(
          error.message || "Failed to reset password. Please try again.",
        );
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-hero via-white to-background-alternate px-4 py-8 sm:py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow" />

        <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 relative z-10 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            Password Reset Successful!
          </h2>
          <p className="text-text-secondary mb-6">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Go to Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-text-muted mt-4">
            Redirecting to login page in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-hero via-white to-background-alternate px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-pulse-glow" />

      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 animate-fade-in-up">
        {/* Form side */}
        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
          <div className="w-full max-w-md mx-auto">
            {/* Back to Login Link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
                Reset Password
              </h1>
              <p className="text-text-secondary text-sm sm:text-base">
                Enter your email and create a new secure password for your{" "}
                <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent font-semibold">
                  Collab-Vertex
                </span>{" "}
                account
              </p>
            </div>

            {/* Error Alert */}
            {apiError && (
              <div className="mb-6 p-4 bg-status-errorBg border border-red-200 rounded-lg animate-fade-in">
                <p className="text-status-errorText text-sm font-medium flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  {apiError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className={`w-5 h-5 transition-colors ${
                        fieldErrors.email
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors({ ...fieldErrors, email: undefined });
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      fieldErrors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
                    } text-text-primary placeholder:text-text-muted`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`w-5 h-5 transition-colors ${
                        fieldErrors.newPassword
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setFieldErrors({
                        ...fieldErrors,
                        newPassword: undefined,
                      });
                    }}
                    placeholder="Enter new password"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      fieldErrors.newPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
                    } text-text-primary placeholder:text-text-muted`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-brand-primary transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && passwordStrength && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">
                        Password Strength:
                      </span>
                      <span
                        className={`font-semibold ${passwordStrength.color}`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.bgColor} transition-all duration-300`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {newPassword && (
                  <div className="space-y-1 pt-2 animate-fade-in">
                    {passwordRequirements.map((req, idx) => {
                      const passes = req.test(newPassword);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-xs transition-colors ${
                            passes ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {passes ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{req.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {fieldErrors.newPassword && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {fieldErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`w-5 h-5 transition-colors ${
                        fieldErrors.confirmPassword
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFieldErrors({
                        ...fieldErrors,
                        confirmPassword: undefined,
                      });
                    }}
                    placeholder="Confirm new password"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      fieldErrors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
                    } text-text-primary placeholder:text-text-muted`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-brand-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && newPassword && (
                  <div
                    className={`flex items-center gap-2 text-xs font-medium animate-fade-in ${
                      confirmPassword === newPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {confirmPassword === newPassword ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Passwords do not match
                      </>
                    )}
                  </div>
                )}

                {fieldErrors.confirmPassword && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-accent hover:to-brand-primary text-white font-semibold rounded-xl shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-accent/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
