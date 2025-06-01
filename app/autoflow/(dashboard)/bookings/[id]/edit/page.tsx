"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, Clock, ChevronLeft } from "lucide-react"
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
import { Calendar } from "@/components/ui/calendar"
import { TimeField } from "@/components/ui/time-field"
import { cn } from "@/lib/utils"
import { getBooking, updateBooking } from "@/app/autoflow/actions/bookings"
import { getClients } from "@/app/autoflow/actions/clients"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditBookingPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter()
  const id = parseInt(params.id)
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState<Date | undefined>(new Date())
  const [endTime, setEndTime] = useState<Date | undefined>(new Date())
  const [clientId, setClientId] = useState<number | undefined>()
  const [status, setStatus] = useState<string>("scheduled")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    async function loadBookingAndClients() {
      try {
        // Load booking data
        const { success, booking } = await getBooking(id)
        if (success && booking) {
          const bookingStartTime = new Date(booking.start_time)
          const bookingEndTime = new Date(booking.end_time)
          
          setTitle(booking.title)
          setDescription(booking.description || "")
          setDate(bookingStartTime)
          setStartTime(bookingStartTime)
          setEndTime(bookingEndTime)
          setClientId(booking.client_id)
          setStatus(booking.status)
          setLocation(booking.location || "")
          setNotes(booking.notes || "")
        } else {
          setError("Booking not found")
        }
        
        // Load clients
        const { success: clientSuccess, clients: clientsData } = await getClients()
        if (clientSuccess && Array.isArray(clientsData)) {
          setClients(clientsData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load booking data")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadBookingAndClients()
  }, [id])

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

      const result = await updateBooking(id, {
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
        router.push(`/bookings/${id}`)
      } else {
        setError(result.message || "Failed to update booking")
      }
    } catch (err) {
      console.error("Error updating booking:", err)
      setError("An error occurred while updating the booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/bookings/${id}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <span className="ml-2">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Edit Booking</h1>
        <Button variant="outline" asChild>
          <Link href={`/autoflow/bookings/${id}`}>Cancel</Link>
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
              <Link href={`/autoflow/bookings/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Booking"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
} 