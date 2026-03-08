"use client";

import React, { useOptimistic, useTransition, useEffect } from "react";
import { Button } from "../ui/button";
import { useErrorToast } from "@/hooks/use-error-toast";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { useToggleCharacterCommentLikeMutation } from "@/hooks/api/use-comment";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

const CommentLikeButton = ({
  initialIsLiked,
  characterId,
  commentId,
  variant = "ghost",
  size = "sm",
  className,
  likesCount,
}: {
  initialIsLiked?: boolean; // make optional now
  commentId: string;
  characterId: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  likesCount: number;
}) => {
  const { currentUser } = useAuthStore();
  const errorToast = useErrorToast();
  const toggleCharacterCommentLikeMutation =
    useToggleCharacterCommentLikeMutation();

  const isUserLikedCharacterQuery = initialIsLiked;

  const [optimisticLiked, setOptimisticLiked] = useOptimistic(
    isUserLikedCharacterQuery,
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

      const { success } = await toggleCharacterCommentLikeMutation.mutateAsync({
        commentId,
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
      className={cn(
        optimisticLiked
          ? "text-red-800 flex items-center gap-1 hover:text-foreground transition"
          : "text-muted-foreground",
        className
      )}
      disabled={
        currentUser.status === "loading" ||
        toggleCharacterCommentLikeMutation.isPending
      }
    >
      {optimisticLiked ? (
        <FaHeart className="w-3.5" />
      ) : (
        <CiHeart className="w-3.5" />
      )}
      <p className="text-xs text-muted-foreground">{likesCount}</p>
    </Button>
  );
};

export default CommentLikeButton;
