"use client";

import AuthContainer from "@/components/auth/AuthContainer";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthContainer>
      <ForgotPasswordForm />
    </AuthContainer>
  );
}
