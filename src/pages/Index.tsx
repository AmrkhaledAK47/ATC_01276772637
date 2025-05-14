
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/events/event-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"
import { Particles } from "@/components/ui/particles"
import { Newsletter } from "@/components/common/newsletter"
import { CategoryFilter } from "@/components/events/category-filter"

// Mock data
const categories = [
  { id: "all", name: "All Events" },
  { id: "conference", name: "Conferences" },
  { id: "workshop", name: "Workshops" },
  { id: "concert", name: "Concerts" },
  { id: "festival", name: "Festivals" },
  { id: "exhibition", name: "Exhibitions" },
  { id: "sports", name: "Sports" }
];

const featuredEvents = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join industry leaders for insights on emerging technologies",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 15-17, 2025",
    location: "Convention Center, New York",
    price: "$199",
    category: "conference",
    attendees: 1200
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "Three days of amazing performances across 5 stages",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    date: "Jul 8-10, 2025",
    location: "Central Park, New York",
    price: "$89",
    category: "festival",
    attendees: 5000
  },
  {
    id: "3",
    title: "Design Workshop Series",
    description: "Interactive workshops on UI/UX design principles",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
    date: "May 22, 2025",
    location: "Design Hub, Boston",
    price: "$49",
    category: "workshop",
    attendees: 75
  },
  {
    id: "4",
    title: "Art Exhibition: Future Perspectives",
    description: "Contemporary art exploring themes of technology and nature",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 1-30, 2025",
    location: "Modern Art Gallery, Chicago",
    price: "Free",
    category: "exhibition",
    attendees: 450
  }
];

const trendingEvents = [
  {
    id: "5",
    title: "Blockchain & AI Summit",
    description: "Exploring the intersection of blockchain and artificial intelligence",
    image: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop",
    date: "May 28, 2025",
    location: "Tech Center, San Francisco",
    price: "$149",
    category: "conference",
    attendees: 800
  },
  {
    id: "6",
    title: "Indie Film Festival",
    description: "Showcasing independent films from around the world",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069&auto=format&fit=crop",
    date: "Aug 5-12, 2025",
    location: "Cinema Arts Center, Los Angeles",
    price: "$35",
    category: "festival",
    attendees: 1200
  },
  {
    id: "7",
    title: "Jazz Night Under The Stars",
    description: "An evening of classic and contemporary jazz",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 30, 2025",
    location: "Riverside Park, Chicago",
    price: "$25",
    category: "concert",
    attendees: 350
  },
  {
    id: "8",
    title: "Marathon for Charity",
    description: "Annual charity run supporting education initiatives",
    image: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?q=80&w=2079&auto=format&fit=crop",
    date: "Apr 10, 2025",
    location: "City Park, Boston",
    price: "$15",
    category: "sports",
    attendees: 3000
  }
];

const howItWorks = [
  {
    title: "Find Events",
    description: "Browse through our curated list of events or search for specific interests.",
    icon: <Calendar className="h-12 w-12 text-primary" />
  },
  {
    title: "Book Tickets",
    description: "Choose your tickets and complete the secure booking process in minutes.",
    icon: <Users className="h-12 w-12 text-primary" />
  },
  {
    title: "Attend & Enjoy",
    description: "Get your e-tickets via email and enjoy the event hassle-free.",
    icon: <MapPin className="h-12 w-12 text-primary" />
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(featuredEvents);
  
  // Apply category filtering
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(featuredEvents);
    } else {
      const filtered = featuredEvents.filter(
        event => event.category === selectedCategory
      );
      setFilteredEvents(filtered);
    }
  }, [selectedCategory]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background via-primary/5 to-background py-24 md:py-32 overflow-hidden">
        <Particles className="absolute inset-0" quantity={40} />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Discover Amazing Events
              </span>
              <span className="mt-2 block">Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Browse and book tickets to conferences, concerts, workshops, and more events happening in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="px-8">
                <Link to="/events">Browse Events</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Host an Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Filter Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 text-center">Find Events By Category</h2>
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </section>
      
      {/* Featured Events */}
      <section className="py-16 container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Featured Events
            </span>
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/events" className="group">
              View all 
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                image={event.image}
                date={event.date}
                location={event.location}
                price={event.price}
                category={event.category}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No events found in this category.</p>
              <Button 
                variant="link" 
                onClick={() => setSelectedCategory("all")}
                className="mt-2"
              >
                View all categories
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div 
                key={index} 
                className="bg-card border rounded-lg p-8 text-center transition-transform hover:-translate-y-1"
              >
                <div className="mx-auto flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trending Events Tab Section */}
      <section className="py-16 container">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Trending Events
          </span>
        </h2>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
            <TabsTrigger value="new">Newly Added</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingEvents.slice(0, 4).map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  image={event.image}
                  date={event.date}
                  location={event.location}
                  price={event.price}
                  category={event.category}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="popular" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sort events by attendees (most popular) */}
              {[...trendingEvents]
                .sort((a, b) => b.attendees - a.attendees)
                .slice(0, 4)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    image={event.image}
                    date={event.date}
                    location={event.location}
                    price={event.price}
                    category={event.category}
                  />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Reverse the array to simulate "newest" events */}
              {[...trendingEvents].reverse().slice(0, 4).map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  image={event.image}
                  date={event.date}
                  location={event.location}
                  price={event.price}
                  category={event.category}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
    </MainLayout>
  )
}

export default Index
