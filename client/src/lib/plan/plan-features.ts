import { Bot, MessageSquare, Users, FolderKanban, PlugZap } from "lucide-react";

export type Feature = {
  id: number;
  key: string;
  icon: any;
  iconColor: string;
  title: string;
  description: string | boolean; // description or false if not available
};

export const planFeatures: Record<"FREE" | "PLUS", Feature[]> = {
  FREE: [
    {
      id: 1,
      key: "characters",
      icon: Bot,
      iconColor: "text-gray-500",
      title: "Characters",
      description:
        "Create up to 3 characters with standard voices and avatars.",
    },
    {
      id: 2,
      key: "messages",
      icon: MessageSquare,
      iconColor: "text-gray-400",
      title: "Messages per Chat",
      description: "Send and receive up to 50 messages per chat.",
    },
    {
      id: 3,
      key: "chats",
      icon: Users,
      iconColor: "text-gray-400",
      title: "Saved Chats",
      description: "Manage up to 8 chat sessions.",
    },
    {
      id: 4,
      key: "themes",
      icon: FolderKanban,
      iconColor: "text-gray-400",
      title: "Themes & Visuals",
      description: false, // not available in free
    },
    {
      id: 5,
      key: "export",
      icon: PlugZap,
      iconColor: "text-gray-400",
      title: "Export Conversations",
      description: false,
    },
    {
      id: 6,
      key: "custom_personality",
      icon: Bot,
      iconColor: "text-gray-500",
      title: "Custom Personality & Memory",
      description: "Use presets only; full customization locked.",
    },
    {
      id: 7,
      key: "voice_calls",
      icon: PlugZap,
      iconColor: "text-gray-400",
      title: "Voice Calls with Characters",
      description: false,
    },
  ],

  PLUS: [
    {
      id: 1,
      key: "characters",
      icon: Bot,
      iconColor: "text-blue-500",
      title: "Unlimited Characters",
      description:
        "Create as many characters as you like with unique voices and avatars.",
    },
    {
      id: 2,
      key: "messages",
      icon: MessageSquare,
      iconColor: "text-cyan-500",
      title: "Extended Messaging",
      description:
        "Send and receive 100+ messages per chat with deeper memory and response quality.",
    },
    {
      id: 3,
      key: "chats",
      icon: Users,
      iconColor: "text-blue-400",
      title: "Multiple Chat Sessions",
      description:
        "Manage and continue more than 8 chats across different characters.",
    },
    {
      id: 4,
      key: "themes",
      icon: FolderKanban,
      iconColor: "text-teal-400",
      title: "Themes & Visuals",
      description:
        "Customize chat backgrounds, character moods, and support for light/dark mode.",
    },
    {
      id: 5,
      key: "export",
      icon: PlugZap,
      iconColor: "text-cyan-600",
      title: "Export Conversations",
      description: "Download your chats in PDF or markdown formats anytime.",
    },
    {
      id: 6,
      key: "custom_personality",
      icon: Bot,
      iconColor: "text-purple-500",
      title: "Custom Personality & Memory",
      description:
        "Tune personality sliders and unlock full memory retention for characters.",
    },
    {
      id: 7,
      key: "voice_calls",
      icon: PlugZap,
      iconColor: "text-pink-500",
      title: "Voice Calls with Characters",
      description:
        "Talk to your characters using real-time voice — powered by STT & TTS AI.",
    },
  ],
};
