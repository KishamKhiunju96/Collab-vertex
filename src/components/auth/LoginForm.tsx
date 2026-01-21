"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService, UserProfile } from "@/api/services/authService";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    if (!username || !password) {
      setApiError("Username and password are required");
      setIsLoading(false);
      return;
    }

    try {
      await authService.login({ username, password });

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
      } else {
        router.replace("/select-role");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error instanceof Error) setApiError(error.message);
      else setApiError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-12 flex flex-col justify-center">
          <h1 className="text-4xl text-center font-bold text-text-primary mb-8">
            Login to Collab-Vertex
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-green-400 text-text-primary rounded-lg focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div>
              <label className="block text-sm text-text-primary font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-2 pr-12 border border-green-400 text-text-primary rounded-lg focus:ring-2 focus:ring-green-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xl"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-text-primary">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded text-text-primary"
                />
                <span className="ml-2 text-sm">Remember me</span>
              </label>

              <a href="#" className="text-sm text-red-400 hover:underline">
                Forgot Password
              </a>
            </div>

            {apiError && (
              <p className="text-red-600 font-medium text-center">{apiError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-400 hover:bg-green-300 font-semibold rounded-lg disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-text-primary text-sm">
              Do not have an account?
              <a
                href="/register"
                className="text-indigo-600 px-2 font-medium hover:underline"
              >
                Register
              </a>
            </p>
          </form>
        </div>

        <div className="hidden md:flex relative h-full w-full">
          <Image
            src="/images/collabR.jpg"
            alt="Login background illustration"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>
    </div>
  );
}
