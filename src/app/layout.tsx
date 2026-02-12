// src/app/layout.tsx
import React from "react";
import { NotificationProvider } from "@/context/NotificationContext";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";
import InnerApp from "@/components/InnerApp"; // import the client component

export const metadata = {
  title: "Brand Dashboard App",
  description: "Manage your brand and events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap with UserProvider for global user state management */}
        <UserProvider>
          {/* Wrap with NotificationProvider to make notifications available globally */}
          <NotificationProvider>
            {/* InnerApp is a client component that handles SSE notifications */}
            <InnerApp>{children}</InnerApp>
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
