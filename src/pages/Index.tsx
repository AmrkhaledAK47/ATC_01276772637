
import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/events/featured-carousel";
import { EventCard } from "@/components/events/event-card";
import { Newsletter } from "@/components/common/newsletter";
import { Particles } from "@/components/ui/particles";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEvents } from "@/context/EventContext";

// Export the featured events from the context so they can be used elsewhere
export const Index = () => {
  const { featuredEvents } = useEvents();

  return (
    <MainLayout fullWidth>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 z-0" />
        <Particles className="absolute inset-0" quantity={200} />
        
        <div className="container relative z-10 space-y-8 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 pb-2 max-w-3xl mx-auto">
              Discover Extraordinary Event Experiences
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find and book incredible events in your city with just a few clicks
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button asChild size="lg" className="text-base px-8">
              <Link to="/events">
                Explore Events
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-8">
              <Link to="/auth">
                Sign Up
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute -bottom-10 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </section>
      
      {/* Featured Events */}
      <section className="bg-background py-20 px-4">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Events</h2>
              <p className="text-muted-foreground mt-2">Discover our top picks for you</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link to="/events">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <FeaturedCarousel events={featuredEvents} />
          
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Event Categories */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/90">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground mt-2">
              Find events that match your interests
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Music", icon: "🎵", color: "from-purple-500 to-blue-600" },
              { name: "Sports", icon: "⚽", color: "from-green-500 to-emerald-700" },
              { name: "Arts", icon: "🎨", color: "from-orange-500 to-amber-700" },
              { name: "Business", icon: "💼", color: "from-blue-500 to-cyan-700" },
              { name: "Food", icon: "🍕", color: "from-red-500 to-rose-700" },
              { name: "Technology", icon: "💻", color: "from-indigo-500 to-violet-700" },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/events?category=${category.name.toLowerCase()}`}
                  className="block group"
                >
                  <div className={`aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${category.color} p-6 flex flex-col items-center justify-center transition-transform group-hover:scale-[1.03]`}>
                    <span className="text-4xl mb-2">{category.icon}</span>
                    <span className="font-medium text-white">{category.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <p className="text-muted-foreground mt-2">Don't miss out on these events</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link to="/events">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredEvents.slice(0, 4).map((event) => (
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
          
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link to="/events">
                Browse All Events
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <span className="inline-block p-2 bg-primary/20 text-primary rounded-full">
                <Calendar className="h-6 w-6" />
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Host Your Own Event?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create and manage your events with our easy-to-use platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/auth?tab=register">
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/admin">
                  View Admin Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
    </MainLayout>
  );
};

export default Index;
