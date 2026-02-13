// src/components/InnerApp.tsx
"use client"; // ✅ Client Component

import React from "react";
import ToastProvider from "@/components/ui/ToastProvider";

export default function InnerApp({ children }: { children: React.ReactNode }) {
  // SSE notifications are now initialized in NotificationContext

  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
