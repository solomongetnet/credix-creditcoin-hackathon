"use server";

import { serverSession } from "@/lib/auth-server";

// 🎭 Define roles for type safety
type Role = "USER" | "ADMIN";

// Utility type for ensuring at least one of `accessedBy` or `cantAccessBy` is provided
type RoleGuardProps = {
  accessedBy?: Role[]; // Roles allowed to access
  cantAccessBy?: Role[]; // Roles not allowed to access
} & (
  | { accessedBy: Role[]; cantAccessBy?: never } // If `accessedBy` is provided, `cantAccessBy` must be absent
  | { cantAccessBy: Role[]; accessedBy?: never }
); // If `cantAccessBy` is provided, `accessedBy` must be absent

const RoleGuard = async ({ accessedBy, cantAccessBy }: RoleGuardProps) => {
  const session = await serverSession();

  // Check if session exists, i.e., user is logged in
  if (!session?.user) {
    throw new Error("Please login first");
  }

  // Get the user's role from the session
  const userRole = session.user.role as Role;

  // If both accessedBy and cantAccessBy are provided, throw an error
  if (accessedBy && cantAccessBy) {
    throw new Error(
      "Please provide either 'accessedBy' or 'cantAccessBy', not both."
    );
  }

  // 🔐 If accessedBy is provided, check if the user's role is included in the allowed roles
  if (accessedBy && !accessedBy.includes(userRole)) {
    throw new Error("You don't have permission to access this resource");
  }

  // 🚫 If cantAccessBy is provided, check if the user's role is included in the restricted roles
  if (cantAccessBy && cantAccessBy.includes(userRole)) {
    throw new Error("You are not allowed to access this resource");
  }

  return { ...session.user, id: Number(session.user.id) };
};

export default RoleGuard;
