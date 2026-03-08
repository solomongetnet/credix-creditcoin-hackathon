"use server";

import { serverSession } from "@/lib/auth-server";

/**
 * Retrieves the current user's session details.
 * @returns The authenticated user's session data or `null` if not authenticated.
 */
export const getUserSession = async () => {
  const session = await serverSession();
  return session?.user || null;
};

/**
 * Retrieves the unique identifier (ID) of the currently authenticated user.
 * @returns The user's ID as a string or `null` if not authenticated.
 */
export const getAuthenticatedUserId = async () => {
  const session = await serverSession();
  return session?.user?.id;
};
