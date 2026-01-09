import { API_PATHS } from "@/api/apiPaths";
import api from "../axiosInstance";

export const authService = {
  login: (data: { username: string; password: string }) =>
    api.post(API_PATHS.USER.LOGIN, data),
  register: (data: {
    username: string;
    password: string;
    email: string;
    role: string;
  }) => api.post(API_PATHS.USER.REGISTER, data),
  verifyOtp: (data: { email: string; otp: string }) =>
    api.post(API_PATHS.USER.VERIFY_OTP, data),
  resendOtp: (data: { email: string }) =>
    api.post("/otp/resend_otp", data),
};
