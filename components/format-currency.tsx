"use client"

import { useCurrency } from "./currency-provider"
import { formatCurrency } from "@/lib/utils"

interface FormatCurrencyProps {
  amount: number
  className?: string
}

export function FormatCurrency({ amount, className }: FormatCurrencyProps) {
  const { currency } = useCurrency()
  return <span className={className}>{formatCurrency(amount, currency)}</span>
} 