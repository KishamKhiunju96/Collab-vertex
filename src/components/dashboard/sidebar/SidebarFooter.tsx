"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avtar";

interface SidebarFooterProps {
  role: string;
  name?: string;
  avatarUrl?: string;
}

export default function SidebarFooter({
  role,
  name = "Collab Vertex",
  avatarUrl = "/placeholder-user.jpg",
}: SidebarFooterProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await axios.post("/user/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      router.push("/login");
    }
  };

  return (
    <div className="border-t border-sidebar-border p-4">
      {/* User info */}
      <div className="mb-3 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {name}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {role} account
          </p>
        </div>
      </div>

      {/* Logout button */}
      <Button
        variant="ghost"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={cn(
          "w-full justify-start gap-2",
          isLoggingOut
            ? "text-muted-foreground"
            : "text-red-400 hover:text-red-300",
        )}
      >
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
    </div>
  );
}
