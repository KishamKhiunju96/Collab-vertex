"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authService } from "@/api/services/authService";
import { notify } from "@/utils/notify";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      setError("Invalid verification link. Redirecting to registration...");
      setTimeout(() => router.push("/register"), 3000);
    }
  }, [email, router]);

  // Handler for OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Verify OTP
      const response = await authService.verifyOtp({ email, otp });

      console.log("OTP verification response:", response);

      if (response.success) {
        setRedirecting(true);
        notify.success("Account verified successfully! Redirecting...");

        // Step 2: Try to get user role from response or fetch user profile
        let userRole = response.user?.role;

        // If role is not in response, try fetching user profile
        if (!userRole) {
          try {
            const userProfile = await authService.getMe();
            userRole = userProfile.role;
          } catch (fetchError) {
            console.error("Failed to fetch user profile:", fetchError);
            // If we can't get the role, redirect to login
            notify.info("Please log in to continue");
            setTimeout(() => router.push("/login"), 1500);
            return;
          }
        }

        // Step 3: Redirect based on user role with a slight delay for better UX
        setTimeout(() => {
          if (userRole === "brand") {
            router.push("/dashboard/brand");
          } else if (userRole === "influencer") {
            router.push("/dashboard/influencer");
          } else if (userRole === "admin") {
            router.push("/dashboard/admin");
          } else {
            // Fallback to login if role is unknown
            notify.info("Please log in to continue");
            router.push("/login");
          }
        }, 1500);
      } else {
        setError(response.message || "OTP verification failed");
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
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
    } finally {
      setLoading(false);
    }
  };

  // Handler for resending OTP
  const handleResendOtp = async () => {
    if (!email) {
      setError("Email is missing");
      return;
    }

    try {
      setResendLoading(true);
      setError("");

      await authService.resendOtp({ email });
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
    <div className="min-h-screen flex items-center justify-center bg-background-light">
      {redirecting ? (
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verification Successful!
          </h2>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      ) : (
        <form
          onSubmit={handleVerify}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Verify OTP</h2>

          <p className="text-sm text-gray-600 mb-6 text-center">
            An OTP has been sent to your email
            {email && (
              <>
                <br />
                <span className="font-medium">{maskEmail(email)}</span>
              </>
            )}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter your OTP"
            maxLength={6}
            className="w-full px-4 py-2 border rounded-lg mb-4 text-center text-lg tracking-widest"
            required
            autoFocus
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-60 font-semibold"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="w-full mt-4 text-green-600 font-medium hover:underline disabled:opacity-60"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </form>
      )}
    </div>
  );
}
