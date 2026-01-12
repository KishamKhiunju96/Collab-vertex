"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {loading, authenticated} = useAuthProtection();

    if(loading) {
      return(
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if(!authenticated){
      return null;
    }

    return <>{children}</>
  }