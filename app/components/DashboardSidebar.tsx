"use client"

import type { LucideIcon } from "lucide-react"
import {
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

export type MenuItem = {
  name: string
  url: string
  icon: LucideIcon
}

export type Role = "seeker" | "recruiter" | "admin"

export const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seekers", icon: LayoutDashboard },
    { name: "Jobs", url: "/dashboard/seekers/jobs", icon: Briefcase },
    {
      name: "Saved Jobs",
      url: "/dashboard/seekers/saved-jobs",
      icon: Bookmark,
    },
    {
      name: "Applications",
      url: "/dashboard/seekers/applications",
      icon: FileText,
    },
    { name: "Billing", url: "/dashboard/seekers/billing", icon: CreditCard },
    { name: "Settings", url: "/dashboard/seekers/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    {
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    {
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { name: "Payments", url: "/dashboard/admin/payments", icon: CreditCard },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

export function DashboardSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const role = (session?.user?.type || "seeker") as Role

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarMenu>
          {menuItemsByRole[role].map((items) => (
            <SidebarMenuItem key={items.name}>
              <SidebarMenuButton
                render={<Link href={items.url} />}
                isActive={pathname === items.url}
              >
                <items.icon />
                <span>{items.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
