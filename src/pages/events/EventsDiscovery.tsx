
import React, { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchFilters } from "@/components/events/search-filters"
import { EventCard } from "@/components/events/event-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List, MapPin, SlidersHorizontal, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useEvents } from "@/context/EventContext"
import { addDays, isSameDay, isWithinInterval, startOfDay, endOfDay, addMonths } from "date-fns"

const EventsDiscovery = () => {
  const { events } = useEvents()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState("grid")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [timeFilter, setTimeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-asc")
  
  // Get category from URL if provided
  const categoryFromUrl = searchParams.get("category")
  
  useEffect(() => {
    let filtered = [...events]
    
    // Apply text search
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply category filter from URL
    if (categoryFromUrl) {
      filtered = filtered.filter(event => 
        event.category.toLowerCase() === categoryFromUrl.toLowerCase()
      )
    }
    
    // Apply time filter
    const today = new Date()
    
    switch (timeFilter) {
      case "today":
        filtered = filtered.filter(event => 
          isSameDay(new Date(event.date), today)
        )
        break
      case "weekend":
        const saturday = addDays(today, (6 - today.getDay()) % 7)
        const sunday = addDays(saturday, 1)
        filtered = filtered.filter(event => 
          isWithinInterval(new Date(event.date), {
            start: startOfDay(saturday),
            end: endOfDay(sunday)
          })
        )
        break
      case "week":
        const nextWeek = addDays(today, 7)
        filtered = filtered.filter(event => 
          isWithinInterval(new Date(event.date), {
            start: startOfDay(today),
            end: endOfDay(nextWeek)
          })
        )
        break
      case "month":
        const nextMonth = addMonths(today, 1)
        filtered = filtered.filter(event => 
          isWithinInterval(new Date(event.date), {
            start: startOfDay(today),
            end: endOfDay(nextMonth)
          })
        )
        break
      default:
        // "all" - no additional filtering
        break
    }
    
    // Apply sorting
    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "price-asc":
        filtered.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "price-desc":
        filtered.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }
    
    setFilteredEvents(filtered)
  }, [events, searchQuery, timeFilter, sortBy, categoryFromUrl])
  
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
        {categoryFromUrl && (
          <p className="text-xl text-muted-foreground mb-4 capitalize">
            Category: {categoryFromUrl}
          </p>
        )}
        
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
          <Tabs defaultValue="all" value={timeFilter} onValueChange={setTimeFilter} className="w-full sm:w-auto">
            <TabsList className="bg-muted/50">
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
            <Select value={sortBy} onValueChange={setSortBy}>
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
            {view === "grid" && (
              <>
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        id={event.id}
                        title={event.title}
                        description={event.description}
                        category={event.category}
                        date={new Date(event.date)}
                        time={event.time}
                        venue={event.venue}
                        price={event.price}
                        imageUrl={event.imageUrl}
                        status={event.status}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No events found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("");
                      setTimeFilter("all");
                      setSearchParams({});
                    }}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {view === "list" && (
              <>
                {filteredEvents.length > 0 ? (
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
                              {new Date(event.date).toLocaleDateString()}
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
                              {typeof event.price === "number" 
                                ? event.price === 0 
                                  ? "Free" 
                                  : `$${event.price.toFixed(2)}`
                                : event.price}
                            </div>
                            <Button asChild>
                              <Link to={`/events/${event.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No events found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("");
                      setTimeFilter("all");
                      setSearchParams({});
                    }}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </>
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
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default EventsDiscovery
