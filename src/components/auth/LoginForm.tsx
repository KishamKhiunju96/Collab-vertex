"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { authService, UserProfile } from "@/api/services/authService";
import { useUser } from "@/context/UserContext";

export default function LoginForm() {
  const router = useRouter();
  const { refetch } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      errors.password = "Password is required";
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
      await authService.login({ username, password });
      await refetch();

      const user: UserProfile = await authService.getMe();

      if (!user?.role) {
        setApiError("Failed to retrieve user role.");
        setIsLoading(false);
        return;
      }

      if (user.role === "brand") {
        router.replace("/dashboard/brand");
      } else if (user.role === "influencer") {
        router.replace("/dashboard/influencer");
      } else if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/select-role");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error instanceof Error) setApiError(error.message);
      else setApiError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
                Welcome Back
              </h1>
              <p className="text-text-secondary text-sm sm:text-base">
                Sign in to continue your journey with{" "}
                <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent font-semibold">
                  Collab-Vertex
                </span>
              </p>
            </div>

            {/* Error Alert */}
            {apiError && (
              <div className="mb-6 p-4 bg-status-errorBg border border-red-200 rounded-lg animate-fade-in">
                <p className="text-status-errorText text-sm font-medium flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {apiError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User
                      className={`w-5 h-5 transition-colors ${
                        fieldErrors.username
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setFieldErrors({ ...fieldErrors, username: undefined });
                    }}
                    placeholder="Enter your username"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      fieldErrors.username
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
                    } text-text-primary placeholder:text-text-muted`}
                  />
                </div>
                {fieldErrors.username && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {fieldErrors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`w-5 h-5 transition-colors ${
                        fieldErrors.password
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors({ ...fieldErrors, password: undefined });
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      fieldErrors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
                    } text-text-primary placeholder:text-text-muted`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-brand-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-border-subtle text-brand-primary focus:ring-2 focus:ring-brand-primary/20 cursor-pointer transition-all"
                  />
                  <span className="ml-2 text-text-secondary group-hover:text-text-primary transition-colors">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-brand-primary hover:text-brand-accent font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-accent after:transition-all hover:after:w-full"
                >
                  Forgot Password?
                </Link>
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-text-muted">
                    New to Collab-Vertex?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-text-primary font-medium hover:text-brand-primary transition-colors group"
                >
                  <span>Create an account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Image side */}
        <div className="relative h-64 lg:h-auto min-h-[400px] lg:min-h-[700px] order-1 lg:order-2">
          <Image
            src="/images/collabR.jpg"
            alt="Login to Collab-Vertex"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/60 via-brand-accent/40 to-brand-secondary/30" />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
            <div className="max-w-md space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
                Connect. Collaborate. Succeed.
              </h2>
              <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">
                Join thousands of brands and influencers creating amazing
                partnerships
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
