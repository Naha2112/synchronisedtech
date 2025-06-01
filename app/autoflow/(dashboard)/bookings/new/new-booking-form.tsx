"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { createBooking } from "@/app/autoflow/actions/bookings"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { TimeField } from "@/components/ui/time-field"
import { getClients } from "@/app/autoflow/actions/clients"

export function NewBookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(dateParam ? new Date(dateParam) : new Date())
  const [startTime, setStartTime] = useState<Date | undefined>(dateParam ? new Date(dateParam) : new Date())
  const [endTime, setEndTime] = useState<Date | undefined>()
  const [clientId, setClientId] = useState<number | undefined>()
  const [status, setStatus] = useState<string>("scheduled")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [clients, setClients] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set default start and end times
    if (dateParam) {
      const today = new Date(dateParam)
      // Set default start time to next hour
      const startHour = new Date(today)
      startHour.setHours(today.getHours() + 1, 0, 0, 0)
      setStartTime(startHour)
      
      // Set default end time to one hour after start
      const endHour = new Date(startHour)
      endHour.setHours(startHour.getHours() + 1)
      setEndTime(endHour)
    } else {
      // Set default start time to next hour
      const now = new Date()
      const startHour = new Date(now)
      startHour.setHours(now.getHours() + 1, 0, 0, 0)
      setStartTime(startHour)
      
      // Set default end time to one hour after start
      const endHour = new Date(startHour)
      endHour.setHours(startHour.getHours() + 1)
      setEndTime(endHour)
    }

    // Load clients
    async function loadClients() {
      try {
        const { success, clients: clientsData } = await getClients()
        if (success && Array.isArray(clientsData)) {
          setClients(clientsData)
        }
      } catch (error) {
        console.error("Error loading clients:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [dateParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!date || !startTime || !endTime || !clientId) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      // Combine date with times
      const start = new Date(date)
      start.setHours(
        startTime.getHours(),
        startTime.getMinutes(),
        0,
        0
      )
      
      const end = new Date(date)
      end.setHours(
        endTime.getHours(),
        endTime.getMinutes(),
        0,
        0
      )

      // Format dates for API
      const startISO = start.toISOString()
      const endISO = end.toISOString()

      const result = await createBooking({
        title,
        description,
        start_time: startISO,
        end_time: endISO,
        client_id: clientId,
        status: status as any,
        location,
        notes
      })

      if (result.success) {
        router.push("/autoflow/bookings")
      } else {
        setError(result.message || "Failed to create booking")
      }
    } catch (err) {
      console.error("Error creating booking:", err)
      setError("An error occurred while creating the booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">New Booking</h1>
        <Button variant="outline" asChild>
          <Link href="/autoflow/bookings">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title<span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client<span className="text-red-500">*</span></Label>
                <Select 
                  value={clientId?.toString()} 
                  onValueChange={(value) => setClientId(parseInt(value))}
                  required
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date<span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time<span className="text-red-500">*</span></Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <TimeField
                    value={startTime}
                    onChange={setStartTime}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time<span className="text-red-500">*</span></Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <TimeField
                    value={endTime}
                    onChange={setEndTime}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/autoflow/bookings">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Booking"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
} 