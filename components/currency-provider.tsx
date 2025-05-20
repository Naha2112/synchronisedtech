"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSettingsStore } from "@/lib/settings-store"

// Define the context
type CurrencyContextType = {
  currency: string
}

const CurrencyContext = createContext<CurrencyContextType>({ currency: "USD" })

// Export hook for easy usage
export const useCurrency = () => useContext(CurrencyContext)

// Provider component
export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Get currency from settings store
  const { defaultCurrency } = useSettingsStore()
  
  return (
    <CurrencyContext.Provider value={{ currency: defaultCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
} 