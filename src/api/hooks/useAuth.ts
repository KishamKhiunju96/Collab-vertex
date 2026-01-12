"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken,UserRole } from '@/utils/authToken';

export function useAuthProtection() {
  const router = useRouter();
  const [state, setState] = useState<{
    loading: boolean;
    authenticated: boolean;
    role: UserRole | null;
  }>({
    loading: true,
    authenticated: false,
    role: null,
  });

  useEffect(() =>{
    const user = getUserFromToken();

    if (!user) {
      router.push("/login");
      setState({
        loading:false,
        authenticated:false,
        role:null
      });
    } else{
      setState({
        loading:false,
        authenticated: true,
        role: user.role,
      });
    }
      }, [router]);
      return state;
    }

    export function useAuthRedirect(){
      const router = useRouter();

      useEffect(() =>{
        const user =getUserFromToken();
      
      if (user){
        router.push(`/dashboard/${user.role}`);
      }
    }, [router]);
}
