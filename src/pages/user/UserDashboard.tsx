
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Search, Ticket, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeStatus } from "@/components/ui/badge-status";

const UserDashboard = () => {
  const { user } = useAuth();
  const { events, userBookings } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter bookings by the current user
  const userBookingsFiltered = userBookings
    .filter(booking => booking.userId === user?.id);

  // Get full event details for each booking
  const bookingsWithDetails = userBookingsFiltered.map(booking => {
    const event = events.find(e => e.id === booking.eventId);
    return {
      ...booking,
      event
    };
  });

  // Filter bookings based on search
  const filteredBookings = bookingsWithDetails.filter(booking => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.event?.title.toLowerCase().includes(query) ||
      booking.event?.venue.toLowerCase().includes(query) ||
      booking.event?.category.toLowerCase().includes(query)
    );
  });

  // Group bookings by status
  const upcomingBookings = filteredBookings
    .filter(booking => booking.event && new Date(booking.event.date) >= new Date())
    .sort((a, b) => {
      if (a.event && b.event) {
        return new Date(a.event.date).getTime() - new Date(b.event.date).getTime();
      }
      return 0;
    });

  const pastBookings = filteredBookings
    .filter(booking => booking.event && new Date(booking.event.date) < new Date())
    .sort((a, b) => {
      if (a.event && b.event) {
        return new Date(b.event.date).getTime() - new Date(a.event.date).getTime();
      }
      return 0;
    });

  // If not logged in, show login prompt
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4">Account Required</h1>
            <p className="text-muted-foreground mb-8">
              Please login or create an account to view your dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/auth?mode=login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and account information</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="font-bold">{userBookingsFiltered.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming Events</p>
                      <p className="font-bold">{upcomingBookings.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Type</p>
                      <p className="font-bold capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/user/profile">
                    View Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search your bookings..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList>
                <TabsTrigger value="upcoming">
                  Upcoming Events ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past Events ({pastBookings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6">
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/4 aspect-square sm:aspect-auto">
                            {booking.event && (
                              <img 
                                src={booking.event.imageUrl} 
                                alt={booking.event.title} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <h3 className="font-bold text-lg">
                                {booking.event ? booking.event.title : "Unknown Event"}
                              </h3>
                              <BadgeStatus variant="success">Confirmed</BadgeStatus>
                            </div>
                            
                            <div className="space-y-2 text-sm mb-4">
                              {booking.event && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{format(booking.event.date, "EEEE, MMMM d, yyyy")}</span>
                                  </div>
                                  {booking.event.time && (
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span>{booking.event.time}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{booking.event.venue}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                              <div className="text-xs bg-muted p-2 rounded">
                                <span className="text-muted-foreground">Booking #:</span>{" "}
                                <span className="font-mono">{booking.id}</span>
                              </div>
                              <div className="text-xs bg-muted p-2 rounded">
                                <span className="text-muted-foreground">Tickets:</span>{" "}
                                <span>{booking.quantity}</span>
                              </div>
                              <div className="text-xs bg-muted p-2 rounded">
                                <span className="text-muted-foreground">Booked on:</span>{" "}
                                <span>{format(booking.date, "MMM d, yyyy")}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              {booking.event && (
                                <Button size="sm" asChild>
                                  <Link to={`/events/${booking.event.id}`}>View Event</Link>
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                Download Ticket
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-muted rounded-lg">
                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any upcoming events booked.
                    </p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-6">
                {pastBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="opacity-75">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/4 aspect-square sm:aspect-auto">
                            {booking.event && (
                              <img 
                                src={booking.event.imageUrl} 
                                alt={booking.event.title} 
                                className="w-full h-full object-cover grayscale"
                              />
                            )}
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <h3 className="font-bold text-lg">
                                {booking.event ? booking.event.title : "Unknown Event"}
                              </h3>
                              <BadgeStatus>Past Event</BadgeStatus>
                            </div>
                            
                            <div className="space-y-2 text-sm mb-4">
                              {booking.event && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{format(booking.event.date, "EEEE, MMMM d, yyyy")}</span>
                                  </div>
                                  {booking.event.time && (
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span>{booking.event.time}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{booking.event.venue}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                              <div className="text-xs bg-muted p-2 rounded">
                                <span className="text-muted-foreground">Booking #:</span>{" "}
                                <span className="font-mono">{booking.id}</span>
                              </div>
                              <div className="text-xs bg-muted p-2 rounded">
                                <span className="text-muted-foreground">Tickets:</span>{" "}
                                <span>{booking.quantity}</span>
                              </div>
                              <div className="text-xs bg-muted p-2 rounded">
                                <span className="text-muted-foreground">Booked on:</span>{" "}
                                <span>{format(booking.date, "MMM d, yyyy")}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              {booking.event && (
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/events/${booking.event.id}`}>View Event</Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-muted rounded-lg">
                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-xl font-medium mb-2">No past events</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any past events in your booking history.
                    </p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
