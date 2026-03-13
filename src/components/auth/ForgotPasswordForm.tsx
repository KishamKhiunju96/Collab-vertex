"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { authService } from "@/api/services/authService";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bg: string;
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

  const getStrength = (pw: string): PasswordStrength => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^a-zA-Z\d]/.test(pw)) s++;

    if (s <= 1) return { score: s, label: "Weak", color: "text-red-600", bg: "bg-red-500" };
    if (s <= 3) return { score: s, label: "Fair", color: "text-amber-600", bg: "bg-amber-500" };
    if (s === 4) return { score: s, label: "Good", color: "text-blue-600", bg: "bg-blue-500" };
    return { score: s, label: "Strong", color: "text-green-600", bg: "bg-green-500" };
  };

  const strength = newPassword ? getStrength(newPassword) : null;

  const requirements = [
    { label: "8+ characters", check: (p: string) => p.length >= 8 },
    { label: "Upper & lowercase", check: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
    { label: "A number", check: (p: string) => /\d/.test(p) },
    { label: "Special character", check: (p: string) => /[^a-zA-Z\d]/.test(p) },
  ];

  const validate = () => {
    const err: typeof fieldErrors = {};
    if (!email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Invalid email";

    if (!newPassword) err.newPassword = "Password is required";
    else if (newPassword.length < 8) err.newPassword = "Min 8 characters";
    else if (strength && strength.score < 2) err.newPassword = "Too weak";

    if (!confirmPassword) err.confirmPassword = "Confirm your password";
    else if (newPassword !== confirmPassword) err.confirmPassword = "Doesn't match";

    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.resetPassword({ email: email.trim(), new_password: newPassword });
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Success Screen ──
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Password Updated</h2>
          <p className="text-sm text-gray-500 mb-7 leading-relaxed">
            All set. You can now log in with your new password.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign in
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-gray-400 mt-4">Redirecting in 3 seconds…</p>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[920px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center bg-gray-900 p-10 relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }} />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-8">
              <KeyRound className="w-5 h-5 text-indigo-400" />
            </div>

            <h2 className="text-2xl font-bold text-white leading-tight mb-3">
              Reset your<br />password
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Pick something memorable for you but tough for anyone else to figure out.
            </p>

            <div className="space-y-4">
              {[
                { dot: "bg-indigo-500", text: "Mix uppercase, lowercase, numbers & symbols" },
                { dot: "bg-violet-500", text: "Don't reuse passwords across services" },
                { dot: "bg-purple-400", text: "Consider a password manager" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                  <span className="text-gray-300 text-[13px] leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">

            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors mb-7">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>

            <h1 className="text-[22px] font-bold text-gray-900 mb-1">Create new password</h1>
            <p className="text-sm text-gray-500 mb-7">Enter your email and pick a new password.</p>

            {apiError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-[13px] text-red-700 leading-snug">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="fp-email" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${fieldErrors.email ? "text-red-400" : "text-gray-400"}`} />
                  <input
                    id="fp-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="abcd@gmail.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 border rounded-lg outline-none transition-shadow ${
                      fieldErrors.email
                        ? "border-red-300 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
              </div>

              {/* New password */}
              <div>
                <label htmlFor="fp-newpw" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${fieldErrors.newPassword ? "text-red-400" : "text-gray-400"}`} />
                  <input
                    id="fp-newpw"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setFieldErrors((p) => ({ ...p, newPassword: undefined })); }}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 border rounded-lg outline-none transition-shadow ${
                      fieldErrors.newPassword
                        ? "border-red-300 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* strength bar */}
                {newPassword && strength && (
                  <div className="mt-2.5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Strength</span>
                      <span className={`text-[10px] uppercase tracking-wide font-bold ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="h-[3px] w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${strength.bg} transition-all duration-300`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* requirements */}
                {newPassword && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2.5">
                    {requirements.map((r, i) => {
                      const ok = r.check(newPassword);
                      return (
                        <span key={i} className={`flex items-center gap-1.5 text-[11px] ${ok ? "text-green-600" : "text-gray-400"}`}>
                          {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {r.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {fieldErrors.newPassword && <p className="text-xs text-red-600 mt-1">{fieldErrors.newPassword}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="fp-confirm" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <ShieldCheck className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${fieldErrors.confirmPassword ? "text-red-400" : "text-gray-400"}`} />
                  <input
                    id="fp-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: undefined })); }}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 border rounded-lg outline-none transition-shadow ${
                      fieldErrors.confirmPassword
                        ? "border-red-300 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {confirmPassword && newPassword && (
                  <p className={`flex items-center gap-1.5 text-[11px] font-medium mt-1.5 ${confirmPassword === newPassword ? "text-green-600" : "text-red-500"}`}>
                    {confirmPassword === newPassword ? <><CheckCircle2 className="w-3 h-3" /> Matches</> : <><XCircle className="w-3 h-3" /> Doesn&apos;t match</>}
                  </p>
                )}

                {fieldErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting…
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[13px] text-gray-400 mt-6">
              Remember it?{" "}
              <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}