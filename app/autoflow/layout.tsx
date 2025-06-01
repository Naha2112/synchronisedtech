import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import '../globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CurrencyProvider } from "@/components/currency-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AutoFlow - Invoice & Email Automation",
  description: "Automate your invoicing and email workflows",
    generator: 'v0.dev'
}

export default function AutoflowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <CurrencyProvider>
        {children}
        <Toaster />
      </CurrencyProvider>
    </ThemeProvider>
  )
}
