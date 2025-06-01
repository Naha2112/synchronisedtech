"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarClock } from "lucide-react"
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
import { scheduleEmail } from "@/app/autoflow/actions/email-templates"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface ScheduleEmailButtonProps {
  templateId: number
}

export default function ScheduleEmailButton({ templateId }: ScheduleEmailButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("12:00")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleScheduleEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    // Create a new date with the selected date and time in the local timezone (UK/BST)
    const scheduledDate = new Date(date)
    if (time) {
      const [hours, minutes] = time.split(':').map(Number)
      scheduledDate.setHours(hours, minutes, 0, 0)
    }

    // Check if the date is in the future
    const now = new Date()
    if (scheduledDate < now) {
      toast({
        title: "Error",
        description: "Please select a future date and time",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Get timezone information for display purposes
      const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone
      const tzOffset = scheduledDate.getTimezoneOffset()
      const tzOffsetHours = Math.abs(Math.floor(tzOffset / 60))
      const tzOffsetMins = Math.abs(tzOffset % 60)
      const tzFormatted = `${tzOffset <= 0 ? '+' : '-'}${tzOffsetHours.toString().padStart(2, '0')}:${tzOffsetMins.toString().padStart(2, '0')}`
      
      console.log(`Scheduling email in timezone: ${timezoneName} (UTC${tzFormatted})`)
      console.log(`Local time selected: ${scheduledDate.toLocaleString()}`)
      
      // Send the date directly without timezone adjustment
      const result = await scheduleEmail({
        templateId,
        recipient: email,
        scheduledDate: scheduledDate.toISOString(),
        timezoneOffset: tzOffset
      })
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Email scheduled successfully for ${format(scheduledDate, "PPP")} at ${time} (${timezoneName})`,
        })
        setIsOpen(false)
        setEmail("")
        setDate(undefined)
        setTime("12:00")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to schedule email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while scheduling the email",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEmail("")
      setDate(undefined)
      setTime("12:00")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Email</DialogTitle>
          <DialogDescription>
            Schedule an email to be sent at a specific date and time.
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
          
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="border rounded-md p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => setDate(newDate)}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            {date && time && (
              <div className="text-sm p-3 bg-muted rounded-md">
                <p><strong>Preview:</strong></p>
                <p>Email will be sent on {format(date, "PPP")} at {time}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleScheduleEmail} disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 