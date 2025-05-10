
import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import confetti from "canvas-confetti"
import { format, add } from "date-fns"
import { CalendarDays, Clock, MapPin, Share2, Download, Mail, Calendar, Phone, User, Users, CreditCard, CheckCircle2, Printer, QrCode } from "lucide-react"
import { motion } from "framer-motion"
import { useEvents } from "@/context/EventContext"
import { useAuth } from "@/context/AuthContext"

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>()
  const { bookings, events } = useEvents()
  const { user } = useAuth()
  const [booking, setBooking] = useState<any>(null)
  const [event, setEvent] = useState<any>(null)
  
  useEffect(() => {
    // Find booking and event
    const bookingData = bookings.find(b => b.id === id)
    
    if (bookingData) {
      setBooking(bookingData)
      const eventData = events.find(e => e.id === bookingData.eventId)
      if (eventData) {
        setEvent(eventData)
      }
    }
    
    // Trigger confetti animation
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    
    triggerConfetti()
    const confettiInterval = setInterval(triggerConfetti, 3000)
    
    return () => clearInterval(confettiInterval)
  }, [id, bookings, events])
  
  if (!booking || !event) {
    return (
      <MainLayout>
        <div className="container py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
            <p className="text-muted-foreground mb-8">The booking confirmation you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/user/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Calculate ticket valid until date (1 day after event)
  const validUntilDate = add(new Date(event.date), { days: 1 })
  
  return (
    <MainLayout>
      <div className="container py-12">
        {/* Success Animation */}
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CheckCircle2 className="h-14 w-14 text-success" />
            </motion.div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-3xl font-bold text-center mb-2"
          >
            Booking Confirmed!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-muted-foreground text-center max-w-lg"
          >
            Your booking for <span className="font-medium text-foreground">{event.title}</span> has been confirmed. 
            We've sent the details to your email address.
          </motion.p>
        </div>
        
        {/* Ticket and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            {/* Digital Ticket */}
            <Card className="overflow-hidden mb-6">
              <div className="relative bg-primary text-primary-foreground p-6">
                <div className="absolute top-0 right-0 p-4 flex gap-2">
                  <Button variant="outline" size="icon" className="bg-background/20 hover:bg-background/40 backdrop-blur">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-background/20 hover:bg-background/40 backdrop-blur">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold mb-1">Digital Ticket</h2>
                <p className="opacity-80 text-sm">#{booking.id.slice(-6).toUpperCase()}</p>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* QR Code */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center"
                        style={{ width: 150 }}
                      >
                        <QrCode className="h-20 w-20 text-primary absolute opacity-10" />
                        <div className="text-xs text-center">
                          <p className="font-medium">QR Code</p>
                          <p>#{booking.id.slice(-10).toUpperCase()}</p>
                        </div>
                      </motion.div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Present this QR code at the venue
                    </p>
                  </div>
                  
                  {/* Event Details */}
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex gap-3">
                        <CalendarDays className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-muted-foreground">
                            {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-muted-foreground">{event.venue}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Tickets</p>
                          <p className="text-muted-foreground">
                            {booking.quantity} × {event.category} Ticket
                            {booking.quantity > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Attendee</p>
                          <p className="text-muted-foreground">{user?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t text-sm">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="font-medium">Order Total</p>
                      <p className="text-lg font-bold">
                        ${(event.price * booking.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" /> Print
                      </Button>
                      <Button variant="default" className="gap-2">
                        <Calendar className="h-4 w-4" /> Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Information */}
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Event Details</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">About This Event</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    
                    <Button variant="link" asChild className="px-0">
                      <Link to={`/events/${event.id}`}>View full event details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="instructions">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Important Information</h3>
                    
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Arrive 15-30 minutes before the event starts</li>
                      <li>Have your ticket QR code ready for scanning</li>
                      <li>This ticket is valid until {format(validUntilDate, "MMMM d, yyyy")}</li>
                      <li>Photo ID may be required for entry</li>
                      <li>No refunds or exchanges</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">support@eventhub.com</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">Contact Support</Button>
              </CardContent>
            </Card>
            
            {/* Order Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Information</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number</span>
                    <span>#{booking.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date</span>
                    <span>{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span>Credit Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-success">Confirmed</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(event.price * booking.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span>Total</span>
                    <span>${(event.price * booking.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Button Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button asChild>
            <Link to="/user/dashboard">View My Bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/events">Browse More Events</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default BookingConfirmation
