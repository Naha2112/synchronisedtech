"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

export function NaturalLanguageInvoice() {
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)
    setResult(null)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: input
            }
          ]
        }),
      })

      const data = await response.json()
      
      if (data.success && data.response) {
        setResult(data.response.content)
      } else {
        setResult("Sorry, I couldn't process your request. Please try again.")
      }
    } catch (error) {
      console.error('Error processing invoice request:', error)
      setResult("An error occurred while processing your request. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const examplePrompts = [
    "Create an invoice for client: Naha regarding a boiler repair of £300",
    "Generate an invoice for John Smith for consulting services worth $1,500",
    "Make an invoice for Sarah's plumbing work costing £450",
    "Invoice for website development for ABC Company - £2,000"
  ]

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Invoice with AI</CardTitle>
          <CardDescription>
            Describe your invoice in plain English and let AI create it for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the invoice you want to create... 

Example: 'Create an invoice for client: John Smith for web design services worth £1,200'"
                className="min-h-[120px] resize-none"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={!input.trim() || isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Invoice
                  </>
                )}
              </Button>
            </div>
          </form>

          {result && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Example Prompts</CardTitle>
          <CardDescription>
            Click on any example to try it out
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(prompt)}
                className="text-left p-3 rounded-lg border hover:bg-accent transition-colors text-sm"
                disabled={isProcessing}
              >
                {prompt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 