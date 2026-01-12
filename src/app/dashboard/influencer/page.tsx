"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function DashboardPage() {
    const {loading, role} = useAuthProtection();
    const router = useRouter();

    useEffect(() => {
        if(!loading && role) {
            router.push(`/dashboard/${role}`)
        }
    }, [loading,role, router]);

    return null;
}