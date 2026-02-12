import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
}

interface AuthHook {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Replace this with real authentication fetch logic
    const fetchUser = async () => {
      // Example: simulate async fetch
      const fetchedUser: User = { id: "me", name: "Kisham" };
      setUser(fetchedUser);
    };

    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
  };
};
