import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar></DashboardSidebar>
      <main className="min-w-0 flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}