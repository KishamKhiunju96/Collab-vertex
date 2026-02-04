import { API_PATHS } from "@/api/apiPaths";
import api from "../axiosInstance";
import { notify } from "@/utils/notify";
import axios from "axios";
import toast from "react-hot-toast";
import { RegisterResponse, UserProfile, VerifyOtpResponse } from "@/types/aauth";

// ------------------ Helper ------------------
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

// ------------------ Auth Service ------------------
export const authService = {
  login: async (data: { username: string; password: string }): Promise<boolean> => {
    const toastId = notify.loading("Logging in...");

    try {
      await api.post(API_PATHS.USER.LOGIN, data);
      // Backend sets HttpOnly cookie
      notify.success("Login successful");
      window.location.replace("/dashboard");
      return true;
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Login failed. Please try again."));
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  },

  getMe: async (): Promise<UserProfile> => {
    try {
      const res = await api.get<UserProfile>(API_PATHS.USER.ME);
      return res.data;
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Failed to fetch user profile"));
      throw error;
    }
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    role: "brand" | "influencer";
  }): Promise<RegisterResponse> => {
    const toastId = notify.loading("Creating account...");

    try {
      const res = await api.post<RegisterResponse>(API_PATHS.USER.REGISTER, data);
      notify.success("Registration successful. Please verify OTP.");
      return res.data;
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Registration failed"));
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  },

  verifyOtp: async (data: { email: string; otp: string }): Promise<VerifyOtpResponse> => {
    const toastId = notify.loading("Verifying OTP...");

    try {
      const res = await api.post<VerifyOtpResponse>(API_PATHS.USER.VERIFY_OTP, data);
      notify.success("OTP verified successfully");
      return res.data;
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Invalid OTP"));
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  },

  resendOtp: async (data: { email: string }): Promise<void> => {
    try {
      await api.post("/otp/resend_otp", data);
      notify.success("OTP resent successfully");
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Failed to resend OTP"));
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(API_PATHS.USER.LOGOUT); // optional backend logout
      notify.success("Logged out successfully");
    } catch {
      // ignore errors
    } finally {
      window.location.replace("/login");
    }
  },
};
