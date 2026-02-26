export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dixam.me";

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
    GET_CHATABLE_INFLUENCERS: "/brand/chatable_influencers",
  },

  EVENT: {
    CREATE: (brandId: string) => `/event/create_event/${brandId}`,
    GET_BY_BRAND: (brandId: string) => `/event/eventsbybrand/${brandId}`,
    GET_ALL_EVENTS: (influencerId: string) =>
      `/event/all_events/${influencerId}`,
    GET_NON_APPLY_EVENTS: (influencerId: string) =>
      `/event/fuck_events/${influencerId}`,
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
    GET_APPLIED_EVENTS: (influencerId: string) =>
      `/event/applied_events/${influencerId}`,
  },

  INFLUENCER: {
    CREATE_PROFILE: "/influencer/create_influencerprofile",
    UPDATE_PROFILE: (influencerId: string) =>
      `/influencer/update_influencerprofile/${influencerId}`,
    GET_BY_USER: "/influencer/get_influencer_by_user",
    GET_BY_ID: (influencerId: string) =>
      `/influencer/get_influencer_by_id/${influencerId}`,
    CREATE_SOCIAL_LINK: "/influencer/create_sociallink",
    GET_SOCIAL_LINKS: "/influencer/get_sociallinks",
    GET_SOCIAL_LINKS_BY_ID: (influencerId: string) =>
      `/influencer/get_sociallinks/${influencerId}`,
    GET_BY_NAME: (name: string) => `/influencer/get_influencer_by_name/${name}`,
    UPDATE_SOCIAL_LINK: (sociallinkId: string) =>
      `/influencer/update_sociallink/${sociallinkId}`,
    DELETE_SOCIAL_LINK: (sociallinkId: string) =>
      `/influencer/delete_sociallink/${sociallinkId}`,
    GET_CHATABLE_BRANDS: "/influencer/chatable_brands",
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

  CHAT: {
    /**
     * WebSocket endpoint for real-time chat in a conversation
     * 
     * Usage Flow:
     * 1. Get chatable contacts: GET /brand/chatable_influencers or /influencer/chatable_brands
     * 2. Create conversation: POST CREATE_DIRECT_CONVERSATION with { other_user_id: contact.user_id }
     * 3. Get conversation_id from response
     * 4. Connect WebSocket: wss://api.dixam.me/chat/ws/conversation/{conversation_id}
     * 5. Both users connect to same conversation_id
     * 6. Send/receive messages in real-time
     * 
     * Authentication: HttpOnly cookies (automatic)
     * 
     * IMPORTANT: Use user_id (not profile id) from chatable endpoints
     * - Chatable endpoints return: { user_id: "user-uuid", id: "profile-uuid", name: "..." }
     * - For creating conversations, use: { other_user_id: contact.user_id }
     * - Backend authorization checks are based on user_id from Users table
     * 
     * @param conversation_id - UUID of the conversation from CREATE_DIRECT_CONVERSATION response
     * @returns WebSocket path: /chat/ws/conversation/{conversation_id}
     * 
     * Full URL: wss://api.dixam.me/chat/ws/conversation/{conversation_id}
     */
    WEBSOCKET: (conversation_id: string) => `/chat/ws/conversation/${conversation_id}`,
        
    // Conversation management
    CREATE_DIRECT_CONVERSATION: "/chat/conversations/direct",
    CREATE_GROUP_CONVERSATION: "/chat/conversations/group",
    GET_CONVERSATIONS_LIST: "/chat/conversations",
    GET_CONVERSATION_MESSAGES: (conversationId: string) =>
      `/chat/conversations/${conversationId}/messages`,
    // SEND_MESSAGE: (conversationId: string) =>
    //   `/chat/conversations/${conversationId}/messages`,
    MARK_CONVERSATION_READ: (conversationId: string) =>
      `/chat/conversations/${conversationId}/read`,
    ADD_PARTICIPANTS: (conversationId: string) =>
      `/chat/conversations/${conversationId}/participants`,
    REMOVE_PARTICIPANT: (conversationId: string, userId: string) =>
      `/chat/conversations/${conversationId}/participants/${userId}`,
  },
} as const;
