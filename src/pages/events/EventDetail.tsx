
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Share2,
  Heart,
  Check,
  Tag,
  Plus,
  Minus,
} from "lucide-react";
import { format } from "date-fns";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getEvent, bookEvent, isEventBooked, featuredEvents } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const event = getEvent(id || "");
  const isBooked = isAuthenticated && isEventBooked(id || "");

  if (!event) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to book this event.",
        variant: "destructive",
      });
      navigate("/auth?redirectTo=" + encodeURIComponent(`/events/${id}`));
      return;
    }

    setIsBooking(true);
    try {
      await bookEvent(id || "", quantity);
      navigate(`/booking/confirmation/${id}`);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const increaseQuantity = () => setQuantity((q) => Math.min(q + 1, 10));
  const decreaseQuantity = () => setQuantity((q) => Math.max(q - 1, 1));

  // Date formatting
  const eventDate = format(event.date, "EEEE, MMMM d, yyyy");

  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        {/* Hero Section */}
        <div className="relative w-full h-[30vh] md:h-[50vh] rounded-xl overflow-hidden mb-8">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
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
              >
                {event.status === "available"
                  ? "Available"
                  : event.status === "few-tickets"
                  ? "Few tickets left"
                  : event.status === "sold-out"
                  ? "Sold out"
                  : "Free"}
              </BadgeStatus>

              <div className="bg-muted rounded-full px-3 py-0.5 text-sm flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {event.category}
              </div>

              {isBooked && (
                <BadgeStatus variant="success">
                  <Check className="h-3 w-3 mr-1" /> You've booked this
                </BadgeStatus>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

            <div className="flex flex-wrap gap-6 mb-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.venue}</span>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Organizer</h2>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    O
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Event Organizer</p>
                  <p className="text-muted-foreground text-sm">Organizing since 2020</p>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Venue Information</h2>
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-4">
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <p className="font-medium">{event.venue}</p>
              <p className="text-muted-foreground">
                123 Event Street, Cityville, State 12345
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border rounded-lg p-6 shadow-sm bg-card">
                <h3 className="font-bold text-xl mb-4">Book This Event</h3>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Price:</p>
                  <p className="text-2xl font-bold">
                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                  </p>
                </div>

                {event.price > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Quantity:</p>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={increaseQuantity}
                        disabled={quantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Fixed type error here - previously compared non-overlapping types */}
                {event.status !== "sold-out" ? (
                  isBooked ? (
                    <div className="text-center p-4 bg-muted rounded-md">
                      <Check className="h-5 w-5 mx-auto mb-2 text-primary" />
                      <p className="font-medium">You've booked this event</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check your bookings in your dashboard
                      </p>
                    </div>
                  ) : (
                    <Button
                      className="w-full mb-4"
                      size="lg"
                      disabled={isBooking}
                      onClick={handleBookEvent}
                    >
                      {isBooking ? "Processing..." : "Book Now"}
                    </Button>
                  )
                ) : (
                  <div className="text-center p-4 bg-muted rounded-md">
                    <p className="font-medium text-destructive">Sold Out</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      No tickets available for this event
                    </p>
                  </div>
                )}

                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Share event"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Add to favorites"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredEvents
              .filter((e) => e.id !== event.id && e.category === event.category)
              .slice(0, 4)
              .map((relatedEvent) => (
                <Link to={`/events/${relatedEvent.id}`} key={relatedEvent.id}>
                  <div className="border rounded-lg overflow-hidden bg-card hover:bg-card/90 transition-colors">
                    <div className="aspect-video relative">
                      <img
                        src={relatedEvent.imageUrl}
                        alt={relatedEvent.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold line-clamp-1">{relatedEvent.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(relatedEvent.date, "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetail;
