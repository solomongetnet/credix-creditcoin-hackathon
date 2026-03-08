import { authClient } from "./auth-client";

export const signOut = async (onSuccess?: () => void, onError?: () => void) => {
  return await authClient.signOut({
    fetchOptions: {
      onSuccess,
      onError,
    },
  });
};

export const githubSignin = async () => {
  // Get the `callback` parameter from the current URL
  const url = new URL(window.location.href);
  const callback = url.searchParams.get("callback") || "/";

  await authClient.signIn.social({
    provider: "github",
    callbackURL: callback,
  });
};

export const googleSignin = async () => {
  // Extract callback from current URL (client-side)
  const url = new URL(window.location.href);
  const callback = url.searchParams.get("callback") || "/";

  await authClient.signIn.social({
    provider: "google",
    callbackURL: '/callback',
  });
};
