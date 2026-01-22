export type UserRole = "brand" | "influencer" | "admin";

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;

  //  (safe for future use)
  createdAt?: string;
  updatedAt?: string;
}
