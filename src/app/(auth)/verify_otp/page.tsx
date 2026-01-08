"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";


export default function VerifyOtpPage() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get ('userId');

    const handleVerify = async(e: React.FormEvent) => {
        e.preventDefault(); 
        
        if(!userId) {
            alert ("Invalid verrification request");
            return;
        }
        try {
            setLoading (true);
            await axios.post ("/api/verify-otp", {
                userId,
                otp,
        });

        router.push ("/register");
        } catch (error: any) {
            alert (error?. response?. data?. message || "Invalid or expired OTP");
        } finally {
            setLoading (false);
        };
    };
    return (
        <div>
            <form
            onSubmit={handleVerify}
            className="">
                <h2 className=""> Verify OTP</h2>

                <input
                type="text"
                value={otp}
                onChange={(e) =>setOtp(e.target.value)}
                placeholder="Enter your OTP"
                className=""
                required>
                </input>

                <button
                type= "submit"
                disabled= {loading}
                className="">
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </form>
        </div>
    );
}

