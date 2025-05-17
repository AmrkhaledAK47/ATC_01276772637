import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Booking, BookingStatus } from "@/types";
import { BookingsService } from "@/services/bookings.service";
import { Skeleton } from "@/components/ui/skeleton";

const MyBookings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await BookingsService.getMyBookings();
        console.log("Bookings loaded:", response);
        setBookings(response);
      } catch (error) {
        console.error("Failed to load bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);
  
  const upcomingBookings = bookings.filter(
    booking => booking.status === BookingStatus.CONFIRMED && new Date(booking.event.date) >= new Date()
  );

  const pastBookings = bookings.filter(
    booking => (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.ATTENDED)
      && new Date(booking.event.date) < new Date()
  );

  const cancelledBookings = bookings.filter(booking => booking.status === BookingStatus.CANCELLED);
  
  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        setLoading(true);
        await BookingsService.cancelBooking(bookingId);

        // Update local state
        const updatedBookings = bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: BookingStatus.CANCELLED }
            : booking
        );
      
      setBookings(updatedBookings);
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        toast({
          title: "Error",
          description: "Failed to cancel your booking. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderBookingsList = (bookingsList: Booking[], tabValue: string) => {
    if (loading) {
      return Array(2).fill(0).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <Skeleton className="h-48 w-full" />
            </div>
            <CardContent className="w-full md:w-2/3 p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-64 mb-4" />
                </div>
                <Skeleton className="h-6 w-24 mb-4 md:mb-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-5 w-24" />
                </div>

                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-24" />
                  {tabValue === "upcoming" && <Skeleton className="h-9 w-20" />}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ));
    }

    if (bookingsList.length === 0) {
  return (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {tabValue === "upcoming"
              ? "You don't have any upcoming bookings."
              : tabValue === "past"
                ? "You don't have any past bookings."
                : "You don't have any cancelled bookings."}
          </p>

          {tabValue === "upcoming" && (
            <Link to="/events">
              <Button>Browse Events</Button>
            </Link>
          )}
        </div>
      );
    }

    return bookingsList.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3">
                            <img 
              src={booking.event.image}
              alt={booking.event.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <CardContent className="w-full md:w-2/3 p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <div>
                <h3 className="text-xl font-bold">{booking.event.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {booking.event.description.length > 100
                    ? `${booking.event.description.substring(0, 100)}...`
                    : booking.event.description}
                </p>
                              </div>
                              
                              <Badge variant="outline" className="mb-4 md:mb-0">
                {booking.status === BookingStatus.CONFIRMED
                                  ? "Confirmed" 
                  : booking.status === BookingStatus.ATTENDED
                                  ? "Completed" 
                                  : "Cancelled"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(parseISO(booking.event.date), "EEEE, MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-primary" />
                <span>{booking.event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-primary" />
                <span>{booking.event.location}</span>
                              </div>
                              <div>
                <span className="font-medium">Tickets:</span> {booking.tickets}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                  Booked on {format(parseISO(booking.createdAt), "MMM d, yyyy")}
                                </p>
                                <p className="font-bold mt-1">
                                  Total: ${booking.totalPrice.toFixed(2)}
                                </p>
                              </div>
                              
                              <div className="flex space-x-2">
                <Link to={`/events/${booking.eventId}`}>
                                  <Button variant="outline">View Event</Button>
                                </Link>
                                
                {booking.status === BookingStatus.CONFIRMED && (
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={loading}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
    ));
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({loading ? "..." : upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({loading ? "..." : pastBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({loading ? "..." : cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0">
              <div className="space-y-6">
                {renderBookingsList(upcomingBookings, "upcoming")}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="space-y-6">
                {renderBookingsList(pastBookings, "past")}
                    </div>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-0">
              <div className="space-y-6">
                {renderBookingsList(cancelledBookings, "cancelled")}
                </div>
              </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyBookings;
