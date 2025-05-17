import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/events/event-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, formatDistanceToNow } from "date-fns"
import { CalendarDays, Clock, MapPin, Star, Ticket, Heart, Search, Mail, UserCircle, ArrowUpRight, Settings, Bell, Calendar, LogOut } from "lucide-react"
import { AuthService } from "@/services/auth.service"
import { BookingsService } from "@/services/bookings.service"
import { Booking, User, Event, BookingStatus } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { EventsService } from "@/services/events.service"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const UserDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [user, setUser] = useState<User | null>(null)
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [savedEvents, setSavedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCancel, setLoadingCancel] = useState<string | null>(null)

  useEffect(() => {
    // Load user data
    const storedUser = AuthService.getCurrentUserFromStorage();
    setUser(storedUser);

    // Load user bookings
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch bookings
        const bookings = await BookingsService.getMyBookings();

        // Separate bookings into upcoming and past based on event date
        const now = new Date();
        const upcoming = bookings.filter(
          booking =>
            new Date(booking.event.date) > now &&
            booking.status !== BookingStatus.CANCELLED
        );
        const past = bookings.filter(
          booking =>
            new Date(booking.event.date) <= now ||
            booking.status === BookingStatus.CANCELLED
        );

        setUpcomingBookings(upcoming);
        setPastBookings(past);

        // Fetch featured events as "saved" events (since we don't have actual saved events yet)
        try {
          const featured = await EventsService.getFeaturedEvents();
          setSavedEvents(featured);
        } catch (error) {
          console.error('Error fetching saved events:', error);
          setSavedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Helper functions for user data
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAuthProvider = (user: User | null) => {
    if (!user) return null;

    // Check for GitHub or Google email patterns
    const email = user.email.toLowerCase();
    if (email.includes("github")) return "GitHub";
    if (email.includes("gmail") || email.endsWith("googlemail.com")) return "Google";

    // Check if avatar contains github or google domains
    const avatar = user.avatar || "";
    if (avatar.includes("github")) return "GitHub";
    if (avatar.includes("googleusercontent")) return "Google";

    return null;
  };

  const authProvider = getAuthProvider(user);

  // Use fallback data if needed
  const userDisplayData = user || {
    name: "User",
    email: "user@example.com",
    avatar: "",
    createdAt: new Date().toISOString()
  };

  // Handle cancellation of booking
  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setLoadingCancel(bookingId);
      try {
        await BookingsService.cancelBooking(bookingId);

        // Update the booking status in state
        setUpcomingBookings(prev =>
          prev.filter(booking => booking.id !== bookingId)
        );

        // Add to past bookings with cancelled status
        const cancelledBooking = upcomingBookings.find(b => b.id === bookingId);
        if (cancelledBooking) {
          setPastBookings(prev => [
            {
              ...cancelledBooking,
              status: BookingStatus.CANCELLED
            },
            ...prev
          ]);
        }

        toast.success("Booking cancelled successfully");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking");
      } finally {
        setLoadingCancel(null);
      }
    }
  };

  // Get time until event
  const getTimeUntilEvent = (date: string | Date) => {
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(eventDate, { addSuffix: true });
  };

  return (
    <MainLayout>
      <div className="container py-12">
        {/* User Profile Section */}
        <div className="flex flex-col md:flex-row items-start mb-12 gap-6">
          <div className="w-full md:w-1/4">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                {loading ? (
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                ) : (
                  <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
                    <AvatarImage src={userDisplayData.avatar} alt={userDisplayData.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary font-medium">
                      {getInitials(userDisplayData.name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {loading ? (
                  <>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-5 w-40 mb-4" />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{userDisplayData.name}</h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">{userDisplayData.email}</p>
                    </div>

                    {authProvider && (
                      <Badge variant="outline" className="mb-3">
                        <UserCircle className="h-3 w-3 mr-1" />
                        Signed in with {authProvider}
                      </Badge>
                    )}
                  </>
                )}

                <p className="text-sm text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-28" />
                  ) : (
                    `Member since ${format(new Date(userDisplayData.createdAt), "MMMM yyyy")}`
                  )}
                </p>

                <div className="flex gap-2 mt-4 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/user/profile')}
                  >
                    <Settings className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <UserCircle className="h-4 w-4 mr-2" /> Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/user/profile')}>
                        <UserCircle className="h-4 w-4 mr-2" /> Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/user/notifications')}>
                        <Bell className="h-4 w-4 mr-2" /> Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/user/bookings')}>
                        <Calendar className="h-4 w-4 mr-2" /> My Bookings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => AuthService.logout()}>
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          </div>

          <div className="w-full md:w-3/4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Upcoming Events</p>
                    <h3 className="text-2xl font-bold">
                      {loading ? <Skeleton className="h-8 w-12" /> : upcomingBookings.length}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4">
                    <Ticket className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Past Events</p>
                    <h3 className="text-2xl font-bold">
                      {loading ? <Skeleton className="h-8 w-12" /> : pastBookings.length}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="bg-accent/10 p-3 rounded-full mr-4">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Saved Events</p>
                    <h3 className="text-2xl font-bold">
                      {loading ? <Skeleton className="h-8 w-12" /> : savedEvents.length}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-card/50 backdrop-blur">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
                <TabsTrigger value="saved">Saved Events</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <div className="space-y-6">
                  {loading ? (
                    // Skeleton loaders
                    Array.from({ length: 2 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto">
                            <Skeleton className="w-full h-full" />
                          </div>
                          <div className="p-6 md:w-3/4">
                            <Skeleton className="h-8 w-4/5 mb-3" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-6" />
                            <Skeleton className="h-4 w-1/3 mb-6" />
                            <div className="flex gap-2">
                              <Skeleton className="h-10 w-28" />
                              <Skeleton className="h-10 w-36" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : upcomingBookings.length > 0 ? (
                    upcomingBookings.map(booking => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto relative">
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                {getTimeUntilEvent(booking.event.date)}
                              </Badge>
                            </div>
                            <img
                              src={booking.event.image}
                              alt={booking.event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-3/4 flex flex-col">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <Link to={`/events/${booking.eventId}`} className="hover:underline">
                                  <h3 className="text-xl font-bold">{booking.event.title}</h3>
                                </Link>
                                <Badge>{booking.status}</Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1" />
                                  {format(new Date(booking.event.date), "EEEE, MMMM dd, yyyy")}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {booking.event.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.event.location}
                                </div>
                              </div>
                              <div className="flex items-center text-muted-foreground mb-4">
                                <p className="mr-4">Booking #{booking.id.substring(0, 8)}</p>
                                <p className="flex items-center px-2 py-1 rounded-full bg-muted text-xs">
                                  <Ticket className="h-3 w-3 mr-1" />
                                  {booking.tickets} {booking.tickets > 1 ? "tickets" : "ticket"}
                                </p>
                              </div>
                              {booking.totalPrice > 0 && (
                                <p className="text-sm mb-4">
                                  <span className="font-semibold">Total paid:</span> ${booking.totalPrice.toFixed(2)}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button asChild size="sm">
                                <Link to={`/booking/confirmation/${booking.id}`}>
                                  View Ticket
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/events/${booking.eventId}`}>
                                  Event Details <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={loadingCancel === booking.id}
                              >
                                {loadingCancel === booking.id ? (
                                  <span className="flex items-center">
                                    <Spinner className="mr-2" size="sm" /> Cancelling...
                                  </span>
                                ) : (
                                  "Cancel Booking"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <Ticket className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
                      <p className="text-muted-foreground mb-6">
                        You don't have any upcoming event bookings.
                      </p>
                      <Button asChild>
                        <Link to="/events">
                          <Search className="h-4 w-4 mr-2" /> Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <div className="space-y-6">
                  {loading ? (
                    // Skeleton loaders
                    Array.from({ length: 2 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto">
                            <Skeleton className="w-full h-full" />
                          </div>
                          <div className="p-6 md:w-3/4">
                            <Skeleton className="h-8 w-4/5 mb-3" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-6" />
                            <Skeleton className="h-4 w-1/3 mb-6" />
                            <div className="flex gap-2">
                              <Skeleton className="h-10 w-28" />
                              <Skeleton className="h-10 w-36" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : pastBookings.length > 0 ? (
                    pastBookings.map(booking => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto relative">
                            {booking.status === BookingStatus.CANCELLED && (
                              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                <Badge variant="destructive" className="text-sm px-3 py-1">
                                  CANCELLED
                                </Badge>
                              </div>
                            )}
                            <img
                              src={booking.event.image}
                              alt={booking.event.title}
                              className={`w-full h-full object-cover ${booking.status !== BookingStatus.CANCELLED ? 'grayscale opacity-80' : ''}`}
                            />
                          </div>
                          <div className="p-6 md:w-3/4 flex flex-col">
                            <div className="flex-1">
                              <Link to={`/events/${booking.eventId}`} className="hover:underline">
                                <h3 className="text-xl font-bold mb-2">{booking.event.title}</h3>
                              </Link>
                              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1" />
                                  {format(new Date(booking.event.date), "EEEE, MMMM dd, yyyy")}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {booking.event.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.event.location}
                                </div>
                              </div>
                              <div className="flex items-center text-muted-foreground mb-4">
                                <p className="mr-4">Booking #{booking.id.substring(0, 8)}</p>
                                <p className="flex items-center px-2 py-1 rounded-full bg-muted text-xs">
                                  <Ticket className="h-3 w-3 mr-1" />
                                  {booking.tickets} {booking.tickets > 1 ? "tickets" : "ticket"}
                                </p>
                              </div>
                            </div>

                            {booking.status !== BookingStatus.CANCELLED && (
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium mr-2">Rate this event:</p>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Button
                                    key={star}
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-auto"
                                  >
                                    <Star className="h-5 w-5 text-muted-foreground hover:text-yellow-400" />
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <Ticket className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Past Events</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't attended any events yet.
                      </p>
                      <Button asChild>
                        <Link to="/events">
                          <Search className="h-4 w-4 mr-2" /> Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    // Skeleton loaders
                    Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="h-48">
                          <Skeleton className="w-full h-full" />
                        </div>
                        <div className="p-4">
                          <Skeleton className="h-6 w-4/5 mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </Card>
                    ))
                  ) : savedEvents.length > 0 ? (
                    savedEvents.map(event => (
                      <Card key={event.id} className="overflow-hidden flex flex-col">
                        <div className="h-48 relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 bg-background/40 backdrop-blur-sm hover:bg-background/60 text-white hover:text-primary"
                              onClick={() => toast.success("Event removed from saved list")}
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="bg-background/60 backdrop-blur-sm">
                              {event.category?.name || "Event"}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="font-bold mb-1 truncate">
                              <Link to={`/events/${event.id}`} className="hover:underline">
                                {event.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground mb-2">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {format(new Date(event.date), 'MMM dd, yyyy')}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold">
                              {event.price > 0
                                ? `$${event.price.toFixed(2)}`
                                : <Badge variant="secondary" className="font-normal">Free</Badge>
                              }
                            </span>
                            <Button size="sm" asChild>
                              <Link to={`/events/${event.id}`}>
                                Book Now
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <Heart className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Saved Events</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't saved any events yet.
                      </p>
                      <Button asChild>
                        <Link to="/events">
                          <Search className="h-4 w-4 mr-2" /> Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default UserDashboard
