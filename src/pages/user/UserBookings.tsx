
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents, Event } from "@/hooks/useEvents";
import { format, isPast } from "date-fns";
import { Calendar, Search, Ticket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const UserBookings = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // Get user's booked events
  useEffect(() => {
    if (user && events.length > 0) {
      let bookedEvents = events.filter(event => user.bookedEvents.includes(event.id));
      
      // Apply tab filter
      if (activeTab === "upcoming") {
        bookedEvents = bookedEvents.filter(event => !isPast(event.date));
      } else if (activeTab === "past") {
        bookedEvents = bookedEvents.filter(event => isPast(event.date));
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        bookedEvents = bookedEvents.filter(
          event => 
            event.title.toLowerCase().includes(query) || 
            event.venue.toLowerCase().includes(query) ||
            event.category.toLowerCase().includes(query)
        );
      }
      
      // Sort by date
      bookedEvents.sort((a, b) => {
        if (activeTab === "upcoming") {
          return a.date.getTime() - b.date.getTime(); // Closest first
        } else {
          return b.date.getTime() - a.date.getTime(); // Most recent first for past events
        }
      });
      
      setFilteredEvents(bookedEvents);
    }
  }, [user, events, activeTab, searchQuery]);
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">You need to log in</h1>
          <p className="mt-4 text-muted-foreground">
            Please log in to view your bookings.
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
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground mb-8">
          View and manage all your booked events
        </p>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search your bookings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Bookings Table/Display */}
        {filteredEvents.length === 0 ? (
          <motion.div 
            className="bg-card border rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {searchQuery ? 'No matching bookings found' : 'No bookings yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search terms or filters'
                : "You haven't booked any events yet. Explore our events and start booking!"}
            </p>
            <Button asChild>
              <Link to="/events">
                Discover Events <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const isPastEvent = isPast(event.date);
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-primary" />
                          <span>{format(event.date, "PPP")}</span>
                        </div>
                        {event.time && <span className="text-sm text-muted-foreground block mt-1">{event.time}</span>}
                      </TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell>
                        {isPastEvent ? (
                          <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">
                            Upcoming
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserBookings;
