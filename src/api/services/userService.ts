import api from "../axiosInstance";

export const userService = {
  me: () => api.get("/user/me"),
};
