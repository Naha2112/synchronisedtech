"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  
  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue === searchParams.get("search")) return
      
      const params = new URLSearchParams(searchParams.toString())
      if (searchValue) {
        params.set("search", searchValue)
      } else {
        params.delete("search")
      }
      
      router.push(`/autoflow/scheduled-emails?${params.toString()}`)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchValue, router, searchParams])
  
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search emails..."
        className="w-full pl-8 sm:w-[300px]"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  )
} 