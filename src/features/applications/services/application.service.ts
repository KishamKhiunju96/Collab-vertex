// src/features/applications/services/application.service.ts
import apiClient from "@/api/axiosInstance";
import { UpdateApplicationStatusPayload } from "../types/application.types";

export const applicationService = {
  async updateApplicationStatus(
    applicationId: string,
    payload: UpdateApplicationStatusPayload,
  ) {
    const { data } = await apiClient.patch(
      `/event/update_application_status/${applicationId}`,
      payload,
    );
    return data;
  },
};
