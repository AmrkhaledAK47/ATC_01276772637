
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

// Mock data - using same data as Index page for consistency
const allEvents = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join industry leaders for insights on emerging technologies",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 15-17, 2025",
    location: "Convention Center, New York",
    price: "$199",
    category: "conference"
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "Three days of amazing performances across 5 stages",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    date: "Jul 8-10, 2025",
    location: "Central Park, New York",
    price: "$89",
    category: "festival"
  },
  {
    id: "3",
    title: "Design Workshop Series",
    description: "Interactive workshops on UI/UX design principles",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
    date: "May 22, 2025",
    location: "Design Hub, Boston",
    price: "$49",
    category: "workshop"
  },
  {
    id: "4",
    title: "Art Exhibition: Future Perspectives",
    description: "Contemporary art exploring themes of technology and nature",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 1-30, 2025",
    location: "Modern Art Gallery, Chicago",
    price: "Free",
    category: "exhibition"
  },
  {
    id: "5",
    title: "Blockchain & AI Summit",
    description: "Exploring the intersection of blockchain and artificial intelligence",
    image: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop",
    date: "May 28, 2025",
    location: "Tech Center, San Francisco",
    price: "$149",
    category: "conference"
  },
  {
    id: "6",
    title: "Indie Film Festival",
    description: "Showcasing independent films from around the world",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069&auto=format&fit=crop",
    date: "Aug 5-12, 2025",
    location: "Cinema Arts Center, Los Angeles",
    price: "$35",
    category: "festival"
  },
  {
    id: "7",
    title: "Jazz Night Under The Stars",
    description: "An evening of classic and contemporary jazz",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 30, 2025",
    location: "Riverside Park, Chicago",
    price: "$25",
    category: "concert"
  },
  {
    id: "8",
    title: "Marathon for Charity",
    description: "Annual charity run supporting education initiatives",
    image: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?q=80&w=2079&auto=format&fit=crop",
    date: "Apr 10, 2025",
    location: "City Park, Boston",
    price: "$15",
    category: "sports"
  }
];

const categories = {
  "conference": { name: "Conferences", description: "Professional gatherings focused on specific industries or topics" },
  "workshop": { name: "Workshops", description: "Hands-on learning and skill-building sessions" },
  "festival": { name: "Festivals", description: "Celebrations of music, art, culture, and more" },
  "exhibition": { name: "Exhibitions", description: "Showcases of art, science, history, and other collections" },
  "concert": { name: "Concerts", description: "Live musical performances across all genres" },
  "sports": { name: "Sports", description: "Athletic competitions and sporting events" },
};

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [events, setEvents] = useState<typeof allEvents>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      if (categoryName) {
        const filteredEvents = allEvents.filter(
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
                date={event.date}
                location={event.location}
                price={event.price}
                category={event.category}
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
