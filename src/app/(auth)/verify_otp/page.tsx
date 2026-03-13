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
} from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      setError("Invalid verification link. Redirecting to registration...");
      notify.error("Email not found. Please register again.");
      setTimeout(() => router.push("/register"), 3000);
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
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

      const response = await authService.verifyOtp({ email, otp: otpCode });

      if (response.success) {
        notify.success("Account verified successfully!");
        setVerified(true);
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      const msg = response.message || "OTP verification failed";
      setError(msg);
      notify.error(msg);
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
      notify.success("New OTP sent to your email!");

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

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (!username || username.length <= 2) return email;
    const masked =
      username[0] +
      "*".repeat(Math.min(username.length - 2, 4)) +
      username[username.length - 1];
    return `${masked}@${domain}`;
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verification Successful
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Your account has been verified.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to login...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">
            Verify Your Email
          </h1>
          <p className="text-indigo-100 text-sm mt-1">
            Enter the code we sent to your email
          </p>
        </div>

        <div className="p-6">
          {/* Email display */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Sent to</p>
              <p className="text-sm font-medium text-gray-900">
                {email ? maskEmail(email) : "***@***.com"}
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* OTP inputs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-digit code
            </label>
            <div className="flex justify-center gap-2">
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
                  disabled={loading}
                  className={`
                    w-11 h-12 text-center text-lg font-semibold rounded-lg border-2 
                    focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                    transition-colors
                    ${digit ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              ))}
            </div>
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            className="
              w-full py-3 bg-indigo-600 text-white font-medium rounded-lg
              hover:bg-indigo-700 transition-colors
              disabled:bg-gray-300 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Code
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={!canResend || resendLoading}
              className="
                text-indigo-600 font-medium text-sm
                hover:text-indigo-700 transition-colors
                disabled:text-gray-400 disabled:cursor-not-allowed
                inline-flex items-center gap-1
              "
            >
              {resendLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending...
                </>
              ) : canResend ? (
                <>
                  <RefreshCw className="w-3 h-3" />
                  Resend Code
                </>
              ) : (
                `Resend in ${countdown}s`
              )}
            </button>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-xs text-gray-400 text-center">
            Code expires in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
}