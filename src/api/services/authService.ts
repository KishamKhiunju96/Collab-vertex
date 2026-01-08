import { API_PATHS } from "@/api/apiPaths";
import api from "../axiosInstance";


export const authService = {
  login: (data: { usernameOrEmail: string; password: string }) =>
    api.post(API_PATHS.AUTH.LOGIN, data),
  register: (data: { username: string; dateOfBirth: Date; name: string; password: string; email: string; phoneNumber: string; role: string }) =>
    api.post(API_PATHS.AUTH.REGISTER, data),
  verifyOtp: (data: {userId: string, otp: string}) => api.post (API_PATHS.AUTH.VERIFY_OTP, data),
};


