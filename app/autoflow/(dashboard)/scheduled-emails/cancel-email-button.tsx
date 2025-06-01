"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cancelScheduledEmail } from "@/app/autoflow/actions/email-templates"
import { useRouter } from "next/navigation"

interface CancelEmailButtonProps {
  emailId: number
}

export default function CancelEmailButton({ emailId }: CancelEmailButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCancelEmail = async () => {
    setIsSubmitting(true)
    try {
      const result = await cancelScheduledEmail(emailId)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Email canceled successfully",
        })
        // Refresh the page to update the list
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to cancel email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while canceling the email",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <X className="mr-1 h-3 w-3" />
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Scheduled Email</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this scheduled email? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, keep it</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault()
              handleCancelEmail()
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Canceling..." : "Yes, cancel it"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 