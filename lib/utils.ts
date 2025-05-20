import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function generateInvoiceNumber(prefix = "INV-", padLength = 3): string {
  // Get current timestamp
  const timestamp = Date.now().toString().slice(-6)

  // Generate a random number between 100 and 999
  const random = Math.floor(Math.random() * 900 + 100)

  // Combine and pad
  const number = `${timestamp}${random}`.slice(-padLength)

  return `${prefix}${number.padStart(padLength, "0")}`
}

export function calculateDueDate(issueDate: Date, days = 14): Date {
  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + days)
  return dueDate
}

export function calculateInvoiceTotal(items: Array<{ quantity: number; rate: number }>): number {
  return items.reduce((total, item) => total + item.quantity * item.rate, 0)
}
