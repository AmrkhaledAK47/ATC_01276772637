
import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { format, isPast } from "date-fns";
import { Calendar, Clock, MapPin, Ticket, CalendarDays, ArrowRight, UserCircle, Settings } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { events } = useEvents();

  // Filter booked events for the user
  const userBookedEvents = events.filter(event => user?.bookedEvents.includes(event.id));
  
  // Separate upcoming and past events
  const upcomingEvents = userBookedEvents.filter(event => !isPast(event.date));
  const pastEvents = userBookedEvents.filter(event => isPast(event.date));

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">You need to log in</h1>
          <p className="mt-4 text-muted-foreground">
            Please log in to view your dashboard.
          </p>
          <Button asChild className="mt-6">
            <Link to="/auth">Log In</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">
            Manage your bookings and account details.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-2">
                      <span className="text-2xl font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{user.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{user.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                    <div className="flex items-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                        {user.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/user/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-muted-foreground text-sm">Upcoming</p>
                    <p className="text-2xl font-bold">{upcomingEvents.length}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-muted-foreground text-sm">Past</p>
                    <p className="text-2xl font-bold">{pastEvents.length}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center col-span-2">
                    <p className="text-muted-foreground text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold">{userBookedEvents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Upcoming Events */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Upcoming Bookings
                  </CardTitle>
                  <CardDescription>
                    Your next events
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/user/bookings">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">No upcoming events</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      You have no upcoming bookings
                    </p>
                    <Button className="mt-4" asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="sm:w-1/4 aspect-video sm:aspect-square rounded-md overflow-hidden">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-1">{event.title}</h3>
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                              <span>{format(event.date, "EEEE, MMM d, yyyy")}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/events/${event.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events
                      .filter(e => !user.bookedEvents.includes(e.id))
                      .filter(e => e.status !== "sold-out")
                      .slice(0, 3)
                      .map(event => (
                        <div key={event.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">{event.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {format(event.date, "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      ))
                    }

                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/events">
                        Discover More Events
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" asChild>
                      <Link to="/events">
                        <Ticket className="mr-2 h-4 w-4" />
                        Book New Event
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/user/bookings">
                        <Calendar className="mr-2 h-4 w-4" />
                        View All Bookings
                      </Link>
                    </Button>
                    {user.role === "admin" && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
