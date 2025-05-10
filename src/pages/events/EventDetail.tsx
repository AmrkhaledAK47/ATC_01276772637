import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/events/event-card";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, DollarSign, Share, Heart, ChevronLeft } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getEvent, events } = useEvents();
  const { user, bookEvent, isEventBooked } = useAuth();
  const [event, setEvent] = useState(getEvent(id || ""));
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    if (id) {
      const foundEvent = getEvent(id);
      setEvent(foundEvent);

      // Find related events (same category)
      if (foundEvent) {
        const related = events
          .filter(e => e.category === foundEvent.category && e.id !== foundEvent.id)
          .slice(0, 3);
        setRelatedEvents(related);
      }
    }
  }, [id, getEvent, events]);

  const handleBookNow = () => {
    if (event) {
      bookEvent(event.id);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!event) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <p className="mt-4 text-muted-foreground">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isBooked = isEventBooked(event.id);

  return (
    <MainLayout>
      {/* Event Hero Section */}
      <div className="relative h-[40vh] lg:h-[60vh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background"></div>
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content overlay */}
        <div className="container relative z-10 h-full flex flex-col justify-end pb-8">
          <Link to="/events" className="flex items-center text-sm mb-6 hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to events
          </Link>
          
          <BadgeStatus 
            variant={
              event.status === "free" 
                ? "success" 
                : event.status === "few-tickets" 
                ? "warning" 
                : event.status === "sold-out" 
                ? "destructive"
                : "secondary"
            }
            className="mb-4"
          >
            {event.status === "available" 
              ? "Available" 
              : event.status === "few-tickets" 
              ? "Few tickets left" 
              : event.status === "sold-out" 
              ? "Sold out"
              : "Free"}
          </BadgeStatus>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl">{event.title}</h1>
          
          {/* Event basic info */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <span>
                {event.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {event.time && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <span>{event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Event details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            <Separator />
            
            {/* Location Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="rounded-lg overflow-hidden bg-muted aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">{event.venue}</p>
                    <p className="text-sm text-muted-foreground mt-1">Map would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Booking and related info */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-card rounded-lg border p-6 sticky top-24">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-2xl font-bold">
                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                  </span>
                </div>
                
                {isBooked ? (
                  <div>
                    <Button className="w-full mb-3" disabled>
                      Already Booked
                    </Button>
                    <Link to="/user/bookings" className="block text-center text-primary text-sm">
                      View your bookings
                    </Link>
                  </div>
                ) : (
                  // Using strict string equality check with explicit string literal type for proper TypeScript comparison
                  event.status === "sold-out" ? (
                    <Button variant="outline" className="w-full" disabled>
                      Sold Out
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleBookNow}
                      disabled={event.status === "sold-out"}
                    >
                      Book Now
                    </Button>
                  )
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1",
                      isFavorite && "text-destructive border-destructive hover:bg-destructive/10"
                    )}
                    onClick={toggleFavorite}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 mr-2 transition-all",
                        isFavorite && "fill-destructive"
                      )}
                    />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-medium">Event Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>
                      {event.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  {event.time && (
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p>{event.time}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p>{event.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <div className="bg-muted/30 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map(relatedEvent => (
                <EventCard key={relatedEvent.id} {...relatedEvent} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link to="/events">View All Events</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default EventDetail;
