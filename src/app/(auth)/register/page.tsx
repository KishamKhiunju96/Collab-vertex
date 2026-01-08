"use client";

import AuthContainer from "@/components/auth/AuthContainer";
import RegisterForm from "../../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthContainer>
      <RegisterForm />
    </AuthContainer>
  );
}
