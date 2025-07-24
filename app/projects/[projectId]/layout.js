// app/projects/[projectId]/layout.js

import { SidebarProjects } from "@/components/organisms/SidebarProjects";

export default function ProjectLayout({ children }) {
  return <SidebarProjects>{children}</SidebarProjects>;
}