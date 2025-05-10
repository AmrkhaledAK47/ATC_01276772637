
import React, { useEffect } from "react"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link, useParams } from "react-router-dom"
import { format, add } from "date-fns"
import { Calendar, Check, Clock, Download, MapPin, Share2, Ticket } from "lucide-react"
import confetti from "canvas-confetti"
import { useEvents } from "@/hooks/useEvents"
import { BadgeStatus } from "@/components/ui/badge-status"

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>()
  const { getEvent } = useEvents()
  const event = getEvent(id || "")

  // Placeholder for booking details
  const bookingDetails = {
    bookingNumber: `B${Date.now().toString().slice(-6)}`,
    bookingDate: new Date(),
    ticketCount: 1,
  }

  // Launch confetti effect on load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  // If event not found, show error
  if (!event) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the event you're looking for.</p>
          <Button asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your ticket has been booked successfully. Here's your booking confirmation.
          </p>
        </div>

        {/* Booking Card */}
        <Card className="mb-8 overflow-hidden border-2 border-primary/20">
          <div className="bg-primary/5 p-6 flex items-center justify-between border-b">
            <div className="flex items-center">
              <Ticket className="h-6 w-6 text-primary mr-2" />
              <h2 className="font-bold text-xl">Booking Confirmation</h2>
            </div>
            <BadgeStatus variant="success">Confirmed</BadgeStatus>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Event Details */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="md:w-1/3 aspect-square rounded-lg overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(event.date, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking Number:</span>
                    <span className="font-mono">{bookingDetails.bookingNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking Date:</span>
                    <span>{format(bookingDetails.bookingDate, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tickets:</span>
                    <span>{bookingDetails.ticketCount} {bookingDetails.ticketCount > 1 ? "tickets" : "ticket"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">
                      {event.price === 0 ? "Free" : `$${(event.price * bookingDetails.ticketCount).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-4 p-6 pt-0">
            <Button className="flex-1 sm:flex-none" asChild>
              <a href="#" download>
                <Download className="h-4 w-4 mr-2" /> Download Ticket
              </a>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center space-y-6">
          <div className="p-4 bg-muted rounded-lg inline-block mx-auto">
            <p className="text-sm text-muted-foreground">
              We've sent a copy of your booking confirmation to your email.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/user/dashboard">View My Bookings</Link>
            </Button>
            <Button asChild>
              <Link to="/events">Browse More Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default BookingConfirmation
