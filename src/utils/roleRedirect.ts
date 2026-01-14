// src/utils/roleRedirect.ts
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const redirectByRole = (role: string, router: AppRouterInstance) => {
  switch (role) {
    case "BRAND":
      router.push("/brand/dashboard");
      break;
    case "INFLUENCER":
      router.push("/influencer/dashboard");
      break;
    case "ADMIN":
      router.push("/admin/dashboard");
      break;
    default:
      router.push("/select-role");
  }
};
