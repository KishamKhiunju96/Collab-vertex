"use client";

import AuthContainer from "@/components/auth/AuthContainer";
import RegisterForm from "../../../components/auth/RegisterForm";
import { useAuthRedirect } from "@/api/hooks/useAuth";

export default function RegisterPage() {
  useAuthRedirect(); 

  return (
    <AuthContainer>
      <RegisterForm />
    </AuthContainer>
  );
}
