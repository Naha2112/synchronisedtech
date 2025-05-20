"use client"

import type React from "react"
import type { User } from "@/lib/auth"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, Mail, Settings, Menu, Home, Users, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/components/ui/use-toast"
import { createPortal } from 'react-dom'

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: User
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { toast } = useToast()

  // Close mobile nav when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  // Add portal container state
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Set up portal container
  useEffect(() => {
    const container = document.createElement('div');
    container.setAttribute('id', 'user-menu-portal');
    document.body.appendChild(container);
    setPortalContainer(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include"
      })

      const data = await response.json()

      if (data.success) {
        toast({
          description: "Logged out successfully",
        })
        router.push("/login")
        router.refresh()
      } else {
        throw new Error(data.message || "Failed to logout")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        description: "Failed to logout. Please try again.",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Email Templates", href: "/email-templates", icon: Mail },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Automation", href: "/automation", icon: Clock },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const NavLinks = () => (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-md bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
            AF
          </span>
          <span>AutoFlow</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 left-0 right-0 bg-background border-b">
        <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 sm:max-w-none">
                <NavLinks />
              </SheetContent>
            </Sheet>
          )}

          <div className="flex flex-1 items-center justify-end gap-4">
            <ModeToggle />
            
            <Button
              variant="destructive"
              onClick={async () => {
                console.log('Sign out clicked');
                try {
                  await handleLogout();
                } catch (error) {
                  console.error('Sign out error:', error);
                }
              }}
              disabled={isLoggingOut}
              className="shrink-0"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>

            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0)}
                  {user.name.split(" ")[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r md:block">
          <NavLinks />
        </aside>
        <main className="flex-1">{children}</main>
      </div>

      {/* Render menu in portal */}
      {showUserMenu && portalContainer && createPortal(
        <div 
          className="fixed top-14 right-4 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          style={{
            zIndex: 9999,
          }}
        >
          <div className="px-2 py-1.5 text-sm font-medium">My Account</div>
          <div className="h-px bg-muted my-1" />
          <button
            type="button"
            className="flex w-full items-center px-2 py-1.5 text-sm hover:bg-muted rounded-sm cursor-pointer"
            onClick={() => {
              alert('Logout clicked');
              handleLogout();
              console.log('Logout clicked');
            }}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>,
        portalContainer
      )}
    </div>
  )
}
