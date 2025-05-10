
import { useState, useEffect } from 'react';

// Define event types
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  venue: string;
  price: number;
  imageUrl: string;
  status: "available" | "sold-out" | "few-tickets" | "free";
  createdBy: string; // User ID
  featured?: boolean;
}

// Sample event data
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join the biggest tech conference in the city with renowned speakers and networking opportunities. This event will cover the latest trends in AI, blockchain, and cloud computing. Don't miss this chance to connect with industry leaders and learn about cutting-edge technologies.",
    category: "Conference",
    date: new Date(2025, 5, 15),
    time: "9:00 AM - 5:00 PM",
    venue: "Downtown Convention Center",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    status: "available",
    createdBy: "1", // Admin
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "A weekend of amazing performances by top artists across multiple genres. Enjoy live music, food vendors, and a vibrant atmosphere in our beautiful outdoor venue. Perfect for music lovers of all ages. Bring your friends and family for an unforgettable experience.",
    category: "Music",
    date: new Date(2025, 7, 5),
    time: "12:00 PM - 11:00 PM",
    venue: "Riverside Park",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    status: "few-tickets",
    createdBy: "1", // Admin
    featured: true,
  },
  {
    id: "3",
    title: "Digital Marketing Workshop",
    description: "Learn the latest strategies and tools to level up your marketing skills. This hands-on workshop will cover SEO, social media marketing, content creation, and analytics. Suitable for beginners and intermediate marketers looking to enhance their digital marketing capabilities.",
    category: "Workshop",
    date: new Date(2025, 4, 22),
    time: "10:00 AM - 3:00 PM",
    venue: "Business Hub",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
    status: "available",
    createdBy: "1", // Admin
  },
  {
    id: "4",
    title: "Charity Run for Education",
    description: "5k and 10k runs to raise funds for underprivileged children's education. Join us for this meaningful event that combines fitness with giving back to the community. All proceeds will go directly to providing educational resources for children in need.",
    category: "Sports",
    date: new Date(2025, 3, 10),
    time: "7:00 AM",
    venue: "City Park",
    price: 25,
    imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074&auto=format&fit=crop",
    status: "available",
    createdBy: "1", // Admin
    featured: true,
  },
  {
    id: "5",
    title: "Art Exhibition: Future Perspectives",
    description: "Showcasing works by emerging artists exploring themes of technology and humanity. Experience thought-provoking art that challenges our understanding of the future. The exhibition features paintings, sculptures, digital art, and interactive installations from talented artists around the world.",
    category: "Arts",
    date: new Date(2025, 5, 1),
    time: "10:00 AM - 6:00 PM",
    venue: "Modern Art Gallery",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    status: "free",
    createdBy: "1", // Admin
  },
  {
    id: "6",
    title: "Comedy Night",
    description: "An evening of laughter with the city's best stand-up comedians. Get ready for a night filled with humor, entertainment, and good vibes. Our lineup features both established comedians and rising stars who will keep you laughing all night long.",
    category: "Entertainment",
    date: new Date(2025, 2, 25),
    time: "8:00 PM",
    venue: "Laugh Factory",
    price: 35,
    imageUrl: "https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop",
    status: "sold-out",
    createdBy: "1", // Admin
  },
  {
    id: "7",
    title: "Charity Gala Dinner",
    description: "An elegant evening to raise funds for local homeless shelters. Join us for a night of fine dining, entertainment, and charity auctions. Your participation will directly contribute to providing shelter, food, and essential services to those experiencing homelessness in our community.",
    category: "Charity",
    date: new Date(2025, 6, 12),
    time: "7:00 PM - 11:00 PM",
    venue: "Grand Ballroom",
    price: 150,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    status: "available",
    createdBy: "1", // Admin
    featured: true,
  },
  {
    id: "8",
    title: "Film Festival Opening",
    description: "Opening night of the international film festival with premiere screenings. Be among the first to watch award-winning films from around the world and meet filmmakers, actors, and industry professionals. The evening includes red carpet events, screenings, and after-parties.",
    category: "Entertainment",
    date: new Date(2025, 9, 5),
    time: "6:00 PM - 10:00 PM",
    venue: "Cinema Plaza",
    price: 50,
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    status: "few-tickets",
    createdBy: "1", // Admin
  },
];

let eventsData = [...sampleEvents];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events on mount
  useEffect(() => {
    // Simulate API call
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch events');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get a single event by ID
  const getEvent = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  // Add a new event
  const addEvent = (event: Omit<Event, "id" | "createdBy">, userId: string) => {
    const newEvent: Event = {
      ...event,
      id: `${eventsData.length + 1}`,
      createdBy: userId,
    };
    
    eventsData = [...eventsData, newEvent];
    setEvents(eventsData);
    return newEvent;
  };

  // Update an existing event
  const updateEvent = (id: string, eventData: Partial<Omit<Event, "id" | "createdBy">>) => {
    const eventIndex = eventsData.findIndex(event => event.id === id);
    
    if (eventIndex !== -1) {
      eventsData[eventIndex] = {
        ...eventsData[eventIndex],
        ...eventData,
      };
      
      setEvents([...eventsData]);
      return eventsData[eventIndex];
    }
    
    return null;
  };

  // Delete an event
  const deleteEvent = (id: string) => {
    eventsData = eventsData.filter(event => event.id !== id);
    setEvents(eventsData);
  };

  // Get featured events
  const getFeaturedEvents = () => {
    return events.filter(event => event.featured);
  };

  return {
    events,
    isLoading,
    error,
    getEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    getFeaturedEvents
  };
};
