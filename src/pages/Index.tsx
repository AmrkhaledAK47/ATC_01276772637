
import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/events/event-card"
import { SearchFilters } from "@/components/events/search-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Check } from "lucide-react"
import { Particles } from "@/components/ui/particles"
import { Newsletter } from "@/components/common/newsletter"
import { FeaturedCarousel } from "@/components/events/featured-carousel" 
import { CategoryFilter } from "@/components/events/category-filter"
import { Input } from "@/components/ui/input"
import { BadgeStatus } from "@/components/ui/badge-status"
import { useEvents } from "@/hooks/useEvents"
import { useAuth } from "@/hooks/useAuth"

const Index = () => {
  const { featuredEvents, popularEvents, isEventBooked } = useEvents();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [email, setEmail] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(featuredEvents)
  const [isScrolling, setIsScrolling] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");

  // Apply category filtering
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(featuredEvents)
    } else {
      setFilteredEvents(
        featuredEvents.filter(event => event.category.toLowerCase() === selectedCategory.toLowerCase())
      )
    }
  }, [selectedCategory, featuredEvents])

  // Setup scroll observation for animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <MainLayout fullWidth>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900/20 via-background to-secondary-900/20 py-24 md:py-32 lg:py-40 overflow-hidden">
        <Particles count={40} className="opacity-40" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h1 className="mb-6 animate-fade-in">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                Discover Amazing Events
              </span>
              <span>Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Browse and book tickets to conferences, concerts, workshops, and more events happening in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
              <Button size="lg" asChild className="px-8 shadow-glow">
                <Link to="/events">Browse Events</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-background/40 backdrop-blur">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="mt-16 max-w-xl mx-auto relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-30 blur-lg"></div>
            <div className="relative bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <Input 
                type="text" 
                placeholder="Search for events..." 
                className="pl-5 h-14 text-lg rounded-lg bg-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-6 top-1/2 -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </section>
      
      {/* Category Filter Section */}
      <section className="container-wide py-8">
        <h2 className="text-2xl font-bold mb-6">Find Events By Category</h2>
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>
      
      {/* Featured Events */}
      <section className="container-wide section-padding">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Featured Events
            </span>
          </h2>
          <Link to="/events" className="text-primary flex items-center hover:underline group">
            View all
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6 bg-card/50 backdrop-blur">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="weekend">This Weekend</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="stagger-animate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => {
                const isBooked = isAuthenticated && isEventBooked(event.id);
                return (
                  <EventCard 
                    key={event.id} 
                    {...event} 
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
              })}
            </div>
          </TabsContent>
          <TabsContent value="today" className="mt-0">
            <div className="stagger-animate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEvents.slice(0, 2).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weekend" className="mt-0">
            <div className="stagger-animate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEvents.slice(1, 4).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-0">
            <div className="stagger-animate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEvents.slice(2, 6).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Featured Carousel */}
      <section className="container-wide py-16 bg-gradient-to-b from-background to-secondary-900/5">
        <h2 className="text-3xl font-bold mb-10 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
            Trending Events
          </span>
        </h2>
        <FeaturedCarousel events={popularEvents} />
      </section>
      
      {/* Categories Section with Parallax */}
      <section className="py-16 relative overflow-hidden">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Browse by Category
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-animate">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.href} 
                className="group relative overflow-hidden rounded-lg aspect-square glass-card transition-all duration-500 hover:shadow-glow-accent"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="container-wide section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-900/10 to-transparent opacity-30"></div>
        
        <h2 className="text-3xl font-bold mb-12 text-center relative z-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 relative z-10 stagger-animate">
          <div className="neumorphic-card p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-glow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-light">
              <span className="text-2xl font-heading font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Find Events</h3>
            <p className="text-muted-foreground">
              Browse through our extensive collection of events or use the search filters to find exactly what you're looking for.
            </p>
          </div>
          <div className="neumorphic-card p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-glow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-light">
              <span className="text-2xl font-heading font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Book Tickets</h3>
            <p className="text-muted-foreground">
              Select your preferred event and complete the booking process securely within minutes.
            </p>
          </div>
          <div className="neumorphic-card p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-glow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-light">
              <span className="text-2xl font-heading font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Enjoy the Event</h3>
            <p className="text-muted-foreground">
              Receive your tickets by email, add them to your digital wallet, and enjoy your experience.
            </p>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="container-narrow py-16">
        <Newsletter />
      </section>
      
      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary py-16 text-white overflow-hidden">
        <Particles count={20} className="opacity-20" />
        <div className="container-narrow text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Event?</h2>
          <p className="text-xl mb-8 text-white/80">
            Join thousands of attendees discovering and booking amazing events every day.
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-glow-secondary">
            <Link to="/events">Explore Events</Link>
          </Button>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </section>
    </MainLayout>
  )
}

// Category mock data
const categories = [
  {
    name: "Concerts",
    href: "/category/concerts",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Conferences",
    href: "/category/conferences",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Workshops",
    href: "/category/workshops",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Sports",
    href: "/category/sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop"
  }
];

export default Index
