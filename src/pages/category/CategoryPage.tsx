
import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { featuredEvents, categories } from "@/data/events-data"

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [events, setEvents] = useState<typeof featuredEvents>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      if (categoryName) {
        const filteredEvents = featuredEvents.filter(
          event => event.category.toLowerCase() === categoryName.toLowerCase()
        );
        setEvents(filteredEvents);
      } else {
        setEvents([]);
      }
      setLoading(false);
    }, 500);
  }, [categoryName]);

  const categoryInfo = categoryName ? (categories[categoryName as keyof typeof categories] || { 
    name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), 
    description: "Events in this category" 
  }) : { name: "Category", description: "Events in this category" };

  return (
    <MainLayout>
      <div className="container py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">{categoryInfo.name}</h1>
          <p className="text-lg text-muted-foreground">{categoryInfo.description}</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                image={event.image}
                imageUrl={event.imageUrl}
                date={event.date}
                time={event.time}
                venue={event.venue}
                price={event.price}
                category={event.category}
                status={event.status}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-xl font-medium mb-2">No events found in this category</h3>
            <p className="text-muted-foreground mb-8">Check back later or browse other categories</p>
            <Button asChild>
              <Link to="/events">Browse All Events</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
