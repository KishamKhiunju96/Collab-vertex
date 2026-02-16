"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { authService } from "@/api/services/authService";
import { handleRegister } from "@/api/services/registerService";
import { RegisterResponse } from "@/types/aauth";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "brand" | "influencer";
}

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "brand",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: "", color: "" });

  // Read role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("pendingUserRole");
    if (savedRole === "brand" || savedRole === "influencer") {
      setForm((prev) => ({ ...prev, role: savedRole }));
    } else {
      // If no valid role in localStorage, redirect to select-role
      router.replace("/select-role");
    }
  }, [router]);

  useEffect(() => {
    if (form.role !== "brand" && form.role !== "influencer") {
      router.replace("/select-role");
    }
  }, [form.role, router]);

  // Password strength calculator
  useEffect(() => {
    if (!form.password) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    let score = 0;
    const password = form.password;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z\d]/.test(password)) score += 1;

    const strengthMap = [
      { score: 0, label: "", color: "" },
      { score: 1, label: "Very Weak", color: "bg-red-500" },
      { score: 2, label: "Weak", color: "bg-orange-500" },
      { score: 3, label: "Fair", color: "bg-yellow-500" },
      { score: 4, label: "Good", color: "bg-green-500" },
      { score: 5, label: "Strong", color: "bg-green-600" },
      { score: 6, label: "Very Strong", color: "bg-green-700" },
    ];

    setPasswordStrength(strengthMap[Math.min(score, 6)]);
  }, [form.password]);

  const formSchema = z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain uppercase, lowercase & number",
        ),
      confirmPassword: z.string(),
      role: z.enum(["brand", "influencer"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as string;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const data: RegisterResponse = await authService.register(payload);
      handleRegister(data);

      router.push(`/verify_otp?email=${encodeURIComponent(form.email)}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(
          err.response?.data?.message || err.message || "Registration failed",
        );
      } else {
        setApiError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      met: form.password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(form.password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(form.password),
    },
    {
      label: "Contains number",
      met: /\d/.test(form.password),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-hero via-white to-background-alternate px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-pulse-glow" />

      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 animate-fade-in-up">
        {/* Image side */}
        <div className="relative h-64 lg:h-auto min-h-[400px] lg:min-h-[800px] order-1 lg:order-1">
          <Image
            src="/images/collabR.jpg"
            alt="Register on Collab-Vertex"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/60 via-brand-primary/40 to-brand-accent/30" />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
            <div className="max-w-md space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
                Start Your Journey Today
              </h2>
              <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">
                Join as a{" "}
                <span className="font-bold capitalize">{form.role}</span> and
                unlock endless collaboration opportunities
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Free to Join</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-2 overflow-y-auto max-h-screen lg:max-h-none">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                Create Account
              </h1>
              <p className="text-text-secondary text-sm sm:text-base">
                Registering as{" "}
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent font-bold capitalize">
                  {form.role}
                </span>
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
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User
                      className={`w-5 h-5 transition-colors ${
                        errors.username
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    placeholder="Choose a username"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.username
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
                    } text-text-primary placeholder:text-text-muted`}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {errors.username}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className={`w-5 h-5 transition-colors ${
                        errors.email
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
                    } text-text-primary placeholder:text-text-muted`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {errors.email}
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
                        errors.password
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Create a strong password"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.password
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

                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.score / 6) * 100}%`,
                          }}
                        />
                      </div>
                      {passwordStrength.label && (
                        <span className="text-xs font-medium text-text-muted">
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          {req.met ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-300" />
                          )}
                          <span
                            className={`${
                              req.met ? "text-green-600" : "text-text-muted"
                            } transition-colors`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`w-5 h-5 transition-colors ${
                        errors.confirmPassword
                          ? "text-red-500"
                          : "text-text-muted group-focus-within:text-brand-primary"
                      }`}
                    />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
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
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="pt-2">
                <p className="text-xs text-text-muted text-center">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-brand-primary hover:text-brand-accent font-medium transition-colors underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-brand-primary hover:text-brand-accent font-medium transition-colors underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-accent hover:from-brand-accent hover:via-brand-primary hover:to-brand-secondary text-white font-semibold rounded-xl shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-accent/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
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
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-text-primary font-medium hover:text-brand-primary transition-colors group"
                >
                  <span>Sign in instead</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
