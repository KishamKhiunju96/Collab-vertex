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
    CREATE: (brandId: string) => `/event/create_event/${brandId}`,
    GET_BY_BRAND: (brandId: string) => `/event/eventsbybrand/${brandId}`,
    UPDATE: (eventId: string) => `/event/update_event/${eventId}`,
    DELETE: (eventId: string) => `/event/delete_event/${eventId}`,
  },

  TASKS: {
    GET_ALL: "/tasks",
    GET_BY_ID: (id: string) => `/tasks/${id}`,
    CREATE: "/tasks",
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },

  INFLUENCER: {
    CREATE_SOCIAL_LINK: "/influencer/create_sociallink",
    GET_SOCIAL_LINKS: "/influencer/get_sociallinks",
    UPDATE_SOCIAL_LINK: (sociallinkId: string) => `/influencer/update_sociallink/${sociallinkId}`,
    DELETE_SOCIAL_LINK: (sociallinkId: string) => `/influencer/delete_sociallink/${sociallinkId}`,
  },
} as const;
