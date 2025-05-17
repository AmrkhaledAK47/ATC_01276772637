import React, { useState, useRef, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EventCard } from "@/components/events/event-card"
import { format } from "date-fns"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Heart, Share2, CalendarDays, Clock, MapPin, Users, ArrowRight, Star, Info, Building2, MessageSquare, CheckCircle2, Lock } from "lucide-react"
import { EventsService } from "@/services/events.service"
import { BookingsService } from "@/services/bookings.service"
import { AuthService } from "@/services/auth.service"
import { Event } from "@/types"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { PaymentMethod } from "@/types"

const EventDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [similarEvents, setSimilarEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingBooking, setIsLoadingBooking] = useState(false)
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

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

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated()
  const currentUser = AuthService.getCurrentUserFromStorage()

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const eventData = await EventsService.getEvent(id)
        setEvent(eventData)

        // Fetch similar events (based on category)
        if (eventData.categoryId) {
          const allEvents = await EventsService.getEvents({
            categoryId: eventData.categoryId
          })

          // Filter out current event and limit to 4 events
          const similar = allEvents
            .filter(e => e.id !== id)
            .slice(0, 4)

          setSimilarEvents(similar)
        }

        // Check if user has already booked this event
        if (isAuthenticated && id) {
          try {
            const isBooked = await EventsService.isEventBooked(id)
            setIsAlreadyBooked(isBooked)
          } catch (error) {
            console.error("Error checking booking status:", error)
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching event:", error)
        setIsLoading(false)
      }
    }

    fetchEventData()
  }, [id, isAuthenticated])

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-20">
          <div className="h-[60vh] w-full bg-muted animate-pulse rounded-lg"></div>
          <div className="mt-8 space-y-4">
            <div className="h-8 w-1/3 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </MainLayout>
    )
  }

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

  // Calculate event status
  const status = event.availableSeats === 0 ? "sold-out" :
    event.availableSeats < 10 ? "few-tickets" :
      event.price === 0 ? "free" : "available"

  // Calculate total price
  const subtotal = event.price * ticketCount
  const serviceFee = event.price * 0.1 * ticketCount
  const totalPrice = subtotal + serviceFee

  // Handle booking
  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true)
      return
    }

    if (isAlreadyBooked) {
      navigate('/user/bookings')
      return
    }

    setShowBookingDialog(true)
  }

  // Handle login redirect
  const handleLoginRedirect = () => {
    setShowLoginDialog(false)
    navigate('/auth', { state: { redirectTo: `/events/${id}` } })
  }

  // Handle booking confirmation
  const handleBookingConfirm = async () => {
    if (!id || !event) return

    setIsLoadingBooking(true)
    try {
      await BookingsService.createBooking({
        eventId: id,
        tickets: ticketCount,
        paymentMethod: PaymentMethod.CREDIT_CARD // Default payment method
      })

      setBookingSuccess(true)
      setIsAlreadyBooked(true)

      toast.success("Booking Successful!", {
        description: `You have successfully booked ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} for ${event.title}`,
      })

      // Decrease available seats
      if (event) {
        setEvent(prev => prev ? {
          ...prev,
          availableSeats: prev.availableSeats - ticketCount
        } : null)
      }

      // Close dialog after short delay
      setTimeout(() => {
        setShowBookingDialog(false)
        setBookingSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error booking event:", error)
      toast.error("Booking Failed", {
        description: "There was a problem processing your booking. Please try again.",
      })
    } finally {
      setIsLoadingBooking(false)
    }
  }

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
            src={event.image}
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
              <Badge variant="secondary">{event.category?.name || "Event"}</Badge>
              <Badge
                variant={
                  status === "available" ? "secondary" :
                    status === "few-tickets" ? "secondary" :
                      status === "free" ? "secondary" :
                        "outline"
                }
              >
                {status === "free" ? "Free Event" :
                  status === "sold-out" ? "Sold Out" :
                    status === "few-tickets" ? "Few Tickets Left" : "Available"}
              </Badge>
              {isAlreadyBooked && (
                <Badge variant="default" className="bg-green-500">
                  You're Attending
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                <span>{format(new Date(event.date), "EEEE, MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="gap-2"
                disabled={status === "sold-out"}
                onClick={handleBookEvent}
              >
                {isAlreadyBooked
                  ? "View My Booking"
                  : status === "free"
                    ? "Register"
                    : "Get Tickets"}
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
        <Button
          size="lg"
          className="shadow-lg pointer-events-auto"
          disabled={status === "sold-out"}
          onClick={handleBookEvent}
        >
          {isAlreadyBooked
            ? "View My Booking"
            : status === "free"
              ? "Register Now"
              : `Book Now - $${event.price} per ticket`}
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
                      Join us for this amazing event and connect with like-minded individuals.
                      Don't miss out on this opportunity to experience something truly special.
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
                            {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
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
                          <div className="text-muted-foreground">{event.location}</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium">Attendees</div>
                          <div className="text-muted-foreground">
                            {event.capacity - event.availableSeats} / {event.capacity}
                          </div>
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
                  <h3 className="font-semibold text-lg">{event.location}</h3>
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
                    {status === "free" ? "Free Event" :
                      status === "sold-out" ? "Sold Out" :
                        status === "few-tickets" ? "Few Tickets Left" : "Available"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Ticket Counter */}
                  {status !== "sold-out" && !isAlreadyBooked && (
                    <div>
                      <label className="text-sm font-medium block mb-2">Number of Tickets</label>
                      <div className="flex">
                        <button
                          onClick={decrementTicket}
                          className="w-10 h-10 flex items-center justify-center border rounded-l-md hover:bg-muted transition-colors"
                          disabled={ticketCount <= 1}
                        >
                          -
                        </button>
                        <div className="flex-1 h-10 flex items-center justify-center border-y">
                          {ticketCount}
                        </div>
                        <button
                          onClick={incrementTicket}
                          className="w-10 h-10 flex items-center justify-center border rounded-r-md hover:bg-muted transition-colors"
                          disabled={ticketCount >= 10 || ticketCount >= event.availableSeats}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Booking Status (if already booked) */}
                  {isAlreadyBooked && (
                    <div className="flex items-center p-3 bg-primary/10 rounded-md text-primary">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">You're attending this event</p>
                        <p className="text-sm text-muted-foreground">View details in My Bookings</p>
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  {status !== "sold-out" && event.price > 0 && !isAlreadyBooked && (
                    <div className="text-sm border-t pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Ticket price</span>
                        <span>${event.price.toFixed(2)} × {ticketCount}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Service fee</span>
                        <span>${serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <Button
                  className="w-full"
                  disabled={status === "sold-out"}
                  size="lg"
                  onClick={handleBookEvent}
                >
                  {isAlreadyBooked ? "View My Booking" :
                    status === "sold-out" ? "Sold Out" :
                      status === "free" ? "Register Now" : "Book Tickets"}
                </Button>

                {status === "few-tickets" && (
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
                  {event.organizer?.name ? event.organizer.name.charAt(0) : "O"}
                </div>
                <div>
                  <div className="font-medium">{event.organizer?.name || "Event Organizer"}</div>
                  <div className="text-sm text-muted-foreground">Organizer</div>
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
        {similarEvents.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Similar Events</h2>
              <Button variant="ghost" className="gap-2" asChild>
                <Link to="/events">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarEvents.map(event => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  category={event.category?.name || ""}
                  date={new Date(event.date)}
                  time={event.time}
                  venue={event.location}
                  price={event.price}
                  imageUrl={event.image}
                  status={event.availableSeats === 0 ? "sold-out" :
                    event.availableSeats < 10 ? "few-tickets" :
                      event.price === 0 ? "free" : "available"}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to book this event.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <Lock className="h-16 w-16 text-muted-foreground" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLoginRedirect}>
              Login Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bookingSuccess ? "Booking Successful!" : "Confirm Booking"}
            </DialogTitle>
            <DialogDescription>
              {bookingSuccess
                ? `You have successfully booked ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} for ${event.title}.`
                : `You are about to book ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} for ${event.title}.`
              }
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle2 className="h-16 w-16 text-success-500 mb-4" />
              <p className="text-center">
                Thank you for your booking! You can view your booking details in the My Bookings section.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event:</span>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{format(new Date(event.date), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{event.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets:</span>
                  <span>{ticketCount}</span>
                </div>
                {event.price > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per ticket:</span>
                      <span>${event.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee:</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-4">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBookingDialog(false)} disabled={isLoadingBooking}>
                  Cancel
                </Button>
                <Button onClick={handleBookingConfirm} disabled={isLoadingBooking}>
                  {isLoadingBooking ? <Spinner className="mr-2" /> : null}
                  {event.price > 0 ? `Pay $${totalPrice.toFixed(2)}` : 'Confirm Registration'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

export default EventDetail
