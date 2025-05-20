import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, FileText, Mail } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-md bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
            AF
          </span>
          <span>AutoFlow</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Automate Your Invoicing & Email Workflows
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Save time and reduce errors with AutoFlow. Create, send, and track invoices automatically.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-muted/50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Invoice Automation</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Streamline Your Invoicing Process</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create, send, and track invoices with ease. Set up recurring invoices and get paid faster.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Create and send professional invoices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Schedule recurring invoices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Track payment status in real-time</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-2">
                  <FileText className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-primary opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex justify-center lg:order-last">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-2">
                  <Mail className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-primary opacity-20" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Email Automation</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Personalized Email Campaigns</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create email templates with variables and trigger emails based on actions or schedules.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Design custom email templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Automate email sequences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Track email engagement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-muted/50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Automate Your Business?</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of businesses saving time and money with AutoFlow.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded-md bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
              AF
            </span>
            <span>AutoFlow</span>
          </div>
          <nav className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Features
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Pricing
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">© 2025 AutoFlow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
