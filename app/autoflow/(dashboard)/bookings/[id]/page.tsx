import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarClock, MapPin, CalendarDays, Clock, ChevronLeft, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getBooking, type Booking, deleteBooking } from "@/app/autoflow/actions/bookings"
import { Separator } from "@/components/ui/separator"

export default async function BookingDetailPage({
  params
}: {
  params: { id: string }
}) {
  // In Next.js 15, we can access params properties directly in an async component
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()
  
  const { success, booking, message } = await getBooking(id)
  
  if (!success || !booking) {
    return notFound()
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
  
  const startTime = new Date(booking.start_time)
  const endTime = new Date(booking.end_time)
  
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/autoflow/bookings">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/autoflow/bookings/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <form action={async () => {
            "use server"
            await deleteBooking(id)
          }}>
            <Button variant="destructive" size="sm" type="submit">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </form>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{booking.title}</CardTitle>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(booking.status)}`}
              >
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-muted-foreground">
                  {format(startTime, "EEEE, MMMM d, yyyy")}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-muted-foreground">
                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                </div>
              </div>
            </div>
            
            {booking.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-muted-foreground">{booking.location}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium">Name</div>
              <Link href={`/autoflow/clients/${booking.client_id}`} className="text-muted-foreground hover:underline">
                {booking.client_name}
              </Link>
            </div>
            
            <div>
              <div className="font-medium">Email</div>
              <div className="text-muted-foreground">{booking.client_email}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {(booking.description || booking.notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.description && (
              <div>
                <div className="font-medium mb-1">Description</div>
                <div className="text-muted-foreground whitespace-pre-wrap">{booking.description}</div>
              </div>
            )}
            
            {booking.description && booking.notes && <Separator />}
            
            {booking.notes && (
              <div>
                <div className="font-medium mb-1">Notes</div>
                <div className="text-muted-foreground whitespace-pre-wrap">{booking.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 