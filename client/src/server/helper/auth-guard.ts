"use server";

import { serverSession } from "@/lib/auth-server";


// Ensure the user is authenticated
const AuthGuard = async () => {
  const session = serverSession;

  if (!session) {
    throw new Error("Please login first");
  }

  return session
};

export default AuthGuard;
