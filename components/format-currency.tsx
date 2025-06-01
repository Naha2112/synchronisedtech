"use client"

import { useCurrency } from "./currency-provider"
import { formatCurrency } from "@/lib/utils"

interface FormatCurrencyProps {
  amount: number
  className?: string
}

export function FormatCurrency({ amount, className }: FormatCurrencyProps) {
  const { currency } = useCurrency()
  
  console.log('FormatCurrency component:', { amount, currency })
  
  return <span className={className}>{formatCurrency(amount, currency)}</span>
} 