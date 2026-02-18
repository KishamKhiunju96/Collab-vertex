// src/features/applications/types/application.types.ts
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
}
