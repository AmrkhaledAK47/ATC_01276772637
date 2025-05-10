
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

const BookingSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const { getEvent } = useEvents();
  const { user } = useAuth();
  const [event, setEvent] = useState(getEvent(id || ""));

  useEffect(() => {
    if (id) {
      setEvent(getEvent(id));
    }
  }, [id, getEvent]);

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

  return (
    <MainLayout>
      <div className="container max-w-2xl py-16">
        <div className="bg-card border rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-primary/10 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <div className="mx-auto flex justify-center">
                <div className="relative">
                  <div className="animate-ping absolute h-16 w-16 rounded-full bg-primary/20"></div>
                  <CheckCircle className="h-16 w-16 text-primary relative" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold mt-6">Booking Confirmed!</h1>
            <p className="text-muted-foreground mt-2">
              Your ticket for this event has been booked successfully.
            </p>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <h2 className="text-xl font-semibold">{event.title}</h2>

            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {event.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {event.time && `, ${event.time}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-muted-foreground">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Ticket Details</p>
                  <p className="text-muted-foreground">1x General Admission</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-sm text-center">
                A confirmation has been sent to{" "}
                <span className="font-semibold">{user?.email}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/user/bookings">View My Bookings</Link>
              </Button>
              <Button asChild className="flex-1 gap-2">
                <Link to="/events">
                  Explore More Events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingSuccess;
