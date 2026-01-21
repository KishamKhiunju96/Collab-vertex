// src/app/layout.tsx

import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css"; // relative path from src/app/ to src/styles/

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
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
