"use client";

import { useGetOrCreateChatWithCharacterMutation } from "@/hooks/api/use-chat";
import { useChatHelpers } from "@/hooks/use-chat-helpers";
import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const StartChatButton = ({
  characterId,
  className,
  hasPreviousChat,
  children,
  variant = "default",
  size = "default",
}: {
  characterId: string;
  className?: string;
  hasPreviousChat?: boolean;
  children?: ReactNode;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const getOrCreateChatWithCharacter =
    useGetOrCreateChatWithCharacterMutation();
  const { handleOpenChat } = useChatHelpers();
  const handleStartChat = async () => {
    if (!characterId) return;

    const response = await getOrCreateChatWithCharacter.mutateAsync({
      characterId,
    });

    //@ts-ignore
    if (response.chatId) {
      // this will open new created or previous chat and close the modal also
      //@ts-ignore
      handleOpenChat({ chatId: response.chatId, refresh: true });
    }
  };

  return (
    <Button
      className={cn(`${className}`)}
      variant={variant}
      size={size}
      onClick={handleStartChat}
      disabled={getOrCreateChatWithCharacter.isPending}
    >
      {children ? children : hasPreviousChat ? "Continue chat" : "Start Chat"}
    </Button>
  );
};

export default StartChatButton;
