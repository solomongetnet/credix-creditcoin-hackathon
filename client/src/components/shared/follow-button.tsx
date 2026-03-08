"use client";

import { useOptimistic, useTransition } from "react";
import { Button } from "../ui/button";
import { useToggleFollowMutation } from "@/hooks/api/use-follow";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useErrorToast } from "@/hooks/use-error-toast";
import { usePathname } from "next/navigation";

interface FollowButtonProps {
  initialIsFollowing: boolean;
  targetUserId: string;
  size?: "sm" | "default" | "lg";
  className?: string;
  followText?: string;
}

export function FollowButton({
  initialIsFollowing,
  targetUserId,
  size = "sm",
  className,
  followText,
}: FollowButtonProps) {
  const { currentUser } = useAuthStore();
  const errorToast = useErrorToast();
  const mutation = useToggleFollowMutation();
  // const pathname = usePathname();

  const [optimisticIsFollowing, setOptimisticIsFollowing] = useOptimistic(
    initialIsFollowing,
    (_, newValue: boolean) => newValue
  );

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!currentUser.user) {
      errorToast.showErrorToast({
        code: "LOGIN_REQUIRED",
        // loginCallback: pathname,
      });
      return;
    }

    startTransition(() => {
      // Flip instantly (inside transition to satisfy React 19 rules)
      const newState = !optimisticIsFollowing;
      setOptimisticIsFollowing(newState);

      mutation.mutate(
        { targetUserId },
        {
          onError: () => {
            // Roll back if API fails
            setOptimisticIsFollowing(!newState);
          },
        }
      );
    });
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      className={cn(
        "rounded-full px-6",
        className,
        currentUser.user?.id === targetUserId && "hidden"
      )}
      variant={optimisticIsFollowing ? "outline" : "default"}
      disabled={currentUser.status === "loading"}
    >
      {optimisticIsFollowing ? "Unfollow" : followText || "Follow"}
    </Button>
  );
}
