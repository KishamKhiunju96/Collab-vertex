export const BASE_URL = "https://api.dixam.me";

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
    DELETE_PROFILE: "/brand/delete_brandprofile",

    GET_BRANDS_BY_USER: "/brand/brandsbyuser",
  },

  EVENT: {
    CREATE: (brandId: string) => `/event/create_event${brandId}`,
  },

  TASKS: {
    GET_ALL: "/tasks",
    GET_BY_ID: (id: string) => `/tasks/${id}`,
    CREATE: "/tasks",
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
} as const;
