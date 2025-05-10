
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/events/event-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"
import { Particles } from "@/components/ui/particles"
import { Newsletter } from "@/components/common/newsletter"
import { FeaturedCarousel } from "@/components/events/featured-carousel" 
import { CategoryFilter } from "@/components/events/category-filter"

// Mock data for featured events
export const featuredEvents = [
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
    status: "available" as const,
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "A weekend of amazing performances by top artists across multiple genres.",
    category: "Music",
    date: new Date(2025, 7, 5),
    time: "12:00 PM - 11:00 PM",
    venue: "Riverside Park",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    status: "few-tickets" as const,
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
    status: "available" as const,
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
    status: "available" as const,
  },
  {
    id: "5",
    title: "Art Exhibition: Future Perspectives",
    description: "Showcasing works by emerging artists exploring themes of technology and humanity.",
    category: "Arts",
    date: new Date(2025, 5, 1),
    time: "10:00 AM - 6:00 PM",
    venue: "Modern Art Gallery",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    status: "free" as const,
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
    status: "sold-out" as const,
  },
  {
    id: "7",
    title: "Charity Gala Dinner",
    description: "An elegant evening to raise funds for local homeless shelters.",
    category: "Charity",
    date: new Date(2025, 6, 12),
    time: "7:00 PM - 11:00 PM",
    venue: "Grand Ballroom",
    price: 150,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    status: "available" as const,
  },
  {
    id: "8",
    title: "Film Festival Opening",
    description: "Opening night of the international film festival with premiere screenings.",
    category: "Entertainment",
    date: new Date(2025, 9, 5),
    time: "6:00 PM - 10:00 PM",
    venue: "Cinema Plaza",
    price: 50,
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    status: "few-tickets" as const,
  },
];

// Category mock data
export const categories = [
  {
    name: "Music",
    href: "/category/music",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Conference",
    href: "/category/conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Workshop",
    href: "/category/workshop",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Sports",
    href: "/category/sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Arts",
    href: "/category/arts",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Charity",
    href: "/category/charity",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
  },
  {
    name: "Entertainment",
    href: "/category/entertainment",
    image: "https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop"
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(featuredEvents);
  const [todayEvents, setTodayEvents] = useState<typeof featuredEvents>([]);
  const [weekendEvents, setWeekendEvents] = useState<typeof featuredEvents>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<typeof featuredEvents>([]);
  const [isScrolling, setIsScrolling] = useState(false);

  // Filter events by selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(featuredEvents);
    } else {
      setFilteredEvents(
        featuredEvents.filter(event => event.category.toLowerCase() === selectedCategory)
      );
    }
  }, [selectedCategory]);

  // Prepare events for different tabs
  useEffect(() => {
    const today = new Date();
    
    // Today's events
    const todayEvts = featuredEvents.filter(event => {
      return event.date.toDateString() === today.toDateString();
    });
    setTodayEvents(todayEvts.length ? todayEvts : featuredEvents.slice(0, 2));
    
    // Weekend events - get events for next weekend
    const dayOfWeek = today.getDay();
    const daysToWeekend = dayOfWeek <= 5 ? 5 - dayOfWeek : 7 - dayOfWeek + 5;
    const nextWeekend = new Date(today);
    nextWeekend.setDate(today.getDate() + daysToWeekend);
    
    const weekendEvts = featuredEvents.filter(event => {
      const eventDate = event.date;
      return eventDate >= today && eventDate <= new Date(nextWeekend.getTime() + 2 * 24 * 60 * 60 * 1000);
    });
    setWeekendEvents(weekendEvts.length ? weekendEvts : featuredEvents.slice(1, 5));
    
    // Upcoming events - next 30 days
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    
    const upcomingEvts = featuredEvents.filter(event => {
      const eventDate = event.date;
      return eventDate > today && eventDate <= nextMonth;
    });
    setUpcomingEvents(upcomingEvts.length ? upcomingEvts : featuredEvents.slice(2, 6));
  }, []);

  // Setup scroll observation for animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MainLayout fullWidth>
      {/* Hero Section - Removed search bar as requested */}
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
                <Link to="/auth">Sign Up Today</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </section>
      
      {/* Category Filter Section - Improved to work with actual categories */}
      <section className="container-wide py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Find Events By Category</h2>
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>
      
      {/* Featured Events - Fixed to properly display events */}
      <section className="container-wide py-16">
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
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="today" className="mt-0">
            <div className="stagger-animate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {todayEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weekend" className="mt-0">
            <div className="stagger-animate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {weekendEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-0">
            <div className="stagger-animate grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Trending Events - Fixed carousel to properly display events */}
      <section className="container-wide py-16 bg-gradient-to-b from-background to-secondary-900/5">
        <h2 className="text-3xl font-bold mb-10 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
            Trending Events
          </span>
        </h2>
        <FeaturedCarousel events={featuredEvents} />
      </section>
      
      {/* Categories Section - Improved to display all categories */}
      <section className="py-16 relative overflow-hidden">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Browse by Category
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-animate">
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
      <section className="container-wide py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-900/10 to-transparent opacity-30"></div>
        
        <h2 className="text-3xl font-bold mb-12 text-center relative z-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 relative z-10 stagger-animate">
          <div className="neumorphic-card p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-glow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-light">
              <span className="text-2xl font-heading font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Find Events</h3>
            <p className="text-muted-foreground">
              Browse through our extensive collection of events or use the categories to find exactly what you're looking for.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Event Journey?</h2>
          <p className="text-xl mb-8 text-white/80">
            Join thousands of event-goers and discover amazing experiences happening near you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="shadow-glow-secondary">
              <Link to="/events">Browse Events</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white/60 hover:bg-white/10">
              <Link to="/auth">Create Account</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </section>
    </MainLayout>
  )
}

export default Index
