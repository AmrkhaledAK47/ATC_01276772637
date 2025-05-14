
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { featuredEvents } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

// Sample booking data
const sampleBookings = [
  {
    id: "b1",
    eventId: "1",
    quantity: 2,
    totalPrice: 398,
    bookingDate: new Date(2025, 4, 10),
    status: "confirmed" as const,
  },
  {
    id: "b2",
    eventId: "3",
    quantity: 1,
    totalPrice: 49,
    bookingDate: new Date(2025, 3, 15),
    status: "confirmed" as const,
  },
  {
    id: "b3",
    eventId: "7",
    quantity: 3,
    totalPrice: 450,
    bookingDate: new Date(2025, 5, 1),
    status: "confirmed" as const,
  },
  {
    id: "b4",
    eventId: "6",
    quantity: 2,
    totalPrice: 70,
    bookingDate: new Date(2025, 2, 5),
    status: "past" as const,
  },
  {
    id: "b5",
    eventId: "4",
    quantity: 1,
    totalPrice: 25,
    bookingDate: new Date(2025, 2, 20),
    status: "cancelled" as const,
  },
];

interface BookingWithEvent {
  booking: typeof sampleBookings[0];
  event: typeof featuredEvents[0];
}

const MyBookings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<BookingWithEvent[]>(() => {
    return sampleBookings.map(booking => {
      const event = featuredEvents.find(e => e.id === booking.eventId)!;
      return { booking, event };
    });
  });
  
  const upcomingBookings = bookings.filter(b => b.booking.status === "confirmed");
  const pastBookings = bookings.filter(b => b.booking.status === "past");
  const cancelledBookings = bookings.filter(b => b.booking.status === "cancelled");
  
  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = bookings.map(b => {
        if (b.booking.id === bookingId) {
          return {
            ...b,
            booking: {
              ...b.booking,
              status: "cancelled" as const,
            },
          };
        }
        return b;
      });
      
      setBookings(updatedBookings);
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>
            
            {["upcoming", "past", "cancelled"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                <div className="space-y-6">
                  {(tabValue === "upcoming" ? upcomingBookings : 
                    tabValue === "past" ? pastBookings : 
                    cancelledBookings).length > 0 ? (
                    (tabValue === "upcoming" ? upcomingBookings : 
                      tabValue === "past" ? pastBookings : 
                      cancelledBookings).map(({ booking, event }) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <CardContent className="w-full md:w-2/3 p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <div>
                                <h3 className="text-xl font-bold">{event.title}</h3>
                                <p className="text-muted-foreground mb-4">{event.description}</p>
                              </div>
                              
                              <Badge variant="outline" className="mb-4 md:mb-0">
                                {booking.status === "confirmed" 
                                  ? "Confirmed" 
                                  : booking.status === "past" 
                                  ? "Completed" 
                                  : "Cancelled"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{format(event.date, "EEEE, MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{event.venue}</span>
                              </div>
                              <div>
                                <span className="font-medium">Tickets:</span> {booking.quantity}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Booked on {format(booking.bookingDate, "MMM d, yyyy")}
                                </p>
                                <p className="font-bold mt-1">
                                  Total: ${booking.totalPrice.toFixed(2)}
                                </p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Link to={`/events/${event.id}`}>
                                  <Button variant="outline">View Event</Button>
                                </Link>
                                
                                {booking.status === "confirmed" && (
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))
                  ) : (
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
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyBookings;
