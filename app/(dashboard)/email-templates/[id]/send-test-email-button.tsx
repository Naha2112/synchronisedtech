"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { sendTestEmail } from "@/app/actions/email-templates"

interface SendTestEmailButtonProps {
  templateId: number
}

export default function SendTestEmailButton({ templateId }: SendTestEmailButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSendTestEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await sendTestEmail(templateId, email)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Test email sent successfully",
        })
        setIsOpen(false)
        setEmail("")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send test email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending the test email",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Send Test Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Test Email</DialogTitle>
          <DialogDescription>
            Send a test email to verify how your template will look.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSendTestEmail} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Test Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 