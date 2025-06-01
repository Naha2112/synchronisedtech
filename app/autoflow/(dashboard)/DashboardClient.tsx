"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, FileText, Mail, Settings, Menu, Home, Users, Clock, Bot, Calendar, LogOut, CalendarClock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Role Badge Component
function RoleBadge({ role }: { role: string }) {
  const getBadgeStyle = () => {
    switch(role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'manager':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <span className={cn(
      'px-2 py-1 text-xs font-medium rounded-full',
      getBadgeStyle()
    )}>
      {role}
    </span>
  );
}

export function DashboardLayoutClient({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
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
    { name: "← Synchronised Tech", href: "/", icon: Home, isBack: true },
    { name: "Dashboard", href: "/autoflow/dashboard", icon: Home },
    { name: "AI Assistant", href: "/autoflow/ai", icon: Bot, highlight: true },
    { name: "Templates", href: "/autoflow/templates", icon: FileText, isNew: true },
    { name: "Invoices", href: "/autoflow/invoices", icon: FileText },
    { name: "Bookings", href: "/autoflow/bookings", icon: Calendar },
    { name: "Email Templates", href: "/autoflow/email-templates", icon: Mail },
    { name: "Scheduled Emails", href: "/autoflow/scheduled-emails", icon: CalendarClock },
    { name: "Bulk Email Sender", href: "/autoflow/bulk-email", icon: Mail },
    { name: "Clients", href: "/autoflow/clients", icon: Users },
    { name: "Automation", href: "/autoflow/automation", icon: Clock },
    { name: "Settings", href: "/autoflow/settings", icon: Settings },
  ]

  const NavLinks = () => (
    <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 bg-white dark:bg-gray-900 border-r border-gray-700/50 dark:border-gray-700/50 border-gray-200 h-full relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-5 opacity-10"></div>
      <div 
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b opacity-20"
        style={{ background: `linear-gradient(to bottom, rgb(var(--color-primary) / 0.2), transparent)` }}
      ></div>
      
      <div className="relative z-10">
        <div className="flex h-16 items-center border-b border-gray-700/50 dark:border-gray-700/50 border-gray-200 px-6 bg-gray-800/50 dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm">
          <Link href="/autoflow/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/synchronisetech-logo.svg"
                alt="Synchronised Tech"
                width={32}
                height={32}
                className="group-hover:scale-110 transition-transform duration-200"
                style={{ filter: `drop-shadow(0 0 8px rgb(var(--color-primary) / 0.3))` }}
              />
              <div 
                className="absolute -inset-1 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: `rgb(var(--color-primary) / 0.2)` }}
              ></div>
            </div>
            <div>
              <span 
                className="text-lg font-bold text-white dark:text-white text-gray-900 transition-colors group-hover:text-blue-300 dark:group-hover:text-blue-300 group-hover:text-blue-600"
                style={{ '--tw-text-opacity': '1', color: `rgb(var(--color-accent))` } as React.CSSProperties}
              >
                AutoFlow
              </span>
              <div className="text-xs text-gray-400 dark:text-gray-400 text-gray-600 group-hover:text-gray-300 dark:group-hover:text-gray-300 group-hover:text-gray-500 transition-colors">by Synchronised Tech</div>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-medium space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              const isBackButton = item.isBack
              
              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group relative overflow-hidden",
                      isBackButton
                        ? "text-gray-400 dark:text-gray-400 text-gray-600 hover:text-blue-300 dark:hover:text-blue-300 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-600/20 dark:hover:from-gray-700/30 dark:hover:to-gray-600/20 hover:from-gray-100/50 hover:to-gray-200/30 border border-gray-700/50 dark:border-gray-700/50 border-gray-300 hover:border-blue-500/30 dark:hover:border-blue-500/30"
                        : isActive 
                          ? `text-white dark:text-white text-gray-900 border shadow-lg` 
                          : item.highlight 
                            ? "text-blue-400 dark:text-blue-400 text-blue-600 font-semibold hover:shadow-lg"
                            : "text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/30 dark:hover:from-gray-700/50 dark:hover:to-gray-600/30 hover:from-gray-100/50 hover:to-gray-200/30 hover:text-white dark:hover:text-white hover:text-gray-900 hover:shadow-lg"
                    )}
                    style={isActive && !isBackButton ? {
                      background: `linear-gradient(to right, rgb(var(--color-primary) / 0.3), rgb(var(--color-primary) / 0.2))`,
                      borderColor: `rgb(var(--color-primary) / 0.3)`,
                      boxShadow: `0 4px 12px rgb(var(--color-primary) / 0.2)`
                    } : item.highlight ? {
                      background: `linear-gradient(to right, rgb(var(--color-primary) / 0.2), rgb(var(--color-primary) / 0.1))`,
                      color: `rgb(var(--color-accent))`
                    } : {}}
                  >
                    {isActive && !isBackButton && (
                      <div 
                        className="absolute inset-0 opacity-50"
                        style={{ background: `linear-gradient(to right, rgb(var(--color-primary) / 0.1), transparent)` }}
                      ></div>
                    )}
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive && !isBackButton
                        ? "drop-shadow-lg" 
                        : item.highlight 
                          ? "group-hover:scale-110" 
                          : "group-hover:scale-110"
                    )} 
                    style={isActive && !isBackButton ? {
                      color: `rgb(var(--color-accent))`
                    } : item.highlight ? {
                      color: `rgb(var(--color-primary))`
                    } : {}} />
                    <span className="relative z-10">{item.name}</span>
                    {item.highlight && (
                      <div className="ml-auto">
                        <div 
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: `rgb(var(--color-primary))` }}
                        ></div>
                      </div>
                    )}
                    {item.isNew && (
                      <div className="ml-auto">
                        <div className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-black text-xs font-bold rounded-full">
                          NEW
                        </div>
                      </div>
                    )}
                  </Link>
                  {isBackButton && (
                    <div className="mx-4 my-3 h-px bg-gradient-to-r from-transparent via-gray-600/50 dark:via-gray-600/50 via-gray-300/50 to-transparent"></div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 from-slate-50 via-gray-50 to-slate-100 text-white dark:text-white text-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-5 opacity-10"></div>
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `rgb(var(--color-primary) / 0.05)` }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `rgb(var(--color-primary-dark) / 0.05)` }}
      ></div>
      
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-700/50 dark:border-gray-700/50 border-gray-200 bg-gray-900/80 dark:bg-gray-900/80 bg-white/80 backdrop-blur-xl px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90 dark:from-gray-900/90 dark:to-gray-800/90 from-white/90 to-gray-50/90"></div>
        
        {isMobile && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden border-gray-600 dark:border-gray-600 border-gray-300 bg-gray-800/80 dark:bg-gray-800/80 bg-white/80 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100 text-white dark:text-white text-gray-900 backdrop-blur-sm relative z-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:max-w-none p-0 bg-gray-900/95 dark:bg-gray-900/95 bg-white/95 backdrop-blur-xl">
              <NavLinks />
            </SheetContent>
          </Sheet>
        )}

        <div className="flex flex-1 items-center justify-end gap-4 relative z-10">
          <ThemeToggle />
          <div className="relative user-menu-container">
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 hover:bg-gray-100/50 text-white dark:text-white text-gray-900 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 dark:hover:shadow-gray-900/20 hover:shadow-gray-200/20 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
            >
              <Avatar 
                className="h-8 w-8 ring-2 transition-all duration-300"
                style={{ 
                  ringColor: `rgb(var(--color-primary) / 0.3)`,
                  '--tw-ring-color': `rgb(var(--color-primary) / 0.5)`
                } as React.CSSProperties}
              >
                <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                <AvatarFallback 
                  className="text-white dark:text-white text-gray-900 font-semibold"
                  style={{ background: `linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-primary-dark)))` }}
                >
                  {user?.name?.charAt(0) || "U"}
                  {user?.name?.split(" ")[1]?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex text-gray-200 dark:text-gray-200 text-gray-700 font-medium">{user?.name || "User"}</span>
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-600/50 dark:border-gray-600/50 border-gray-300/50 bg-gray-800/90 dark:bg-gray-800/90 bg-white/90 backdrop-blur-xl p-3 shadow-2xl shadow-black/50 dark:shadow-black/50 shadow-gray-500/20 z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 dark:from-gray-700/50 dark:to-gray-800/50 from-gray-100/50 to-gray-200/50 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="px-3 py-3 text-sm font-medium flex items-center justify-between text-white dark:text-white text-gray-900 border-b border-gray-600/30 dark:border-gray-600/30 border-gray-300/30 mb-2">
                    <div>
                      <div className="font-semibold">{user?.name || "User"}</div>
                      <div className="text-xs text-gray-300 dark:text-gray-300 text-gray-600">{user?.email || "user@example.com"}</div>
                    </div>
                    {user?.role && <RoleBadge role={user.role} />}
                  </div>
                  
                  <Link
                    href="/autoflow/settings"
                    className="flex w-full items-center px-3 py-3 text-sm hover:bg-gray-700/50 dark:hover:bg-gray-700/50 hover:bg-gray-100/50 rounded-xl cursor-pointer text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-gray-900 transition-all duration-200 group"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="mr-3 h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center px-3 py-3 text-sm hover:bg-red-600/20 rounded-xl cursor-pointer text-red-400 dark:text-red-400 text-red-600 hover:text-red-300 dark:hover:text-red-300 hover:text-red-700 transition-all duration-200 group"
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        <aside className="hidden w-72 md:block relative">
          <NavLinks />
        </aside>
        <main className="flex-1 bg-gradient-to-br from-slate-950/50 via-gray-950/50 to-slate-900/50 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-slate-900/50 from-slate-50/50 via-gray-50/50 to-slate-100/50 backdrop-blur-sm relative">
          {children}
        </main>
      </div>
    </div>
  )
} 