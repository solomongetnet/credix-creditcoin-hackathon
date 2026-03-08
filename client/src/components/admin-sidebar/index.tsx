import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

import { NavUser } from "./nav-user";
import { serverSession } from "@/lib/auth-server";

export async function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await serverSession();
  const user = session?.user;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="">
        <SidebarHeader>
          <h2 className="text-xl pl-2 ">Charapia Admin</h2>
        </SidebarHeader>

        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
