"use client"

import { createContext, useContext, ReactNode, useEffect, useState } from "react"
import { useSettingsStore } from "@/lib/settings-store"

// Define the context
type CurrencyContextType = {
  currency: string
}

const CurrencyContext = createContext<CurrencyContextType>({ currency: "GBP" })

// Export hook for easy usage
export const useCurrency = () => useContext(CurrencyContext)

// Provider component
export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Get currency from settings store
  const { defaultCurrency } = useSettingsStore()
  const [currency, setCurrency] = useState("GBP") // Always start with GBP
  
  useEffect(() => {
    // Only update if we have a valid currency from settings
    if (defaultCurrency && defaultCurrency !== currency) {
      console.log('CurrencyProvider - Updating currency from', currency, 'to', defaultCurrency)
      setCurrency(defaultCurrency)
    }
  }, [defaultCurrency, currency])
  
  console.log('CurrencyProvider - Current currency:', currency, 'Store currency:', defaultCurrency)
  
  return (
    <CurrencyContext.Provider value={{ currency }}>
      {children}
    </CurrencyContext.Provider>
  )
} 