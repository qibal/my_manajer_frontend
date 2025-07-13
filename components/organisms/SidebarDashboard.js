// components/organisms/SidebarDashboard.js
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/Shadcn/sidebar";
import { Home, Users, DollarSign, BarChart2, Settings, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/atoms/Logo";
import { useAuthorization } from "@/hooks/useAuthorization";

const dashboardMenu = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard"
  },
  {
    id: "users",
    label: "User & Role Management",
    icon: Users,
    href: "/dashboard/users"
  },
  {
    id: "projects",
    label: "Projects",
    icon: BarChart2,
    href: "/dashboard/projects"
  },
  {
    id: "finance",
    label: "Financial Tracking",
    icon: DollarSign,
    href: "/dashboard/finance",
  },
  {
    id: "analytics",
    label: "Business Analytics",
    icon: BarChart2,
    href: "/dashboard/analytics",
  },
  {
    id: "asset",
    label: "Asset",
    icon: Package,
    href: "/dashboard/asset",
  },
];
const personalMenu = [
  {
    id: "todo",
    label: "Todo",
    icon: Users,
    href: "/dashboard/users"
  },

  {
    id: "personal_finance",
    label: "Financial Tracking",
    icon: DollarSign,
    href: "/dashboard/finance",
  },

];

function SidebarHeaderMenu() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (collapsed) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="icon" className="rounded-lg">
            <Logo width={32} height={32} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="w-full justify-start px-3 text-left"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Logo width={60} height={60} />
          </div>
          <div className="ml-3 grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold">Anima Flow</span>
            {/*<span className="text-muted-foreground truncate text-xs">*/}
            {/*  Startup Plan*/}
            {/*</span>*/}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarContentComponent() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { canAccess } = useAuthorization();

  return (
    <>
      <SidebarHeader>
        <SidebarHeaderMenu />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Bisnis & Startup</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardMenu
                .filter(item => canAccess(item.id))
                .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={collapsed ? item.label : undefined}
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalMenu
                .filter(item => canAccess(item.id))
                .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={collapsed ? item.label : undefined}
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={collapsed ? "Settings" : undefined}
            >
              <Link href={"/dashboard/settings"}>
                <Settings className="mr-2" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export function SidebarDashboard({ children }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarContentComponent />
      </Sidebar>
      <SidebarInset className="min-h-svh">
        <div className="p-4">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}