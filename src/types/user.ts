export type UserRole = "brand" | "influencer" | "admin";

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;

  createdAt?: string;
  updatedAt?: string;
}
