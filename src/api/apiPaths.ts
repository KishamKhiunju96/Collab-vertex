export const BASE_URL = "http://localhost:8000";

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
    GET_BY_ID: (brandId: string) => `/brand/brandbyid/${brandId}`,
    GET_BRANDS_BY_USER: "/brand/brandsbyuser",
    UPDATE_PROFILE: (brandId: string) =>
      `/brand/update_brandprofile/${brandId}`,
    DELETE_PROFILE: (brandId: string) =>
      `/brand/delete_brandprofile/${brandId}`,
  },

  EVENT: {
    CREATE: (brandId: string) => `/event/create_event/${brandId}`,
    GET_BY_BRAND: (brandId: string) => `/event/eventsbybrand/${brandId}`,
    GET_BY_ID: (eventId: string) => `/event/eventbyid/${eventId}`,
    UPDATE: (eventId: string) => `/event/update_event/${eventId}`,
    DELETE: (eventId: string) => `/event/delete_event/${eventId}`,

    // Hybrid / discovery
    GET_USING_HYBRID: "/event/eventsusinghybrid",

    // Applications
    APPLY: "/event/apply_event",
    GET_APPLICATIONS: (eventId: string) =>
      `/event/event_applications/${eventId}`,
    UPDATE_APPLICATION_STATUS: (applicationId: string) =>
      `/event/update_application_status/${applicationId}`,
  },

  INFLUENCER: {
    CREATE_SOCIAL_LINK: "/influencer/create_sociallink",
    GET_SOCIAL_LINKS: "/influencer/get_sociallinks",
    UPDATE_SOCIAL_LINK: (sociallinkId: string) =>
      `/influencer/update_sociallink/${sociallinkId}`,
    DELETE_SOCIAL_LINK: (sociallinkId: string) =>
      `/influencer/delete_sociallink/${sociallinkId}`,
  },
} as const;
