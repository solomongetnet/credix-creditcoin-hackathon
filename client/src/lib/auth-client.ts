// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  customSessionClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";
import { useAuthStore } from "@/store/auth-store";

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
    async onSuccess(context) {
      const user = context?.data ?? null;
    },
  },
  plugins: [
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
  ],
});
