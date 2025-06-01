"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Command } from "lucide-react"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
          data-search-trigger
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search everything...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Quick Search
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search invoices, clients, settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
            <div className="grid gap-2">
              <Button variant="ghost" className="justify-start">
                <Search className="mr-2 h-4 w-4" />
                Create New Invoice
              </Button>
              <Button variant="ghost" className="justify-start">
                <Search className="mr-2 h-4 w-4" />
                Add New Client
              </Button>
              <Button variant="ghost" className="justify-start">
                <Search className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </div>

          {query && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Search Results</h4>
              <div className="text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 