
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchFilters } from "@/components/events/search-filters"
import { EventCard } from "@/components/events/event-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List, MapPin, SlidersHorizontal, Calendar, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useEvents } from "@/hooks/useEvents"
import { useAuth } from "@/hooks/useAuth"
import { BadgeStatus } from "@/components/ui/badge-status"

const EventsDiscovery = () => {
  const { events, isEventBooked } = useEvents();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState("grid")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("date-asc")
  
  // Filter events based on search query and category
  useEffect(() => {
    let result = [...events];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        event => event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply sorting
    result = sortEvents(result, sortOrder);
    
    setFilteredEvents(result);
  }, [events, searchQuery, selectedCategory, sortOrder]);

  const sortEvents = (eventsToSort: any[], order: string) => {
    return [...eventsToSort].sort((a, b) => {
      switch (order) {
        case "date-asc":
          return a.date.getTime() - b.date.getTime();
        case "date-desc":
          return b.date.getTime() - a.date.getTime();
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };
  
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
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList className="bg-muted/50">
              <TabsTrigger 
                value="all" 
                onClick={() => setSelectedCategory("all")}
              >
                All Events
              </TabsTrigger>
              <TabsTrigger 
                value="today"
                onClick={() => setSelectedCategory("all")} // We'll use date filtering separately
              >
                Today
              </TabsTrigger>
              <TabsTrigger 
                value="weekend"
                onClick={() => setSelectedCategory("all")} // We'll use date filtering separately
              >
                This Weekend
              </TabsTrigger>
              <TabsTrigger 
                value="week"
                onClick={() => setSelectedCategory("all")} // We'll use date filtering separately
              >
                This Week
              </TabsTrigger>
              <TabsTrigger 
                value="month"
                onClick={() => setSelectedCategory("all")} // We'll use date filtering separately
              >
                This Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 items-center">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            <Select 
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value)}
            >
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
            <SearchFilters 
              onCategoryChange={(category) => setSelectedCategory(category)}
              selectedCategory={selectedCategory}
            />
          </motion.div>
          
          {/* Events Grid */}
          <div className="lg:col-span-3">
            {view === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto justify-center">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => {
                    const isBooked = isAuthenticated && isEventBooked(event.id);
                    return (
                      <EventCard 
                        key={event.id} 
                        {...event}
                        // Use render props pattern to customize card
                        renderExtraContent={() => 
                          isBooked ? (
                            <div className="absolute top-12 left-2">
                              <BadgeStatus variant="success">
                                <Check className="h-3 w-3 mr-1" /> Booked
                              </BadgeStatus>
                            </div>
                          ) : null
                        } 
                      />
                    );
                  })
                ) : (
                  <div className="lg:col-span-3 text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No events found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                    <Button onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}>Clear Filters</Button>
                  </div>
                )}
              </div>
            )}
            
            {view === "list" && (
              <div className="space-y-4">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => {
                    const isBooked = isAuthenticated && isEventBooked(event.id);
                    return (
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
                          {isBooked && (
                            <div className="absolute top-2 left-2">
                              <BadgeStatus variant="success">
                                <Check className="h-3 w-3 mr-1" /> Booked
                              </BadgeStatus>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 mb-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {event.date.toLocaleDateString()}
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
                            <Button asChild>
                              <Link to={`/events/${event.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No events found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                    <Button onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}>Clear Filters</Button>
                  </div>
                )}
              </div>
            )}
            
            {view === "map" && (
              <div className="relative h-[600px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-xl font-bold mb-2">Map View</h3>
                  <p className="text-muted-foreground">
                    Interactive map would be displayed here.
                  </p>
                </div>
              </div>
            )}
            
            {/* Load More */}
            {filteredEvents.length > 0 && (
              <div className="flex justify-center mt-10">
                <Button variant="outline" className="gap-2">
                  Load More Events
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default EventsDiscovery
