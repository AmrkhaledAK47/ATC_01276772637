
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Calendar, Clock, MapPin, Users, Tag, Share2, Info, Heart, ArrowRight, Building } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { EventCard } from "@/components/events/event-card";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, events, bookEvent, hasUserBookedEvent } = useEvents();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("about");
  const [isBooking, setIsBooking] = useState(false);
  
  // Animation variants for staggered elements
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  useEffect(() => {
    setIsLoading(true);
    
    // Get event details
    if (id) {
      const eventData = getEvent(id);
      
      if (eventData) {
        setEvent(eventData);
        
        // Get related events (same category)
        const related = events
          .filter(e => e.category === eventData.category && e.id !== id)
          .slice(0, 4);
        setRelatedEvents(related);
      }
    }
    
    setIsLoading(false);
  }, [id, getEvent, events]);
  
  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/auth?redirect=/events/" + id);
      return;
    }
    
    setIsBooking(true);
    
    try {
      const booking = await bookEvent(id || "");
      if (booking) {
        navigate(`/booking/confirmation/${booking.id}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
    
    setIsBooking(false);
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!event) {
    return (
      <MainLayout>
        <div className="container py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/events")}>Browse Events</Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const isBooked = hasUserBookedEvent(id || "");

  return (
    <MainLayout>
      {/* Header with parallax effect */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 container p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-2 backdrop-blur-sm bg-background/30 hover:bg-background/50">
              {event.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white">{event.title}</h1>
            
            <div className="flex flex-wrap gap-4 items-center text-sm text-white/90 mt-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-primary" />
                <span>{typeof event.price === "number" ? (event.price === 0 ? "Free" : `$${event.price}`) : event.price}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-8">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="venue">Venue & Location</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  <motion.div variants={item}>
                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                    <p className="text-muted-foreground">{event.description}</p>
                  </motion.div>
                  
                  <motion.div variants={item}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <h3 className="font-semibold">Event Details</h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="font-medium">Date</p>
                                  <p className="text-muted-foreground">
                                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="font-medium">Time</p>
                                  <p className="text-muted-foreground">{event.time}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="font-semibold">Location</h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-3">
                                <Building className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="font-medium">Venue</p>
                                  <p className="text-muted-foreground">{event.venue}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Tag className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="font-medium">Price</p>
                                  <p className="text-muted-foreground">
                                    {typeof event.price === "number" 
                                      ? event.price === 0 
                                        ? "Free" 
                                        : `$${event.price}`
                                      : event.price}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="venue">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-3">{event.venue}</h3>
                      <p className="text-muted-foreground mb-6">
                        Located in the heart of the city, this venue is easily accessible by public transportation.
                        The venue is wheelchair accessible and has ample parking available nearby.
                      </p>
                      
                      <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="font-medium">Interactive Map</p>
                          <p className="text-sm text-muted-foreground mt-2">Map would be displayed here</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-muted-foreground">123 Event Street, City, State 12345</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Getting There</p>
                            <p className="text-muted-foreground">
                              Public Transportation: Take the Blue Line to Downtown Station.
                              <br />
                              Parking: Available at Central Garage ($10 flat rate).
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="faq">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        question: "What's the refund policy?",
                        answer: "Full refunds are available up to 7 days before the event. No refunds are provided after that date, but tickets may be transferred to another person."
                      },
                      {
                        question: "Is there a dress code?",
                        answer: "The dress code is smart casual. We recommend comfortable shoes as there may be limited seating."
                      },
                      {
                        question: "Are there age restrictions?",
                        answer: "This event is open to attendees 18 years and older. Valid ID may be required at the entrance."
                      },
                      {
                        question: "Can tickets be transferred to someone else?",
                        answer: "Yes, tickets can be transferred to another person. Please contact our support team for assistance with the transfer process."
                      }
                    ].map((faq, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{faq.question}</h3>
                          <p className="text-muted-foreground text-sm">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="sticky top-24">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">Ticket Information</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-sm">
                        {event.category}
                      </Badge>
                      <BadgeStatus 
                        variant={
                          event.status === "available" 
                            ? "secondary"
                            : event.status === "free" 
                            ? "success" 
                            : event.status === "few-tickets" 
                            ? "warning" 
                            : "destructive"
                        }
                      >
                        {event.status === "available" 
                          ? "Available" 
                          : event.status === "free" 
                          ? "Free Event" 
                          : event.status === "few-tickets" 
                          ? "Few tickets left" 
                          : "Sold out"}
                      </BadgeStatus>
                    </div>
                  </div>
                  
                  <div className="py-4 border-y">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Price:</span>
                      <span className="text-2xl font-bold">
                        {typeof event.price === "number" 
                          ? event.price === 0 
                            ? "Free" 
                            : `$${event.price.toFixed(2)}`
                          : event.price}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 text-sm text-muted-foreground mb-4">
                      <Users className="h-4 w-4" />
                      <span>Limited availability</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    {isBooked ? (
                      <div className="space-y-4">
                        <Badge variant="outline" className="w-full py-1.5 border-success bg-success/10 text-success text-center">
                          You've booked this event
                        </Badge>
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/user/dashboard")}
                        >
                          View My Bookings
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full mb-3" 
                        size="lg"
                        disabled={event.status === "sold-out" || isBooking}
                        onClick={handleBooking}
                      >
                        {isBooking ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>Book Now</>
                        )}
                      </Button>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="icon" className="flex-1">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="flex-1">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Organizer</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">EventHub Organizers</p>
                      <p className="text-xs text-muted-foreground">Event Organizer</p>
                    </div>
                  </div>
                  
                  <Button variant="link" className="mt-2 h-auto p-0">
                    Contact organizer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Similar Events</h2>
              <Button variant="link" asChild>
                <a href="/events">
                  View all events <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedEvents.map(event => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  category={event.category}
                  date={new Date(event.date)}
                  time={event.time}
                  venue={event.venue}
                  price={event.price}
                  imageUrl={event.imageUrl}
                  status={event.status}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EventDetail;
