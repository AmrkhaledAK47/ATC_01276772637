
import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchFilters } from "@/components/events/search-filters"
import { EventCard } from "@/components/events/event-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List, MapPin, SlidersHorizontal, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useEvents } from "@/hooks/useEvents"
import { useAuth } from "@/contexts/AuthContext"
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isBefore, isAfter, isSameMonth } from "date-fns"

const EventsDiscovery = () => {
  const { events, isLoading } = useEvents()
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState("grid")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sortOrder, setSortOrder] = useState("date-asc")
  
  // Handle filtering and sorting events
  useEffect(() => {
    let result = [...events]
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query)
      )
    }
    
    // Apply tab filter
    const today = new Date()
    const thisWeekStart = startOfWeek(today)
    const thisWeekEnd = endOfWeek(today)
    const thisMonth = today.getMonth()
    const thisYear = today.getFullYear()
    
    switch (activeTab) {
      case "today":
        result = result.filter(event => isSameDay(event.date, today))
        break
      case "weekend":
        // Weekend is considered Friday, Saturday, Sunday
        const friday = addDays(thisWeekStart, 5)
        const sunday = addDays(thisWeekStart, 7)
        result = result.filter(
          event => 
            (isAfter(event.date, friday) || isSameDay(event.date, friday)) && 
            (isBefore(event.date, sunday) || isSameDay(event.date, sunday))
        )
        break
      case "week":
        result = result.filter(
          event => 
            (isAfter(event.date, thisWeekStart) || isSameDay(event.date, thisWeekStart)) && 
            (isBefore(event.date, thisWeekEnd) || isSameDay(event.date, thisWeekEnd))
        )
        break
      case "month":
        result = result.filter(
          event => 
            event.date.getMonth() === thisMonth &&
            event.date.getFullYear() === thisYear
        )
        break
      // "all" case doesn't need filtering
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOrder) {
        case "date-asc":
          return a.date.getTime() - b.date.getTime()
        case "date-desc":
          return b.date.getTime() - a.date.getTime()
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.title.localeCompare(b.title)
        case "name-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
    
    setFilteredEvents(result)
  }, [events, searchQuery, activeTab, sortOrder])
  
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Discover Events</h1>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <div className="border rounded-md flex overflow-hidden">
              <Button 
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="rounded-none border-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-none border-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={view === "map" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("map")}
                className="rounded-none border-0"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Categories and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-muted/50 w-full sm:w-auto">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="weekend">This Weekend</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 items-center">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date: Upcoming</SelectItem>
                <SelectItem value="date-desc">Date: Furthest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Filters Sidebar & Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Shown when isFilterOpen is true on mobile */}
          <motion.div 
            className={`lg:block ${isFilterOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isFilterOpen ? 1 : 0,
              height: isFilterOpen ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <SearchFilters />
          </motion.div>
          
          {/* Events Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg border text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Events Found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any events matching your search criteria.
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {view === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                      <EventCard key={event.id} {...event} />
                    ))}
                  </div>
                )}
                
                {view === "list" && (
                  <div className="space-y-4">
                    {filteredEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-card hover:bg-card/80 transition-colors"
                      >
                        <div className="sm:w-1/3 h-48 sm:h-auto relative">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 mb-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(event.date, "PPP")}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {event.venue}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="font-semibold">
                              {event.price > 0 ? `$${event.price}` : 'Free'}
                            </div>
                            <EventCardActionButton eventId={event.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {view === "map" && (
                  <div className="relative h-[600px] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-muted-foreground mb-4 mx-auto" />
                      <h3 className="text-xl font-bold mb-2">Map View</h3>
                      <p className="text-muted-foreground">
                        Interactive map would be displayed here showing all {filteredEvents.length} events.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Load More button shown only when there's a reasonable number of events */}
                {filteredEvents.length > 9 && (
                  <div className="flex justify-center mt-10">
                    <Button variant="outline" className="gap-2">
                      Load More Events
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// Separate component for the action button to avoid duplication
const EventCardActionButton = ({ eventId }: { eventId: string }) => {
  const { user, bookEvent, isEventBooked } = useAuth();
  const { getEvent } = useEvents();
  const navigate = useNavigate();
  
  const event = getEvent(eventId);
  const isBooked = isEventBooked(eventId);
  
  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    bookEvent(eventId);
  };
  
  if (isBooked) {
    return (
      <Link to={`/events/${eventId}`}>
        <Button 
          className="shadow-sm hover:shadow-glow-accent transition-shadow"
        >
          View Details
        </Button>
      </Link>
    );
  }
  
  if (event?.status === "sold-out") {
    return (
      <Button 
        disabled
        variant="outline"
        className="shadow-sm"
      >
        Sold Out
      </Button>
    );
  }
  
  return (
    <Button 
      className="shadow-sm hover:shadow-glow-accent transition-shadow"
      onClick={handleBookNow}
    >
      Book Now
    </Button>
  );
};

export default EventsDiscovery
