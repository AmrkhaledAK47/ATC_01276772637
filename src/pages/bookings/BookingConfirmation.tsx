
import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import confetti from "canvas-confetti"
import { format, add } from "date-fns"
import { CalendarDays, Clock, MapPin, Share2, Download, Mail, Calendar, Phone, User, Users, CreditCard, CheckCircle2, Printer, QrCode } from "lucide-react"
import { motion } from "framer-motion"

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>()
  const booking = bookings.find(b => b.id === id)
  const [activeTab, setActiveTab] = useState("ticket")
  const [showQR, setShowQR] = useState(false)
  
  // Trigger confetti effect
  useEffect(() => {
    // Only trigger on initial render
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (!booking) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            We couldn't find the booking you're looking for.
          </p>
          <Button asChild>
            <Link to="/user/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Success Message */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="h-12 w-12 text-secondary" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Booking Confirmed!
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your tickets for {booking.event.name} have been confirmed.
            </motion.p>
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Booking Reference: <span className="font-mono font-medium">{booking.id}</span>
            </motion.p>
          </div>
          
          {/* Ticket and Details Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-card/50 backdrop-blur">
              <TabsTrigger value="ticket" className="flex-1">Ticket</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="venue" className="flex-1">Venue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ticket">
              <Card className="overflow-hidden border-2 border-secondary/10">
                <div className="bg-gradient-to-r from-primary to-secondary text-white p-4">
                  <h3 className="font-bold text-lg">E-TICKET</h3>
                </div>
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    {/* Banner Image */}
                    <div className="h-40 relative">
                      <img 
                        src={booking.event.imageUrl} 
                        alt={booking.event.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    </div>
                    
                    {/* Ticket Content */}
                    <div className="p-6 space-y-4">
                      <h2 className="text-2xl font-bold">{booking.event.name}</h2>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                          {format(booking.event.date, "EEEE, MMMM dd, yyyy")}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          {booking.event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {booking.event.venue}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Attendee</div>
                          <div className="font-medium">{booking.attendee}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Tickets</div>
                          <div className="font-medium">{booking.ticketCount}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Type</div>
                          <div className="font-medium">{booking.ticketType}</div>
                        </div>
                      </div>
                      
                      {/* QR Code */}
                      <div className="flex justify-center py-4" onClick={() => setShowQR(!showQR)}>
                        {showQR ? (
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=eventticket:123456789" 
                            alt="QR Code" 
                            className="h-48 w-48"
                          />
                        ) : (
                          <Button variant="outline" className="gap-2">
                            <QrCode className="h-4 w-4" /> Show QR Code
                          </Button>
                        )}
                      </div>
                      
                      <div className="border-t border-dashed border-muted-foreground/25 pt-4 text-center text-xs text-muted-foreground">
                        Please present this ticket or QR code at the entrance.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Actions */}
              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" /> Print
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {booking.ticketType} x {booking.ticketCount}
                        </span>
                        <span>${booking.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>${booking.serviceFee.toFixed(2)}</span>
                      </div>
                      {booking.discount > 0 && (
                        <div className="flex justify-between text-secondary">
                          <span>Discount</span>
                          <span>-${booking.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total</span>
                        <span>${booking.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{booking.paymentMethod}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Date: {format(booking.purchaseDate, "MMMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{booking.attendee}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{booking.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{booking.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="venue">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Venue Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Venue Information</h3>
                    <div className="space-y-2">
                      <div className="font-medium">{booking.event.venue}</div>
                      <div className="text-muted-foreground">123 Event Street</div>
                      <div className="text-muted-foreground">New York, NY 10001</div>
                    </div>
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Map View</p>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Getting There</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <div>
                        <div className="font-medium text-foreground">Parking</div>
                        <p>Parking is available in the venue's underground garage for $15 per vehicle.</p>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Public Transit</div>
                        <p>The venue is accessible via the Blue Line, exit at Central Station and walk 5 minutes east.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Add to Calendar */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium mb-3">Add to Calendar</h3>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">Google</Button>
              <Button variant="outline" size="sm">iCal</Button>
              <Button variant="outline" size="sm">Outlook</Button>
            </div>
          </div>
          
          {/* Share */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium mb-3">Share with Friends</h3>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="icon">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* You Might Also Like */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-center">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedEvents.map((event, index) => (
                <Link 
                  key={index} 
                  to={`/events/${event.id}`}
                  className="group flex bg-card hover:bg-card/80 border rounded-lg overflow-hidden transition-colors"
                >
                  <div className="w-1/3">
                    <img 
                      src={event.imageUrl} 
                      alt={event.name} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h4 className="font-medium line-clamp-1">{event.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {format(event.date, "MMM dd")} • {event.venue}
                    </p>
                    <p className="text-sm font-medium mt-1">${event.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/user/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

// Mock data
const bookings = [
  {
    id: "BK12345",
    event: {
      name: "Tech Conference 2025",
      date: new Date(2025, 5, 15),
      time: "9:00 AM - 5:00 PM",
      venue: "Downtown Convention Center",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    },
    attendee: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    ticketCount: 2,
    ticketType: "Standard",
    purchaseDate: new Date(2025, 4, 10),
    subtotal: 199.98,
    serviceFee: 20.00,
    discount: 0,
    total: 219.98,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "BK12346",
    event: {
      name: "Summer Music Festival",
      date: new Date(2025, 7, 5),
      time: "12:00 PM - 11:00 PM",
      venue: "Riverside Park",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    },
    attendee: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    ticketCount: 1,
    ticketType: "VIP",
    purchaseDate: new Date(2025, 6, 15),
    subtotal: 149.99,
    serviceFee: 15.00,
    discount: 25.00,
    total: 139.99,
    paymentMethod: "Mastercard •••• 5678",
  },
]

const relatedEvents = [
  {
    id: "3",
    name: "Digital Marketing Workshop",
    date: new Date(2025, 4, 22),
    venue: "Business Hub",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
  },
  {
    id: "7",
    name: "Charity Gala Dinner",
    date: new Date(2025, 6, 12),
    venue: "Grand Ballroom",
    price: 150,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
  },
]

export default BookingConfirmation
