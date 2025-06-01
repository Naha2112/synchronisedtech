import type { Metadata } from "next"
import { DashboardLayoutClient } from "./DashboardClient"
import { SettingsProvider } from "@/contexts/SettingsContext"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "AutoFlow - Business Automation Platform",
  description: "Streamline your business with AI-powered invoice management, client tracking, and automation tools.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SettingsProvider>
      <DashboardLayoutClient user={{}}>{children}</DashboardLayoutClient>
      <Toaster />
    </SettingsProvider>
  )
} 