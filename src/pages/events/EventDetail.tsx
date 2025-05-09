
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { BadgeStatus } from "@/components/ui/badge-status"
import { Calendar, Clock, MapPin, User, Share2, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

const EventDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [ticketCount, setTicketCount] = useState(1)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  
  // In a real app, we'd fetch this data from the backend
  const event = {
    id: id || "1",
    title: "Tech Conference 2025",
    description: "Join the biggest tech conference in the city with renowned speakers and networking opportunities. Learn about the latest technologies, trends, and innovations across various domains including AI, blockchain, cloud computing, and more.\n\nThis two-day event features keynote speeches, panel discussions, interactive workshops, and networking sessions. Don't miss this opportunity to connect with industry leaders and enhance your knowledge.",
    category: "Conference",
    date: new Date(2025, 5, 15),
    timeStart: "09:00",
    timeEnd: "17:00",
    venue: "Downtown Convention Center",
    address: "123 Main Street, New York, NY 10001",
    organizer: "Tech Events Inc.",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    status: "available",
    totalTickets: 500,
    availableTickets: 158,
    featured: true,
    speakers: [
      {
        name: "Jane Smith",
        role: "CTO, InnoTech",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
        bio: "Jane is a technology leader with over 15 years of experience in software development and innovation."
      },
      {
        name: "John Davis",
        role: "AI Research Lead, TechGiant",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
        bio: "John specializes in artificial intelligence and machine learning algorithms."
      },
      {
        name: "Sarah Johnson",
        role: "Product Director, StartupX",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
        bio: "Sarah has launched multiple successful tech products in global markets."
      }
    ],
    schedule: [
      {
        time: "09:00 - 10:00",
        title: "Registration & Breakfast",
        description: "Check-in and enjoy a complimentary breakfast"
      },
      {
        time: "10:00 - 11:30",
        title: "Keynote: The Future of Technology",
        description: "Opening keynote by Jane Smith, CTO of InnoTech"
      },
      {
        time: "11:45 - 12:45",
        title: "Panel Discussion: Ethical AI",
        description: "Industry experts discuss the ethical implications of AI development"
      },
      {
        time: "12:45 - 14:00",
        title: "Lunch Break",
        description: "Networking lunch provided for all attendees"
      },
      {
        time: "14:00 - 15:30",
        title: "Workshop: Cloud Solutions",
        description: "Hands-on workshop on implementing scalable cloud architectures"
      },
      {
        time: "15:45 - 17:00",
        title: "Closing Session & Networking",
        description: "Final remarks and structured networking opportunity"
      }
    ]
  }

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= event.availableTickets) {
      setTicketCount(value)
    }
  }
  
  const handleBooking = () => {
    // In a real app, this would send a booking request to the server
    console.log(`Booking ${ticketCount} tickets for event ${event.id}`)
    setBookingSuccess(true)
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full bg-black">
        <img 
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-wide py-8">
          <BadgeStatus 
            variant={event.featured ? "secondary" : "default"}
            className="mb-4"
          >
            {event.featured ? "Featured Event" : event.category}
          </BadgeStatus>
          <h1 className="text-white mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/80">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(event.date, "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{event.timeStart} - {event.timeEnd}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By {event.organizer}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="speakers">Speakers</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h2>About This Event</h2>
                  {event.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="mt-0">
                <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
                <div className="space-y-6">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-32 flex-shrink-0">
                        <div className="text-sm font-medium text-primary">{item.time}</div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="speakers" className="mt-0">
                <h2 className="text-2xl font-bold mb-6">Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <img 
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{speaker.name}</h3>
                        <p className="text-sm text-primary mb-1">{speaker.role}</p>
                        <p className="text-muted-foreground text-sm">{speaker.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Location</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{event.venue}</h3>
                  <p className="text-muted-foreground">{event.address}</p>
                </div>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {/* In a real app, this would be a Google Map */}
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Map would be displayed here
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Booking Card */}
          <div>
            <div className="bg-card rounded-lg border shadow-sm p-6 sticky top-20">
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-1">Price</div>
                <div className="text-3xl font-bold">${event.price}</div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <BadgeStatus 
                    variant={
                      event.availableTickets > 50 
                        ? "secondary" 
                        : event.availableTickets > 0 
                        ? "warning" 
                        : "destructive"
                    }
                  >
                    {event.availableTickets > 50 
                      ? "Available" 
                      : event.availableTickets > 0 
                      ? "Limited tickets" 
                      : "Sold out"}
                  </BadgeStatus>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available tickets:</span>
                  <span>{event.availableTickets}</span>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4" disabled={event.availableTickets === 0}>
                    Book Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {!bookingSuccess ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Book Tickets</DialogTitle>
                        <DialogDescription>
                          Complete your booking for {event.title}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="tickets">Number of Tickets</Label>
                          <Input 
                            id="tickets" 
                            type="number" 
                            min={1} 
                            max={event.availableTickets} 
                            value={ticketCount} 
                            onChange={handleTicketChange}
                          />
                          <p className="text-sm text-muted-foreground">
                            Max {event.availableTickets} tickets
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label>Summary</Label>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between mb-2">
                              <span>Tickets ({ticketCount} × ${event.price})</span>
                              <span>${ticketCount * event.price}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Booking fee</span>
                              <span>$9.99</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span>${(ticketCount * event.price) + 9.99}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleBooking}>
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500 mb-4 animate-fade-in">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <DialogTitle className="text-xl mb-2">Booking Confirmed!</DialogTitle>
                      <DialogDescription className="mb-6">
                        Your tickets for {event.title} have been booked successfully.
                        Check your email for confirmation details.
                      </DialogDescription>
                      <Button onClick={() => window.location.reload()}>
                        Close
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-full">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button variant="outline" size="icon" className="w-full">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Save</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default EventDetail
