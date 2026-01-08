"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/utils/authToken';

export function useAuthProtection() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      router.push('/login');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return isAuthenticated;
}

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);
}
