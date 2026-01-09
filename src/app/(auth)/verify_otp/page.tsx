"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Invalid verification request");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/verify-otp", {
        userId,
        otp,
      });

      router.push("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    if (!userId) {
      alert("Invalid request");
      return;
    }

    try {
      setResendLoading(true);

      await axios.post(
        "https://w4gwd5wf-8000.inc1.devtunnels.ms/otp/resend_otp",
        {
          userId,
        },
      );

      alert("OTP resent successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleVerify}
        className="bg-background-light p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter your OTP"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendLoading}
          className="w-full mt-4 text-green-600 font-medium hover:underline disabled:opacity-60"
        >
          {resendLoading ? "Resending OTP..." : "Resend OTP"}
        </button>
      </form>
    </div>
  );
}
