
import React from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, Clock, FileText, MapPin, Plus, TicketCheck, User, Users } from "lucide-react";
import { format, addDays } from "date-fns";
import { motion } from "framer-motion";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";

// Chart components (using basic divs for simplicity)
const BarChart = ({ data }: { data: number[] }) => (
  <div className="flex items-end h-32 gap-2 mt-4">
    {data.map((value, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-1">
        <div 
          className="w-full bg-primary rounded-t-sm" 
          style={{ height: `${value}px` }}
        ></div>
        <span className="text-xs text-muted-foreground">{`D${i+1}`}</span>
      </div>
    ))}
  </div>
);

const DonutChart = ({ segments }: { segments: { value: number, color: string }[] }) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let cumulativePercentage = 0;
  
  return (
    <div className="relative w-32 h-32 mx-auto my-4">
      <div className="absolute inset-0 rounded-full border-8 border-background"></div>
      {segments.map((segment, i) => {
        const percentage = (segment.value / total) * 100;
        const oldCumulative = cumulativePercentage;
        cumulativePercentage += percentage;
        
        return (
          <div 
            key={i}
            className="absolute inset-0"
            style={{
              background: `conic-gradient(transparent ${oldCumulative}%, ${segment.color} ${oldCumulative}%, ${segment.color} ${cumulativePercentage}%, transparent ${cumulativePercentage}%)`,
              borderRadius: '50%',
            }}
          ></div>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-background rounded-full w-2/3 h-2/3 flex items-center justify-center">
          <span className="text-lg font-medium">{total}</span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { events, bookings } = useEvents();
  const { user } = useAuth();
  
  // Calculate some statistics for the dashboard
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
  const totalBookings = bookings.length;
  const totalUsers = 75; // Sample data
  const recentBookings = bookings.slice(-5);
  
  // Sample chart data
  const visitorChartData = [45, 62, 58, 75, 80, 95, 92];
  const categoryData = [
    { value: events.filter(e => e.category === "Conference").length, color: 'rgb(124, 58, 237)' },
    { value: events.filter(e => e.category === "Music").length, color: 'rgb(56, 189, 248)' },
    { value: events.filter(e => e.category === "Workshop").length, color: 'rgb(52, 211, 153)' },
    { value: events.filter(e => ["Arts", "Sports", "Entertainment", "Charity"].includes(e.category)).length, color: 'rgb(251, 146, 60)' },
  ];
  
  // Animation variants
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
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's an overview of your events and bookings.
        </p>
      </div>
      
      {/* Stats Overview */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={item}>
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold">{events.length}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-medium">{upcomingEvents} upcoming</span>
                <span className="text-muted-foreground mx-2">·</span>
                <span className="text-muted-foreground">{events.length - upcomingEvents} past</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold">{totalBookings}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TicketCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-medium">+24% </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">$9,820</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-medium">+12% </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-medium">+8% </span>
                <span className="text-muted-foreground">new users this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visitors Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Website Visitors</CardTitle>
                <CardDescription>Daily visitor trends for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={visitorChartData} />
              </CardContent>
            </Card>
            
            {/* Event Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Event Categories</CardTitle>
                <CardDescription>Distribution of events by category</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <DonutChart segments={categoryData} />
                <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                    <span className="text-sm">Conference</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-sky-400 mr-2"></div>
                    <span className="text-sm">Music</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div>
                    <span className="text-sm">Workshop</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
                    <span className="text-sm">Other</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Events */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events scheduled in the next 30 days</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/events">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events
                    .filter(event => {
                      const eventDate = new Date(event.date);
                      const thirtyDaysLater = addDays(new Date(), 30);
                      return eventDate > new Date() && eventDate <= thirtyDaysLater;
                    })
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex gap-4 items-center">
                          <div className="bg-primary/10 h-12 w-12 rounded-md flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{event.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(new Date(event.date), "MMM d, yyyy")}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.venue}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge>
                          {event.status === "available" 
                            ? "Available" 
                            : event.status === "free" 
                            ? "Free" 
                            : event.status === "few-tickets" 
                            ? "Few tickets" 
                            : "Sold out"}
                        </Badge>
                      </div>
                    ))}
                  
                  {events.filter(event => {
                    const eventDate = new Date(event.date);
                    const thirtyDaysLater = addDays(new Date(), 30);
                    return eventDate > new Date() && eventDate <= thirtyDaysLater;
                  }).length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No upcoming events in the next 30 days</p>
                      <Button asChild>
                        <Link to="/admin/events/create">
                          <Plus className="h-4 w-4 mr-2" /> Create Event
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking activity</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link to="/admin/events">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.length > 0 ? (
                    recentBookings.map(booking => {
                      const event = events.find(e => e.id === booking.eventId);
                      if (!event) return null;
                      
                      return (
                        <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex gap-4">
                            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">New booking for "{event.title}"</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(booking.date), "MMMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            #{booking.id.slice(-6).toUpperCase()}
                          </Badge>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No recent bookings</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>Manage all your events from here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-6">
                <p className="text-muted-foreground">
                  {events.length} event{events.length !== 1 ? 's' : ''} total
                </p>
                <Button asChild>
                  <Link to="/admin/events/create">
                    <Plus className="mr-2 h-4 w-4" /> Create Event
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    <Link to={`/admin/events/edit/${event.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link to="/admin/events">View All Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Recent ticket purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bookings.length > 0 ? (
                  bookings.slice(0, 5).map(booking => {
                    const event = events.find(e => e.id === booking.eventId);
                    if (!event) return null;
                    
                    return (
                      <div key={booking.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                        <div className="flex gap-4">
                          <div className="relative aspect-square w-16 rounded-md overflow-hidden">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <div className="text-xs text-muted-foreground">
                              <p>Booking ID: #{booking.id.slice(-6).toUpperCase()}</p>
                              <p>Date: {format(new Date(booking.date), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(event.price * booking.quantity).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Qty: {booking.quantity}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No bookings found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage your users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button asChild>
                  <Link to="/admin/users">View User Management</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Create Event</h3>
            <p className="text-sm text-muted-foreground mb-4">Add a new event to your platform</p>
            <Button asChild className="w-full">
              <Link to="/admin/events/create">Create Now</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Manage Users</h3>
            <p className="text-sm text-muted-foreground mb-4">View and manage your users</p>
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <TicketCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Booking Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">View detailed booking statistics</p>
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin">View Reports</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Site Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">Configure your application settings</p>
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/settings">Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
