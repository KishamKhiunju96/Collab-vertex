"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import ProfileForm from "@/components/dashboard/ProfileForm";



export default function ProfilePage() {

    const {loading, authenticated} = useAuthProtection();

    if(loading) return <p>Loading...</p>;
    if(!authenticated) return null;

    return(
        <section>
            <h1 className="text-xl font-semibold mb-4"> My Profile </h1>
            <ProfileForm />
        </section>
    );
}