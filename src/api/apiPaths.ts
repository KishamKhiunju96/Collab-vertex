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
    GET_ALL_EVENTS: "/event/allevents",
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
    CREATE_PROFILE: "/influencer/create_influencerprofile",
    CREATE_SOCIAL_LINK: "/influencer/create_sociallink",
    GET_SOCIAL_LINKS: "/influencer/get_sociallinks",
    UPDATE_SOCIAL_LINK: (sociallinkId: string) =>
      `/influencer/update_sociallink/${sociallinkId}`,
    DELETE_SOCIAL_LINK: (sociallinkId: string) =>
      `/influencer/delete_sociallink/${sociallinkId}`,
  },

  NOTIFICATION: {
    STREAM: "/notification/stream", // SSE notifications
    GET_ALL: "/notification", // Get all notifications
    GET_UNREAD_COUNT: "/notification/unread-count", // Get unread count
    MARK_AS_READ: (notificationId: string) =>
      `/notification/${notificationId}/read`, // PATCH to mark as read
    MARK_ALL_AS_READ: "/notification/mark-all-read", // POST to mark all as read
    DELETE: (notificationId: string) => `/notification/${notificationId}`, // DELETE notification
  },
} as const;
