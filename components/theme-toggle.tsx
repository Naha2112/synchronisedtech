'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "shrink-0 border-gray-600/50 dark:border-gray-600/50 border-gray-300 bg-gray-800/50 dark:bg-gray-800/50 bg-white/50 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 hover:bg-gray-100/50 text-white dark:text-white text-gray-900 backdrop-blur-sm",
          className
        )}
      >
        <div className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "shrink-0 border-gray-600/50 dark:border-gray-600/50 border-gray-300 bg-gray-800/50 dark:bg-gray-800/50 bg-white/50 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 hover:bg-gray-100/50 text-white dark:text-white text-gray-900 backdrop-blur-sm transition-all duration-300 hover:shadow-lg relative overflow-hidden group hover:border-blue-500/30",
        className
      )}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 