"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Linkedin,
  Mail,
  MoreHorizontal,
  Send,
  Twitter,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { IoIosShareAlt } from "react-icons/io";


interface ShareDialogProps {
  url: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const shareOptions = [
  {
    name: "Telegram",
    icon: Send,
    color: "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
    action: (url: string, title?: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title || "")}`,
  },
  {
    name: "Twitter",
    icon: Twitter,
    color: "text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20",
    action: (url: string, title?: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title || "")}`,
  },
  {
    name: "WhatsApp",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
      </svg>
    ),
    color: "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20",
    action: (url: string, title?: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title || ""} ${url}`)}`,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20",
    action: (url: string, title?: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
  },
  {
    name: "E-mail",
    icon: Mail,
    color: "text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20",
    action: (url: string, title?: string) =>
      `mailto:?subject=${encodeURIComponent(
        title || "Check this out"
      )}&body=${encodeURIComponent(url)}`,
  },
  {
    name: "More",
    icon: MoreHorizontal,
    color:
      "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
    action: () => "",
  },
];

function ShareContent({ url, title }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${BASE_URL}${url}`);
      setCopied(true);
      toast.message("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.message("Failed to copy link");
    }
  };

  const handleShare = (shareUrl: string, optionName: string) => {
    if (optionName === "More") {
      if (navigator.share) {
        navigator.share({
          title: title,
          url: `${BASE_URL}${url}`,
        });
      }
      return;
    }
    window.open(`${BASE_URL}${shareUrl}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Share Options */}
      <div className="grid grid-cols-6 gap-4">
        {shareOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.name}
              onClick={() =>
                handleShare(option.action(url, title), option.name)
              }
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <IconComponent />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {option.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="text-center">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          Or share with link
        </span>
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={url}
          readOnly
          className="flex-1 text-sm bg-gray-50 dark:bg-muted border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-5 rounded-full"
        />
        <Button onClick={copyToClipboard} className="rounded-full">
          Copy{" "}
        </Button>
      </div>
    </div>
  );
}

export function ShareDialog({
  url,
  title,
  description,
  children,
}: ShareDialogProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const triggerButton = children || (
    <Button
      variant="outline"
      size="icon"
      className="text-xs bg-transparent rounded-full"
    >
      <IoIosShareAlt className="h-4" />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent className="px-6 pb-6">
          <DrawerHeader className="px-0 pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-medium">
                Share with
              </DrawerTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          <ShareContent url={url} title={title} description={description} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="rounded-3xl bg-accent w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">
              Share with
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <ShareContent url={url} title={title} description={description} />
      </DialogContent>
    </Dialog>
  );
}
