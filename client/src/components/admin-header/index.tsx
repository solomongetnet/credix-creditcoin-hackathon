"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "../ui/mode-toggle";

const data = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    title: "Users",
    path: "/admin/users",
  },
  {
    title: "Characters",
    path: "/admin/characters",
  },
  {
    title: "Plans",
    path: "/admin/courses-offerings",
  },
  {
    title: "User plans",
    path: "/admin/user-plans",
  },
  {
    title: "Reports",
    path: "/admin/reports",
  },
  {
    title: "Settings",
    path: "/admin/settings",
  },
];

export function AdminHeader() {
  const pathname = usePathname();
  const currentHeaderTitle = data.find(
    (item) => item.path.includes(pathname) || item.path === pathname
  )?.title;

  const [headerTitle, setHeaderTitle] = useState<string>(currentHeaderTitle!);

  useEffect(() => {
    const currentHeaderTitle = data.find(
      (item) => item.path.includes(pathname) || item.path === pathname
    )?.title;
    setHeaderTitle(currentHeaderTitle!);
  }, [pathname, headerTitle]);

  return (
    <header className="sticky rounded-t-xl overflow-hidden p-2 top-0 bg-background/40 backdrop-blur-2xl z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {headerTitle || "Admin Panel"}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex" size="icon">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Notification</span>
          </Button>{" "}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
