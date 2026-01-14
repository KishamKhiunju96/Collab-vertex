export const BASE_URL = "https://w4gwd5wf-8000.inc1.devtunnels.ms";

export const API_PATHS = {
  USER: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    ME: "/user/me",
    VERIFY_OTP: "/otp/verify_otp",
    RESEND_OTP: "/otp/resend_otp",
    LOGOUT: "/user/logout",
  },
  BRAND: {
    CREATE_PROFILE: "/brand/create_brandprofile",
    GET_PROFILE: "/brand/get_brandprofile",
    UPDATE_PROFILE: "/brand/update_brandprofile",
  },
  TASKS: {
    GET_ALL: "/tasks",
    GET_BY_ID: (id: string) => `/tasks/${id}`,
    CREATE: "/tasks",
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
} as const;
