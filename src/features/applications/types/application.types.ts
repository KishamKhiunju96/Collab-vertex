// src/features/applications/types/application.types.ts
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
}
