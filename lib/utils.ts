import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency?: string): string {
  // Force GBP as default currency
  const effectiveCurrency = currency || "GBP";
  
  // Create a reliable number formatter that always shows the correct currency symbol
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Map currencies to their symbols to avoid browser locale issues
  const currencySymbols: { [key: string]: string } = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥'
  };
  
  const symbol = currencySymbols[effectiveCurrency] || '£'; // Default to GBP
  const result = `${symbol}${formattedNumber}`;
  
  return result;
}

export function formatDate(date: string | Date): string {
  // Consistent date formatting for the entire application
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return String(date); // Return original value if invalid date
    }
    
    // Use a consistent format that works identically on server and client
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  } catch (error) {
    console.error("Date formatting error:", error);
    return String(date);
  }
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
