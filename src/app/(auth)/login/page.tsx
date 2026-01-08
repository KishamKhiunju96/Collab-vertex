"use client";

import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "../../../components/auth/LoginForm";
import { useAuthRedirect } from "@/api/hooks/useAuth";

export default function LoginPage() {
  useAuthRedirect(); 

  return (
    <AuthContainer>
      <LoginForm />
    </AuthContainer>
  );
}
