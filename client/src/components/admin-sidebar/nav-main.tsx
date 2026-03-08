"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { adminSidebarNavLinks } from "@/constants/links";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({}) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent className="flex flex-col gap-3 px-0">
        <SidebarMenu>
          {adminSidebarNavLinks.map((item) => (
            <SidebarMenuItem key={item.title} >
              <SidebarMenuButton tooltip={item.title} >
                <Link
                  href={item.url}
                  className={`w-full relative flex items-center px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
                    isActive(item.url)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                      isActive(item.url)
                        ? "text-primary"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.title}</span>
                  {isActive(item.url) && (
                    <motion.span
                      className="absolute left-0 top-1/2 w-1 h-5 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
