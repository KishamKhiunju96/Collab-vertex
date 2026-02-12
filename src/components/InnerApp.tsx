// src/components/InnerApp.tsx
"use client"; // ✅ Client Component

import React from "react";
import { useNotifications } from "@/api/hooks/useNotifications";
import ToastProvider from "@/components/ui/ToastProvider";

export default function InnerApp({ children }: { children: React.ReactNode }) {
  useNotifications(); // safe to use now

  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
