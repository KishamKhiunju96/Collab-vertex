// src/app/layout.tsx

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
      <body>{children}</body>
    </html>
  );
}
