// components/organisms/SidebarDashboard.js
"use client";

import { useState } from "react";
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

import { Home, Users, DollarSign,ChevronLeft,Image , BarChart2, Settings, FlaskConical, ClipboardList, PenTool, LayoutTemplate, Film, GalleryHorizontal, BookOpen, Layers, Target, Coins, Users as UsersIcon, FileText, Upload, Brain, Palette, ScrollText, Timer, Code, Share2, LineChart, LayoutDashboard, Lightbulb, Scissors, Video, Volume2, MessageSquare, CheckCircle, Download, ListChecks, Link as LinkIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import Logo from "@/components/atoms/Logo";

const projectMenu = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/projects/[projectId]",
  },
  {
    label: "Pre-Production",
    icon: Film,
    subItems: [
      { label: "Research", icon: Brain, href: "/projects/[projectId]/research" },
      { label: "Script", icon: ScrollText, href: "/projects/[projectId]/script" },
      { label: "Storyboard", icon: LayoutTemplate, href: "/projects/[projectId]/storyboard" },
    ],
  },
  {
    label: "Production",
    icon: PenTool,
    subItems: [
      // { label: "Animation", icon: Film, href: "/projects/[projectId]/production/animation" },
      { label: "Assets", icon: Layers, href: "/projects/[projectId]/production/assets" },
      { label: "App Project", icon: FileText, href: "/projects/[projectId]/production/app-project" },
      // { label: "Mentahan", icon: FileText, href: "/projects/[projectId]/production/mentah-video" },
      // { label: "Timeline", icon: Timer, href: "/projects/[projectId]/production/timeline" },
    ],
  },
  {
    label: "Post-Production",
    icon: Scissors,
    subItems: [
      // { label: "Edit/VFX", icon: Video, href: "/projects/[projectId]/post-production/edit-vfx" },
      // { label: "Sound Design", icon: Volume2, href: "/projects/[projectId]/post-production/sound-design" },
      { label: "Video", icon: Video, href: "/projects/[projectId]/post-production/video" },
      { label: "Thumbnail", icon: Image, href: "/projects/[projectId]/post-production/thumbnail" },
    ],
  },
  {
    label: "Final",
    icon: CheckCircle,
    subItems: [
      { label: "Review", icon: MessageSquare, href: "/projects/[projectId]/final/review" },
      // { label: "Distribution", icon: Share2, href: "/projects/[projectId]/final/distribution" },
      // { label: "Analytics", icon: LineChart, href: "/projects/[projectId]/final/analytics" },
    ],
  },
  {
    label: "Project Management",
    icon: ClipboardList,
    subItems: [
      { label: "Budget", icon: Coins, href: "/projects/[projectId]/management/budget" },
      { label: "Tasks", icon: ListChecks, href: "/projects/[projectId]/management/tasks" },
      { label: "Team", icon: UsersIcon, href: "/projects/[projectId]/management/team" },
    ],
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
  const params = useParams();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [openItems, setOpenItems] = useState({});

  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;

  const toggleOpen = (label) => {
    setOpenItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Always use projectMenu, dashboardMenu is removed
  const currentMenu = projectMenu.map(item => {
    // Ensure item exists and its href is a string
    const baseHref = (item && typeof item.href === 'string') ? item.href : '';
    let processedHref = baseHref;

    if (baseHref.includes('[projectId]') && projectId !== undefined) {
      processedHref = String(baseHref).replace("[projectId]", String(projectId));
    }

    let newSubItems = item.subItems;
    if (newSubItems) {
      newSubItems = newSubItems.map(sub => {
        // Ensure sub exists and its href is a string
        const baseSubHref = (sub && typeof sub.href === 'string') ? sub.href : '';
        let processedSubHref = baseSubHref;

        if (baseSubHref.includes('[projectId]') && projectId !== undefined) {
          processedSubHref = String(baseSubHref).replace("[projectId]", String(projectId));
        }
        return { ...sub, href: processedSubHref };
      });
    }

    return {
      ...item,
      href: processedHref,
      subItems: newSubItems
    };
  });

  return (
    <>
      <SidebarHeader>
        <SidebarHeaderMenu />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="border border-border rounded-md px-3 py-2 flex items-center gap-2">
                <Link href="/dashboard/projects">
                  <ChevronLeft />
                  <span>Back</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup>
          <SidebarGroupLabel>{projectId ? `Project: ${projectId}` : "Project Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentMenu.map((item) => {
                const isParentActive = item.subItems?.some(sub => pathname === sub.href);
                const isOpen = openItems[item.label] || false;

                if (item.subItems && !collapsed) {
                  return (
                    <SidebarMenuItem key={item.label} className="flex flex-col items-start w-full">
                      <SidebarMenuButton
                        onClick={() => toggleOpen(item.label)}
                        className="w-full justify-between"
                        isActive={isParentActive}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </SidebarMenuButton>
                      {isOpen && (
                        <SidebarMenu className="ml-5 mt-2 w-[calc(100%-1.25rem)] space-y-1 border-l pl-4">
                          {item.subItems.map(subItem => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <SidebarMenuItem key={subItem.label}>
                                <SidebarMenuButton asChild isActive={isSubActive} size="sm" className="w-full justify-start">
                                  <Link href={subItem.href || '#'}>
                                    <subItem.icon className="mr-2 h-4 w-4" />
                                    <span>{subItem.label}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      )}
                    </SidebarMenuItem>
                  );
                }
                
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={collapsed ? item.label : undefined}
                    >
                      <Link href={item.href || '#'}>
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
              <Link href="/dashboard/settings">
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

export function SidebarProjects({ children }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarContentComponent />
      </Sidebar>
      <SidebarInset className="h-svh ">
        <div className="p-4">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}