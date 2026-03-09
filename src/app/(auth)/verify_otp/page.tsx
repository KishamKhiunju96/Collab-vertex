"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { authService } from "@/api/services/authService";
import { notify } from "@/utils/notify";
import {
  Mail,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      setError("Invalid verification link. Redirecting to registration...");
      notify.error("Email not found. Please register again.");
      setTimeout(() => router.push("/register"), 3000);
    }
  }, [email, router]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Handle OTP input change — NO auto-submit
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input only
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and Enter
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      const otpString = otp.join("");
      if (otpString.length === 6) {
        handleVerify();
      }
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = ["", "", "", "", "", ""];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  // Helper to safely extract role from unknown response shape
  const extractRole = (obj: unknown): string | null => {
    if (!obj || typeof obj !== "object") return null;

    const data = obj as Record<string, unknown>;

    // Check direct role
    if (typeof data.role === "string") return data.role;

    // Check user.role
    if (
      data.user &&
      typeof data.user === "object" &&
      typeof (data.user as Record<string, unknown>).role === "string"
    ) {
      return (data.user as Record<string, unknown>).role as string;
    }

    // Check data.role
    if (
      data.data &&
      typeof data.data === "object" &&
      typeof (data.data as Record<string, unknown>).role === "string"
    ) {
      return (data.data as Record<string, unknown>).role as string;
    }

    // Check data.user.role
    if (data.data && typeof data.data === "object") {
      const nestedData = data.data as Record<string, unknown>;
      if (
        nestedData.user &&
        typeof nestedData.user === "object" &&
        typeof (nestedData.user as Record<string, unknown>).role === "string"
      ) {
        return (nestedData.user as Record<string, unknown>).role as string;
      }
    }

    return null;
  };

  // Redirect user based on role
  const redirectToDashboard = (role: string) => {
    setRedirecting(true);

    setTimeout(() => {
      switch (role) {
        case "brand":
          notify.success("Welcome to Brand Dashboard! ");
          router.push("/dashboard/brand");
          break;
        case "influencer":
          notify.success("Welcome to Influencer Dashboard! ");
          router.push("/dashboard/influencer");
          break;
        case "admin":
          notify.success("Welcome Admin! ");
          router.push("/dashboard/admin");
          break;
        default:
          notify.info("Please log in to continue");
          router.push("/login");
          break;
      }
    }, 2000);
  };

  // Handler for OTP verification — only on button click or Enter
  const handleVerify = async () => {
    const otpCode = otp.join("");
    setError("");

    if (!email) {
      setError("Email is missing. Please register again.");
      notify.error("Email not found");
      return;
    }

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      notify.info("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);

      // Verify OTP
      const response = await authService.verifyOtp({ email, otp: otpCode });
      console.log("OTP verification response:", response);

      if (response.success) {
        notify.success("✅ Account verified! Please log in to continue.");
        setRedirecting(true);

        // Always redirect to login after successful OTP verification
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const msg =
          (response as unknown as Record<string, string>).message ||
          "OTP verification failed";
        setError(msg);
        notify.error(msg);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Invalid or expired OTP";
      setError(errorMessage);
      notify.error(errorMessage);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Handler for resending OTP
  const handleResendOtp = async () => {
    if (!email) {
      setError("Email is missing");
      notify.error("Email not found");
      return;
    }

    if (!canResend) {
      notify.info(`Please wait ${countdown} seconds before resending`);
      return;
    }

    try {
      setResendLoading(true);
      setError("");

      await authService.resendOtp({ email });
      notify.success("New OTP sent to your email! 📧");

      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to resend OTP";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Mask email for display
  const maskEmail = (email: string) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (!username || username.length <= 2) return email;
    const masked =
      username[0] +
      "*".repeat(username.length - 2) +
      username[username.length - 1];
    return `${masked}@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-hero via-white to-background-alternate px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {redirecting ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center border-2 border-green-200">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-green-300 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Verification Successful!
            </h2>
            <p className="text-text-secondary mb-6">
              🎉 Your account has been verified successfully
            </p>

            <div className="flex items-center justify-center gap-2 text-brand-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">
                Redirecting to your dashboard...
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary p-8 sm:p-10 text-white">
              <div className="absolute inset-0 bg-grid-white bg-grid-md opacity-10"></div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
                  Verify Your Email
                </h1>
                <p className="text-white/90 text-center text-sm">
                  We&apos;ve sent a 6-digit code to
                </p>
              </div>
            </div>

            {/* Email Display */}
            <div className="px-6 sm:px-10 -mt-6 relative z-10">
              <div className="bg-white rounded-xl shadow-lg border-2 border-border-subtle p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted font-medium">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {email ? maskEmail(email) : "***@***.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-10 pt-6">
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fade-in">
                  <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              {/* OTP Input Fields */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-4 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 ${
                        digit
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-border-subtle"
                      }`}
                      disabled={loading}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted text-center mt-3">
                  💡 Tip: You can paste the entire code at once
                </p>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={loading || otp.join("").length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-accent hover:to-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-accent/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-text-muted">
                    Didn&apos;t receive the code?
                  </span>
                </div>
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={!canResend || resendLoading}
                  className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Resending...</span>
                    </>
                  ) : canResend ? (
                    <>
                      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                      <span>Resend Code</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Resend in {countdown}s</span>
                    </>
                  )}
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-gradient-to-r from-background-hero to-background-alternate rounded-xl border border-border-subtle">
                <p className="text-xs text-text-muted text-center">
                  🔒 This code will expire in 10 minutes. Keep this window open
                  until verified.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}