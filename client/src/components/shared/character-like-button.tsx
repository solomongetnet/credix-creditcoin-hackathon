"use client";

import React, { useOptimistic, useTransition, useEffect } from "react";
import {
  useIsUserLikeCharacterQuery,
  useToggleCharacterLikeMutation,
} from "@/hooks/api/use-like";
import { Button } from "../ui/button";
import HeartIcon from "@/assets/icons";
import { useErrorToast } from "@/hooks/use-error-toast";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const CharacterLikeButton = ({
  initialIsLiked,
  characterId,
  variant = "outline",
  size = "icon",
  className,
  title,
}: {
  initialIsLiked?: boolean; // make optional now
  characterId: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  className?: string;
  title?: string;
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const { currentUser } = useAuthStore();
  const errorToast = useErrorToast();
  const toggleCharacterLikeMutation = useToggleCharacterLikeMutation();

  // Only fetch like status if initialIsLiked is NOT provided
  const isUserLikedCharacterQuery = initialIsLiked == null
    ? useIsUserLikeCharacterQuery({ characterId })
    : { data: { isLiked: initialIsLiked }, isLoading: false };

  const [optimisticLiked, setOptimisticLiked] = useOptimistic(
    isUserLikedCharacterQuery.data?.isLiked ?? false,
    (_, newValue: boolean) => newValue
  );

  const [_, startTransition] = useTransition();

  // If the initialIsLiked prop changes (e.g., on re-render), update optimistic state
  useEffect(() => {
    if (initialIsLiked != null) {
      setOptimisticLiked(initialIsLiked);
    }
  }, [initialIsLiked, setOptimisticLiked]);

  const handleToggleLike = () => {
    if (!currentUser.user) {
      errorToast.showErrorToast({
        code: "LOGIN_REQUIRED",
      });
      return;
    }

    startTransition(async () => {
      const newState = !optimisticLiked;
      setOptimisticLiked(newState);

      const { success } = await toggleCharacterLikeMutation.mutateAsync({
        characterId,
      });

      if (!success) {
        setOptimisticLiked(!newState);
      }
    });
  };

  return (
    <Button
      onClick={handleToggleLike}
      size={size}
      variant={variant}
      className={cn(optimisticLiked ? "text-red-800" : "", className)}
      disabled={currentUser.status === "loading"}
      title={title}
    >
      {optimisticLiked ? <HeartIcon liked /> : <HeartIcon />} {title}
    </Button>
  );
};

export default CharacterLikeButton;
