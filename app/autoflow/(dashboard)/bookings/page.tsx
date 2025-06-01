import { Suspense } from "react"
import Link from "next/link"
import { format, addDays, startOfWeek, endOfWeek, isToday, isSameDay, getDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Plus, ArrowLeft, ArrowRight } from "lucide-react"
import { getBookings, type Booking } from "@/app/autoflow/actions/bookings"
import { formatISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { query } from "@/lib/db"

// Ensure consistent date formatting across the application
const DATE_FORMAT = {
  fullDate: "EEEE, MMMM d, yyyy",
  shortDate: "MMM d, yyyy",
  dayMonth: "MMMM d",
  day: "d",
  weekday: "EEEE",
  time: "h:mm a",
  isoDate: "yyyy-MM-dd"
}

export const metadata = {
  title: "Bookings | AutoFlow",
}

function WeeklyCalendarSkeleton() {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="skeleton w-32 h-8"></div>
        <div className="flex gap-2">
          <div className="skeleton w-10 h-10 rounded-full"></div>
          <div className="skeleton w-10 h-10 rounded-full"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center p-2">
            <div className="skeleton w-full h-6 mb-2"></div>
            <div className="skeleton w-12 h-12 rounded-full mx-auto"></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-4 h-[500px]">
        {daysOfWeek.map((day) => (
          <div key={day} className="border rounded-lg p-2">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="skeleton w-full h-16 mb-2 rounded-md"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

async function Calendar({ date = new Date() }: { date?: Date }) {
  // Get start and end of week
  const weekStart = startOfWeek(date, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 })
  
  // Format date range for display
  const dateRange = `${format(weekStart, DATE_FORMAT.dayMonth)} - ${format(weekEnd, DATE_FORMAT.shortDate)}`
  
  // Fetch bookings for this week
  const startDateISO = formatISO(weekStart, { representation: 'date' })
  const endDateISO = formatISO(addDays(weekEnd, 1), { representation: 'date' })  // Add 1 day to include the end date
  const { success, bookings = [] } = await getBookings(startDateISO, endDateISO)
  
  // Create array of days for the week
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Group bookings by day
  const bookingsByDay: Record<string, Booking[]> = {}
  days.forEach(day => {
    const dayStr = format(day, DATE_FORMAT.isoDate)
    bookingsByDay[dayStr] = []
  })

  if (success && Array.isArray(bookings) && bookings.length > 0) {
    bookings.forEach((booking: Booking) => {
      const bookingDate = format(new Date(booking.start_time), DATE_FORMAT.isoDate)
      if (bookingsByDay[bookingDate]) {
        bookingsByDay[bookingDate].push(booking)
      }
    })
  }

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' // scheduled
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{dateRange}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/autoflow/bookings?date=${format(addDays(weekStart, -7), DATE_FORMAT.isoDate)}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/autoflow/bookings?date=${format(addDays(weekStart, 7), DATE_FORMAT.isoDate)}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day.toString()} className="text-center p-2">
            <div className="font-medium text-sm text-muted-foreground">
              {format(day, DATE_FORMAT.weekday)}
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold ${
              isToday(day) 
                ? 'bg-primary text-primary-foreground' 
                : ''
            }`}>
              {format(day, DATE_FORMAT.day)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-4 h-[500px]">
        {days.map((day) => {
          const dayKey = format(day, DATE_FORMAT.isoDate)
          const dayBookings = bookingsByDay[dayKey] || []
          
          return (
            <div 
              key={day.toString()} 
              className={`border rounded-lg p-2 overflow-y-auto ${
                isToday(day) ? 'border-primary' : ''
              }`}
            >
              {dayBookings.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link href={`/autoflow/bookings/new?date=${format(day, DATE_FORMAT.isoDate)}`}>
                      <Plus className="h-4 w-4" />
                      Add
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {dayBookings.map((booking: Booking) => (
                    <Link key={booking.id} href={`/autoflow/bookings/${booking.id}`}>
                      <div className="border rounded p-2 hover:bg-accent text-sm cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium truncate">{booking.title}</div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ml-1 ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {format(new Date(booking.start_time), DATE_FORMAT.time)} - {format(new Date(booking.end_time), DATE_FORMAT.time)}
                        </div>
                        <div className="text-xs truncate">{booking.client_name}</div>
                      </div>
                    </Link>
                  ))}
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link href={`/autoflow/bookings/new?date=${format(day, DATE_FORMAT.isoDate)}`}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

async function BookingsList() {
  // Get upcoming bookings
  const { success, bookings = [] } = await getBookings()
  
  if (!success || !Array.isArray(bookings) || bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No bookings found</p>
            <Button asChild>
              <Link href="/autoflow/bookings/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Booking
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Group bookings by date
  const bookingsByDate: Record<string, Booking[]> = {}
  
  bookings.forEach((booking: Booking) => {
    const bookingDate = format(new Date(booking.start_time), DATE_FORMAT.isoDate)
    if (!bookingsByDate[bookingDate]) {
      bookingsByDate[bookingDate] = []
    }
    bookingsByDate[bookingDate].push(booking)
  })
  
  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' // scheduled
    }
  }
  
  return (
    <div className="space-y-6">
      {Object.entries(bookingsByDate).map(([date, dayBookings]) => (
        <div key={date}>
          <h3 className="text-lg font-medium mb-3 sticky top-0 bg-background py-2">
            {isToday(new Date(date)) ? 'Today' : format(new Date(date), DATE_FORMAT.fullDate)}
          </h3>
          <div className="space-y-3">
            {dayBookings.map((booking: Booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <Link href={`/autoflow/bookings/${booking.id}`} className="block hover:opacity-70">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{booking.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {format(new Date(booking.start_time), DATE_FORMAT.time)} - {format(new Date(booking.end_time), DATE_FORMAT.time)}
                      </div>
                      <div className="sm:ml-4">Client: {booking.client_name}</div>
                      {booking.location && (
                        <div className="sm:ml-4">Location: {booking.location}</div>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-6">
      {Array(3).fill(null).map((_, dateIndex) => (
        <div key={dateIndex}>
          <div className="skeleton h-7 w-64 mb-3"></div>
          <div className="space-y-3">
            {Array(2).fill(null).map((_, bookingIndex) => (
              <Card key={bookingIndex}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="skeleton h-6 w-48"></div>
                    <div className="skeleton h-6 w-24"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="skeleton h-5 w-32"></div>
                    <div className="skeleton h-5 w-40 sm:ml-4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function BookingsPage({ 
  searchParams 
}: { 
  searchParams?: { date?: string }
}) {
  // Await searchParams to prevent hydration errors with client-side rendering
  const { date: dateParam } = searchParams || {}
  const date = dateParam ? new Date(dateParam) : new Date()
  
  // Debug: Check database records
  const dbDebug = await query("SELECT COUNT(*) as count FROM bookings") as any[]
  const bookingCount = dbDebug[0]?.count || 0
  
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Bookings ({bookingCount} total)</h1>
        <Button asChild>
          <Link href="/autoflow/bookings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <Suspense fallback={<WeeklyCalendarSkeleton />}>
            <Calendar date={date} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <Suspense fallback={<ListSkeleton />}>
            <BookingsList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
} 