import { API_PATHS } from "@/api/apiPaths";
import api from "../axiosInstance";

export const taskService = {
  getAllTasks: () => api.get(API_PATHS.TASKS.GET_ALL),
  getTasksById: (id: string) => api.get(API_PATHS.TASKS.GET_BY_ID(id)),
  createTask: (data: { titlt: string; description: string }) =>
    api.post(API_PATHS.TASKS.CREATE, data),
  updateTask: (id: string, data: { title?: string; description?: string }) =>
    api.put(API_PATHS.TASKS.UPDATE(id), data),
  deleteTask: (id: string) => api.delete(API_PATHS.TASKS.DELETE(id)),
};
