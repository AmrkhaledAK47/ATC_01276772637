
import React, { useState } from "react"
import { MainLayout } from "@/layouts/main-layout"
import { EventCard } from "@/components/events/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchFilters } from "@/components/events/search-filters"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Map as MapIcon, 
  SlidersHorizontal, 
  ChevronDown 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Import mock data from Index page for now
// In a real app, this would come from an API
import { featuredEvents } from "../Index"

const EventsDiscovery = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState(featuredEvents)
  const [isLoading, setIsLoading] = useState(false)
  
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger an API request
    setIsLoading(true)
    
    // Simulate API request
    setTimeout(() => {
      const filtered = featuredEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setEvents(filtered)
      setIsLoading(false)
    }, 800)
  }
  
  const loadMore = () => {
    setIsLoading(true)
    
    // Simulate loading more events
    setTimeout(() => {
      // In a real app, this would fetch the next page of results
      // For now, just duplicate the events
      setEvents([...events, ...featuredEvents.slice(0, 4)])
      setIsLoading(false)
    }, 1000)
  }
  
  const renderViewModeToggle = () => (
    <div className="bg-card rounded-lg flex overflow-hidden shadow-sm">
      <button 
        className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
        onClick={() => setViewMode('grid')}
        aria-label="Grid view"
      >
        <Grid className="h-5 w-5" />
      </button>
      <button 
        className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
        onClick={() => setViewMode('list')}
        aria-label="List view"
      >
        <List className="h-5 w-5" />
      </button>
      <button 
        className={`p-2 ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
        onClick={() => setViewMode('map')}
        aria-label="Map view"
      >
        <MapIcon className="h-5 w-5" />
      </button>
    </div>
  )
  
  return (
    <MainLayout>
      <section className="py-12">
        <h1 className="mb-8">Discover Events</h1>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search events..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              type="button"
              onClick={toggleFilters}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            <Button type="submit" className="min-w-[80px]">
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
            
            <div className="hidden md:block">
              {renderViewModeToggle()}
            </div>
          </form>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <SearchFilters />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-between mt-4">
            <p className="text-muted-foreground">
              {events.length} events found
            </p>
            <div className="md:hidden">
              {renderViewModeToggle()}
            </div>
          </div>
        </div>
        
        {/* Events Grid/List */}
        <div className={`
          ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : ''}
          ${viewMode === 'list' ? 'flex flex-col gap-4' : ''}
          ${viewMode === 'map' ? 'relative min-h-[500px]' : ''}
        `}>
          {viewMode === 'map' ? (
            <div className="absolute inset-0 rounded-lg overflow-hidden border border-border bg-card flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map will be displayed here</p>
              {/* In a real app, this would be a map component */}
            </div>
          ) : (
            <>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard {...event} className={viewMode === 'list' ? 'flex' : ''} />
                </motion.div>
              ))}
              
              {events.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="mb-4 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-xl font-semibold">No events found</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any events matching your search criteria
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("")
                    setEvents(featuredEvents)
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Load More Button */}
        {events.length > 0 && (
          <div className="mt-12 text-center">
            <Button 
              onClick={loadMore}
              variant="outline"
              className="px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load more events"
              )}
            </Button>
          </div>
        )}
      </section>
    </MainLayout>
  )
}

export default EventsDiscovery
