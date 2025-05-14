import React, { useState, useRef, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EventCard } from "@/components/events/event-card"
import { format } from "date-fns"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Heart, Share2, CalendarDays, Clock, MapPin, Users, ArrowRight, Star, Info, Building2, MessageSquare, CheckCircle2 } from "lucide-react"

import { featuredEvents } from "@/data/events-data"

const EventDetail = () => {
  const { id } = useParams<{ id: string }>()
  const event = featuredEvents.find(e => e.id === id)
  
  const [ticketCount, setTicketCount] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookButtonVisible, setIsBookButtonVisible] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const infoInView = useInView(infoRef, { once: false, margin: "-100px 0px 0px 0px" })
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  
  // Set booking button visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!infoRef.current) return
      
      const infoPosition = infoRef.current.getBoundingClientRect().top
      setIsBookButtonVisible(infoPosition < 0)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  if (!event) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/events">Browse All Events</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }
  
  const incrementTicket = () => setTicketCount(prev => Math.min(prev + 1, 10))
  const decrementTicket = () => setTicketCount(prev => Math.max(prev - 1, 1))
  
  return (
    <MainLayout>
      {/* Hero Section with Parallax */}
      <div ref={heroRef} className="relative w-full h-[70vh] overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: heroImageY }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Hero Content */}
        <motion.div 
          className="container relative z-20 h-full flex flex-col justify-end pb-16"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{event.category}</Badge>
              <Badge 
                variant={
                  event.status === "available" ? "secondary" : 
                  event.status === "few-tickets" ? "secondary" : 
                  event.status === "free" ? "secondary" : 
                  "outline"
                }
              >
                {event.status === "free" ? "Free Event" : 
                 event.status === "sold-out" ? "Sold Out" :
                 event.status === "few-tickets" ? "Few Tickets Left" : "Available"}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                <span>{format(event.date, "EEEE, MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.venue}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button size="lg" className="gap-2">
                Get Tickets
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => setIsFavorite(!isFavorite)} 
                className="bg-background/20 backdrop-blur-sm hover:bg-background/30"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button 
                size="icon" 
                variant="outline"
                className="bg-background/20 backdrop-blur-sm hover:bg-background/30"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Booking Button */}
      <motion.div 
        className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: isBookButtonVisible ? 1 : 0,
          y: isBookButtonVisible ? 0 : 50
        }}
        transition={{ duration: 0.3 }}
      >
        <Button size="lg" className="shadow-lg pointer-events-auto">
          Book Now - ${event.price} per ticket
        </Button>
      </motion.div>
      
      {/* Main Content */}
      <div ref={infoRef} className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-muted/50 mb-6">
                <TabsTrigger value="about" className="gap-2">
                  <Info className="h-4 w-4" /> About
                </TabsTrigger>
                <TabsTrigger value="venue" className="gap-2">
                  <Building2 className="h-4 w-4" /> Venue
                </TabsTrigger>
                <TabsTrigger value="faq" className="gap-2">
                  <MessageSquare className="h-4 w-4" /> FAQ
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">About This Event</h2>
                  
                  {/* Event Description */}
                  <div className="space-y-4">
                    <p>{event.description}</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  
                  {/* Event Details List */}
                  <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Event Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium">Date</div>
                          <div className="text-muted-foreground">
                            {format(event.date, "EEEE, MMMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium">Time</div>
                          <div className="text-muted-foreground">{event.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-muted-foreground">{event.venue}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium">Attendees</div>
                          <div className="text-muted-foreground">Limited Capacity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="venue" className="mt-0 space-y-6">
                <h2 className="text-2xl font-bold">Venue Information</h2>
                
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  {/* Map would be here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Map View</p>
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{event.venue}</h3>
                  <p className="text-muted-foreground">
                    123 Event Street, Suite 1A<br />
                    New York, NY 10001
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-medium mb-2">Parking</h4>
                      <p className="text-muted-foreground">
                        Paid parking available at the venue's underground garage or nearby city parking.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Public Transportation</h4>
                      <p className="text-muted-foreground">
                        Blue Line: Central Station (5 min walk)<br />
                        Bus Routes: 42, 36, 15
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0 space-y-6">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      question: "Are tickets refundable?",
                      answer: "Tickets are non-refundable but can be transferred to another person up to 24 hours before the event."
                    },
                    {
                      question: "What is the dress code?",
                      answer: "The dress code for this event is business casual. Please dress appropriately for the venue."
                    },
                    {
                      question: "Can I bring children?",
                      answer: "This event is designed for adults. Attendees must be at least 18 years of age."
                    },
                    {
                      question: "Will food and drinks be provided?",
                      answer: "Light refreshments will be served. A cash bar will be available for alcoholic beverages."
                    },
                    {
                      question: "What should I bring?",
                      answer: "Please bring a valid ID and your ticket (digital or printed). Business cards are recommended for networking opportunities."
                    },
                  ].map((item, index) => (
                    <div key={index} className="bg-card border rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <Button variant="outline">Write a Review</Button>
              </div>
              
              <div className="space-y-6">
                {/* Review Rating Summary */}
                <div className="flex items-center gap-4 bg-card border rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">4.8</div>
                    <div className="flex text-yellow-500 my-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">Based on 24 reviews</div>
                  </div>
                  
                  <div className="flex-1">
                    {[
                      { stars: 5, percentage: 80 },
                      { stars: 4, percentage: 15 },
                      { stars: 3, percentage: 5 },
                      { stars: 2, percentage: 0 },
                      { stars: 1, percentage: 0 },
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">{rating.stars}</span>
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        </div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full" 
                            style={{ width: `${rating.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{rating.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Individual Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      date: new Date(2024, 3, 5),
                      rating: 5,
                      comment: "Amazing event! The speakers were incredibly informative and the networking opportunities were valuable. Would definitely attend again next year."
                    },
                    {
                      name: "Michael Chen",
                      date: new Date(2024, 3, 3),
                      rating: 4,
                      comment: "Great content and well-organized. The venue was a bit hard to find, but everything else exceeded my expectations."
                    },
                    {
                      name: "Emma Williams",
                      date: new Date(2024, 2, 28),
                      rating: 5,
                      comment: "One of the best industry events I've attended. The workshops provided practical knowledge I could immediately apply to my work."
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-t pt-6">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(review.date, "MMM d, yyyy")}
                        </div>
                      </div>
                      <div className="flex text-yellow-500 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button variant="ghost">Load More Reviews</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Booking and Related */}
          <div className="space-y-8">
            {/* Pricing Card */}
            <div className="bg-card border rounded-lg overflow-hidden sticky top-24">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold">
                    {event.price > 0 ? `$${event.price}` : 'Free'}
                  </div>
                  <Badge variant="outline">
                    {event.status === "free" ? "Free Event" : 
                     event.status === "sold-out" ? "Sold Out" :
                     event.status === "few-tickets" ? "Few Tickets Left" : "Available"}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {/* Ticket Counter */}
                  {event.status !== "sold-out" && (
                    <div>
                      <label className="text-sm font-medium block mb-2">Number of Tickets</label>
                      <div className="flex">
                        <button 
                          onClick={decrementTicket}
                          className="w-10 h-10 flex items-center justify-center border rounded-l-md hover:bg-muted transition-colors"
                        >
                          -
                        </button>
                        <div className="flex-1 h-10 flex items-center justify-center border-y">
                          {ticketCount}
                        </div>
                        <button 
                          onClick={incrementTicket}
                          className="w-10 h-10 flex items-center justify-center border rounded-r-md hover:bg-muted transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Booking Summary */}
                  {event.status !== "sold-out" && event.price > 0 && (
                    <div className="text-sm border-t pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Ticket price</span>
                        <span>${event.price} × {ticketCount}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Service fee</span>
                        <span>${(event.price * 0.1 * ticketCount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2">
                        <span>Total</span>
                        <span>${(event.price * ticketCount + event.price * 0.1 * ticketCount).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <Button 
                  className="w-full" 
                  disabled={event.status === "sold-out"}
                  size="lg"
                >
                  {event.status === "sold-out" ? "Sold Out" : 
                   event.status === "free" ? "Register Now" : "Book Tickets"}
                </Button>
                
                {event.status === "few-tickets" && (
                  <p className="text-center text-sm text-warning-500 mt-2">
                    Only a few tickets remaining!
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                  <CheckCircle2 className="h-4 w-4 text-success-500" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
            
            {/* Organizer */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Event Organizer</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold mr-3">
                  EC
                </div>
                <div>
                  <div className="font-medium">EventCorp Inc.</div>
                  <div className="text-sm text-muted-foreground">Organizer of 24 events</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">View Profile</Button>
            </div>
            
            {/* Share and Save */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} /> 
                {isFavorite ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Similar Events */}
        <div className="mt-16 border-t pt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Similar Events</h2>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredEvents
              .filter(e => e.id !== event.id && e.category === event.category)
              .slice(0, 4)
              .map(event => (
                <EventCard key={event.id} {...event} />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default EventDetail
