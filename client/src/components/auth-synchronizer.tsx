// components/auth-synchronizer.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { authClient } from "@/lib/auth-client";

export function AuthSynchronizer() {
  const { data: session, isPending, error } = authClient.useSession();
  const { setCurrentUser, resetUser } = useAuthStore();

  useEffect(() => {
    if (isPending) {
      setCurrentUser({ user: null, status: "loading" });
    } else if (error) {
      setCurrentUser({ user: null, status: "error", error: error.message });
    } else if (session?.user) {
      setCurrentUser({
        user: {
          email: session?.user.email,
          id: session?.user.id,
          name: session?.user?.name,
          username: session?.user?.username!,
          plan: (session?.user.plan as any)?.toLowerCase() || "free",
          walletAddress: session?.user.walletAddress,
        },
        status: "success",
      });
    } else {
      // 🧨 Handles sign-out (session.user is null)
      resetUser();
    }
  }, [session, isPending, error, setCurrentUser]);

  return null;
}
