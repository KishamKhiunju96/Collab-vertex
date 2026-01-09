export const BASE_URL = "https://w4gwd5wf-8000.inc1.devtunnels.ms";

export const API_PATHS = {
  USER: {
    LOGIN: `/user/login`,
    REGISTER: `/user/register`,
    VERIFY_OTP: `/otp/verify_otp`,
  },
  TASKS: {
    GET_ALL: `/tasks`,
    GET_BY_ID: (id: string) => `/tasks/${id}`,
    CREATE: `/tasks`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
};
