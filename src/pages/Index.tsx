
import React from "react"
import { Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/events/event-card"
import { SearchFilters } from "@/components/events/search-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { ArrowRight } from "lucide-react"

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 py-16 md:py-24 lg:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h1 className="mb-4 animate-fade-in">
              Discover Amazing Events Near You
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Browse and book tickets to conferences, concerts, workshops, and more events happening in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
              <Button size="lg" asChild>
                <Link to="/events">Browse Events</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/create">Host an Event</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5" />
      </section>
      
      {/* Search Section */}
      <section className="container-wide py-8">
        <h2 className="text-2xl font-bold mb-4">Find Your Next Experience</h2>
        <SearchFilters />
      </section>
      
      {/* Featured Events */}
      <section className="container-wide section-padding">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-primary flex items-center hover:underline">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="weekend">This Weekend</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="today" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredEvents.slice(0, 2).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weekend" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredEvents.slice(1, 4).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredEvents.slice(2, 6).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Categories Section */}
      <section className="bg-muted py-16">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.href} 
                className="relative overflow-hidden rounded-lg aspect-square bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="container-wide section-padding">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-heading font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Find Events</h3>
            <p className="text-muted-foreground">
              Browse through our extensive collection of events or use the search filters to find exactly what you're looking for.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-heading font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Book Tickets</h3>
            <p className="text-muted-foreground">
              Select your preferred event and complete the booking process securely within minutes.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-heading font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Enjoy the Event</h3>
            <p className="text-muted-foreground">
              Receive your tickets by email, add them to your digital wallet, and enjoy your experience.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16 text-white">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Host Your Own Event?</h2>
          <p className="text-xl mb-8 text-white/80">
            Create and manage your events with our easy-to-use platform. Reach more people and boost your ticket sales.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/create">Create an Event</Link>
          </Button>
        </div>
      </section>
      
    </MainLayout>
  )
}

// Mock data for featured events
const featuredEvents = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join the biggest tech conference in the city with renowned speakers and networking opportunities.",
    category: "Conference",
    date: new Date(2025, 5, 15),
    time: "9:00 AM - 5:00 PM",
    venue: "Downtown Convention Center",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "A weekend of amazing performances by top artists across multiple genres.",
    category: "Concert",
    date: new Date(2025, 7, 5),
    time: "12:00 PM - 11:00 PM",
    venue: "Riverside Park",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    status: "few-tickets",
  },
  {
    id: "3",
    title: "Digital Marketing Workshop",
    description: "Learn the latest strategies and tools to level up your marketing skills.",
    category: "Workshop",
    date: new Date(2025, 4, 22),
    time: "10:00 AM - 3:00 PM",
    venue: "Business Hub",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "4",
    title: "Charity Run for Education",
    description: "5k and 10k runs to raise funds for underprivileged children's education.",
    category: "Sports",
    date: new Date(2025, 3, 10),
    time: "7:00 AM",
    venue: "City Park",
    price: 25,
    imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "5",
    title: "Art Exhibition: Future Perspectives",
    description: "Showcasing works by emerging artists exploring themes of technology and humanity.",
    category: "Exhibition",
    date: new Date(2025, 5, 1),
    time: "10:00 AM - 6:00 PM",
    venue: "Modern Art Gallery",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    status: "free",
  },
  {
    id: "6",
    title: "Comedy Night",
    description: "An evening of laughter with the city's best stand-up comedians.",
    category: "Entertainment",
    date: new Date(2025, 2, 25),
    time: "8:00 PM",
    venue: "Laugh Factory",
    price: 35,
    imageUrl: "https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop",
    status: "sold-out",
  },
];

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
