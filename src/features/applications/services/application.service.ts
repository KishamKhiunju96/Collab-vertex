// src/features/applications/services/application.service.ts
import apiClient from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { UpdateApplicationStatusPayload } from "../types/application.types";
import { notify } from "@/utils/notify";

export const applicationService = {
  async updateApplicationStatus(
    applicationId: string,
    payload: UpdateApplicationStatusPayload,
  ) {
    try {
      console.log("=== applicationService.updateApplicationStatus called ===");
      console.log("Application ID:", applicationId);
      console.log("Application ID type:", typeof applicationId);
      console.log("Application ID length:", applicationId?.length);
      console.log("Payload:", payload);
      console.log("Payload status:", payload?.status);
      console.log("API_PATHS.EVENT:", API_PATHS.EVENT);

      const fullPath = API_PATHS.EVENT.UPDATE_APPLICATION_STATUS(applicationId);
      console.log("Full API path:", fullPath);
      console.log("API Client:", apiClient);
      console.log("API Client baseURL:", apiClient.defaults.baseURL);
      console.log(
        "Full URL will be:",
        `${apiClient.defaults.baseURL}${fullPath}`,
      );

      console.log("Making PATCH request...");
      const { data } = await apiClient.patch(fullPath, payload);

      console.log(`Application ${applicationId} updated successfully`);
      console.log("Response data:", data);

      // Show success notification
      const statusText =
        payload.status === "accepted" ? "accepted" : "rejected";
      notify.success(`Application ${statusText} successfully!`);

      return data;
    } catch (error: unknown) {
      console.error(
        "=== ERROR in applicationService.updateApplicationStatus ===",
      );
      console.error("Error type:", typeof error);
      console.error("Error:", error);

      const err = error as {
        response?: { status?: number; data?: { message?: string } };
        request?: unknown;
        message?: string;
      };

      console.error("Error response:", err?.response);
      console.error("Error request:", err?.request);
      console.error("Error message:", err?.message);

      // Handle different error scenarios
      if (err?.response?.status === 404) {
        console.error("404 - Application not found");
        notify.error(
          "Application not found. It may have been deleted or doesn't exist.",
        );
        throw new Error("Application not found");
      } else if (err?.response?.status === 422) {
        console.error("422 - Invalid status value");
        notify.error(
          "Invalid status value. Please use 'accepted' or 'rejected'.",
        );
        throw new Error("Invalid status");
      } else if (err?.response?.status === 401) {
        console.error("401 - Unauthorized");
        notify.error("Unauthorized. Please log in again.");
        throw new Error("Unauthorized");
      } else if (err?.response?.data?.message) {
        console.error("API error message:", err.response.data.message);
        notify.error(err.response.data.message);
        throw error;
      } else if (!err?.response) {
        console.error(
          "No response received - possible network error or CORS issue",
        );
        notify.error("Network error. Please check your connection.");
        throw new Error("Network error");
      } else {
        console.error("Unknown error occurred");
        notify.error("Failed to update application status. Please try again.");
        throw error;
      }
    }
  },
};
