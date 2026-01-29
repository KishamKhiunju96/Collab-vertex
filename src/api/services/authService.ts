import { API_PATHS } from "@/api/apiPaths";
import api from "../axiosInstance";
import { notify } from "@/utils/notify";
import axios from "axios";
import toast from "react-hot-toast";
import { clearToken, saveToken } from "@/utils/auth";

export interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  role: "brand" | "influencer" | "admin";
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const toastId = notify.loading("Logging in...");

    try {
      const res = await api.post(API_PATHS.USER.LOGIN, data);
      const { access_token } = res.data;

      if (!access_token) {
        throw new Error("Access token not found in login response");
      }

      // Save token in cookie for axios instance
      saveToken(access_token);
      notify.success("Login successful");

      // Force reload to ensure axios picks up the new token for subsequent requests
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
      const res = await api.get(API_PATHS.USER.ME);
      return res.data;
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Failed to fetch user profile"));
      throw error;
    }
  },

  register: async (data: {
    username: string;
    password: string;
    email: string;
    role: string;
  }) => {
    const toastId = notify.loading("Creating account...");

    try {
      const res = await api.post(API_PATHS.USER.REGISTER, data);
      notify.success("Registration successful. Please verify OTP.");
      return res;
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Registration failed"));
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const toastId = notify.loading("Verifying OTP...");

    try {
      const res = await api.post(API_PATHS.USER.VERIFY_OTP, data);
      notify.success("OTP verified successfully");
      return res;
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Invalid OTP"));
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  },

  resendOtp: async (data: { email: string }) => {
    try {
      await api.post("/otp/resend_otp", data);
      notify.success("OTP resent successfully");
    } catch (error: unknown) {
      notify.error(getErrorMessage(error, "Failed to resend OTP"));
      throw error;
    }
  },

  logout: async () => {
    try {
      clearToken();
      notify.success("Logged out successfully");
      window.location.replace("/login");
    } catch {
      clearToken();
      window.location.replace("/login");
    }
  },
};
