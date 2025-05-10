
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  TicketCheck, 
  User, 
  Bell, 
  Settings, 
  History,
  Star,
  Heart,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const { getUserBookings, getEvent } = useEvents();
  const [activeTab, setActiveTab] = useState("upcoming");
  const userBookings = getUserBookings();
  
  // Separate bookings into upcoming and past based on event date
  const now = new Date();
  const upcomingBookings = userBookings.filter(booking => {
    const event = getEvent(booking.eventId);
    return event && new Date(event.date) >= now;
  });
  
  const pastBookings = userBookings.filter(booking => {
    const event = getEvent(booking.eventId);
    return event && new Date(event.date) < now;
  });
  
  // Animations
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
  
  // Stats data
  const userStats = [
    { 
      title: "Total Bookings", 
      value: userBookings.length,
      icon: <TicketCheck className="h-5 w-5 text-primary" /> 
    },
    { 
      title: "Upcoming Events", 
      value: upcomingBookings.length,
      icon: <Calendar className="h-5 w-5 text-primary" /> 
    },
    { 
      title: "Past Events", 
      value: pastBookings.length,
      icon: <History className="h-5 w-5 text-primary" /> 
    },
    { 
      title: "Favorites", 
      value: 2,
      icon: <Heart className="h-5 w-5 text-primary" /> 
    },
  ];
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your bookings and account details</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Notifications</span>
              <Badge className="ml-1 bg-primary text-primary-foreground">2</Badge>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Settings</span>
            </Button>
          </div>
        </div>
        
        {/* User Stats */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {userStats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Bookings Tabs */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>
              View and manage your event bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingBookings.length > 0 ? (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {upcomingBookings.map(booking => {
                      const event = getEvent(booking.eventId);
                      if (!event) return null;
                      
                      return (
                        <motion.div key={booking.id} variants={item}>
                          <Card className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4 aspect-video md:aspect-auto">
                                <img 
                                  src={event.imageUrl} 
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">{event.category}</Badge>
                                      <Badge variant="default" className="bg-primary-700">
                                        {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                                      </Badge>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{event.time}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.venue}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Booking Reference:</span> #{booking.id.slice(-6).toUpperCase()}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-2 md:items-end">
                                    <div className="text-right">
                                      <div className="text-sm text-muted-foreground">Price</div>
                                      <div className="font-bold">${(event.price * booking.quantity).toFixed(2)}</div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      <Button asChild>
                                        <Link to={`/booking/confirmation/${booking.id}`}>
                                          View Ticket
                                        </Link>
                                      </Button>
                                      <Button variant="outline" asChild>
                                        <Link to={`/events/${event.id}`}>
                                          Event Details
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="text-center py-10">
                    <TicketCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-xl font-semibold mb-2">No Upcoming Bookings</h3>
                    <p className="text-muted-foreground mb-6">You don't have any upcoming events booked.</p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastBookings.length > 0 ? (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {pastBookings.map(booking => {
                      const event = getEvent(booking.eventId);
                      if (!event) return null;
                      
                      return (
                        <motion.div key={booking.id} variants={item}>
                          <Card className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4 aspect-video md:aspect-auto">
                                <img 
                                  src={event.imageUrl} 
                                  alt={event.title}
                                  className="w-full h-full object-cover opacity-80"
                                />
                              </div>
                              <div className="flex-1 p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">{event.category}</Badge>
                                      <Badge variant="secondary">Past</Badge>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.venue}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                      <span className="text-sm text-muted-foreground mr-1">Rate this event:</span>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={star} 
                                          className="h-4 w-4 cursor-pointer text-muted hover:text-yellow-400" 
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <Button variant="outline" asChild size="sm">
                                    <Link to={`/events/${event.id}`}>
                                      View Event
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="text-center py-10">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-xl font-semibold mb-2">No Past Events</h3>
                    <p className="text-muted-foreground mb-6">You haven't attended any events yet.</p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Recommended Events */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recommended Events</h2>
            <Button variant="link" asChild>
              <Link to="/events">Browse all <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Sample recommended events */}
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden hover:border-primary/40 transition-colors">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${index === 0 
                      ? "1540575467063-178a50c2df87" 
                      : index === 1 
                      ? "1470229722913-7c0e2dbbafd3"
                      : index === 2
                      ? "1531058020387-3be344556be6"
                      : "1511795409834-ef04bbd61622"}?auto=format&fit=crop&w=500&q=80`}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="font-semibold text-white">{
                      index === 0 ? "Tech Summit 2025" :
                      index === 1 ? "Jazz Concert" :
                      index === 2 ? "Art Exhibition" :
                      "Charity Gala"
                    }</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {
                        index === 0 ? "Conference" :
                        index === 1 ? "Music" :
                        index === 2 ? "Arts" :
                        "Charity"
                      }
                    </Badge>
                    <span className="text-sm font-semibold">
                      {
                        index === 0 ? "$199" :
                        index === 1 ? "$85" :
                        index === 2 ? "Free" :
                        "$150"
                      }
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{
                      format(
                        new Date(
                          2025, 
                          index === 0 ? 6 : index === 1 ? 7 : index === 2 ? 5 : 8, 
                          index * 5 + 10
                        ), 
                        "MMM d, yyyy"
                      )
                    }</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex flex-col items-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary/60" />
                  )}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Picture
                </Button>
              </div>
              
              <div className="md:w-3/4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Full Name</label>
                    <p className="p-2 border rounded-md bg-muted/30">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email Address</label>
                    <p className="p-2 border rounded-md bg-muted/30">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">User Role</label>
                    <p className="p-2 border rounded-md bg-muted/30 capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Member Since</label>
                    <p className="p-2 border rounded-md bg-muted/30">{format(new Date(), "MMMM yyyy")}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 justify-end">
                  <Button variant="outline">Edit Profile</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
