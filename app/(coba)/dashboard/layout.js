// app/dashboard/layout.js

import { SidebarDashboard } from "@/components/organisms/SidebarDashboard";

export default function DashboardLayout({ children }) {
  return <SidebarDashboard>{children}</SidebarDashboard>;
}