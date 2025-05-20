"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  CreditCard,
  Settings,
  LineChart,
  Mail,
  FileCog,
  Zap,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function MainNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="group flex flex-col gap-4 py-2">
      <nav className="grid gap-1 px-2">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            isActive("/dashboard") ? "bg-muted hover:bg-muted" : ""
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
        
        <Link
          href="/clients"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            isActive("/clients") ? "bg-muted hover:bg-muted" : ""
          )}
        >
          <Users className="mr-2 h-4 w-4" />
          Clients
        </Link>
        
        <Link
          href="/invoices"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            isActive("/invoices") ? "bg-muted hover:bg-muted" : ""
          )}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Invoices
        </Link>
        
        <Link
          href="/email-templates"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            isActive("/email-templates") ? "bg-muted hover:bg-muted" : ""
          )}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email Templates
        </Link>
        
        <Link
          href="/automation"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            isActive("/automation") ? "bg-muted hover:bg-muted" : ""
          )}
        >
          <Zap className="mr-2 h-4 w-4" />
          Automation
        </Link>
        
        <Link
          href="/analytics"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            isActive("/analytics") ? "bg-muted hover:bg-muted" : ""
          )}
        >
          <LineChart className="mr-2 h-4 w-4" />
          Analytics
        </Link>
        
        <Link
          href="/settings"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            isActive("/settings") ? "bg-muted hover:bg-muted" : ""
          )}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </nav>
    </div>
  )
} 