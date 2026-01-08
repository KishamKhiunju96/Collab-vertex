"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Invalid verrification request");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/verify-otp", {
        userId,
        otp,
      });

      router.push("/register");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleVerify}
        className="bg-background-light p-8 rounded xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center"> Verify OTP</h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter your OTP"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          required
        ></input>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-text-promary  py-2 rounded-lg hover:bg-green-600 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
