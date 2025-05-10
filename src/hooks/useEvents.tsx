
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

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
  featured?: boolean;
  createdBy?: string;
}

interface EventsContextType {
  events: Event[];
  featuredEvents: Event[];
  popularEvents: Event[];
  upcomingEvents: Event[];
  isLoading: boolean;
  error: Error | null;
  getEvent: (id: string) => Event | undefined;
  addEvent: (event: Omit<Event, "id" | "createdBy">) => Promise<Event>;
  updateEvent: (id: string, event: Partial<Omit<Event, "id" | "createdBy">>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<boolean>;
  userBookings: Booking[];
  bookEvent: (eventId: string, quantity: number) => Promise<Booking>;
  isEventBooked: (eventId: string) => boolean;
}

interface Booking {
  id: string;
  eventId: string;
  userId: string;
  quantity: number;
  date: Date;
  status: "confirmed" | "cancelled";
}

// Sample data for our events
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join the biggest tech conference in the city with renowned speakers, workshops, and networking opportunities. Explore the latest trends in AI, blockchain, cloud computing, and more.",
    category: "Conference",
    date: new Date(2025, 5, 15),
    time: "9:00 AM - 5:00 PM",
    venue: "Downtown Convention Center",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    status: "available",
    featured: true
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "A weekend of amazing performances by top artists across multiple genres. Experience 3 days of non-stop music across 5 stages with over 50 performers.",
    category: "Music",
    date: new Date(2025, 7, 5),
    time: "12:00 PM - 11:00 PM",
    venue: "Riverside Park",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    status: "few-tickets",
    featured: true
  },
  {
    id: "3",
    title: "Digital Marketing Workshop",
    description: "Learn the latest strategies and tools to level up your marketing skills. Topics include SEO, social media marketing, content creation, and email campaigns.",
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
    description: "5k and 10k runs to raise funds for underprivileged children's education. Every participant receives a t-shirt and medal, with refreshments provided.",
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
    description: "Showcasing works by emerging artists exploring themes of technology and humanity. Features interactive installations, paintings, sculptures, and digital art.",
    category: "Arts",
    date: new Date(2025, 5, 1),
    time: "10:00 AM - 6:00 PM",
    venue: "Modern Art Gallery",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    status: "free",
    featured: true
  },
  {
    id: "6",
    title: "Comedy Night",
    description: "An evening of laughter with the city's best stand-up comedians. Five performers will take the stage for a night of hilarious entertainment.",
    category: "Entertainment",
    date: new Date(2025, 2, 25),
    time: "8:00 PM",
    venue: "Laugh Factory",
    price: 35,
    imageUrl: "https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop",
    status: "sold-out",
  },
  {
    id: "7",
    title: "Charity Gala Dinner",
    description: "An elegant evening to raise funds for local homeless shelters. Includes a three-course meal, live music, and a charity auction.",
    category: "Charity",
    date: new Date(2025, 6, 12),
    time: "7:00 PM - 11:00 PM",
    venue: "Grand Ballroom",
    price: 150,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    status: "available",
    featured: true
  },
  {
    id: "8",
    title: "Film Festival Opening",
    description: "Opening night of the international film festival with premiere screenings. Red carpet event featuring directors, actors, and film industry professionals.",
    category: "Entertainment",
    date: new Date(2025, 9, 5),
    time: "6:00 PM - 10:00 PM",
    venue: "Cinema Plaza",
    price: 50,
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    status: "few-tickets",
    featured: true
  },
  {
    id: "9",
    title: "Science and Technology Expo",
    description: "Explore the latest innovations and scientific discoveries at this interactive expo. Features demonstrations, talks, and hands-on experiments for all ages.",
    category: "Expo",
    date: new Date(2025, 4, 8),
    time: "10:00 AM - 8:00 PM",
    venue: "Science Museum",
    price: 15,
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "10",
    title: "Food and Wine Festival",
    description: "A culinary journey featuring local restaurants, wineries, and food artisans. Sample dishes and drinks from over 40 vendors while enjoying live music.",
    category: "Food",
    date: new Date(2025, 8, 18),
    time: "11:00 AM - 10:00 PM",
    venue: "City Square",
    price: 65,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
    status: "available",
    featured: true
  },
  {
    id: "11",
    title: "Wellness Retreat",
    description: "A weekend of relaxation, yoga, meditation, and healthy living workshops. Includes accommodation, meals, and all activities for a rejuvenating experience.",
    category: "Health",
    date: new Date(2025, 7, 22),
    time: "All Day",
    venue: "Mountain Resort",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "12",
    title: "Business Leadership Summit",
    description: "Connect with industry leaders and learn cutting-edge business strategies. Features keynote speeches, panel discussions, and networking opportunities.",
    category: "Business",
    date: new Date(2025, 6, 30),
    time: "9:00 AM - 6:00 PM",
    venue: "Business Center",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=2071&auto=format&fit=crop",
    status: "few-tickets",
  }
];

// Sample bookings data
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    eventId: "2",
    userId: "2",
    quantity: 2,
    date: new Date(),
    status: "confirmed"
  }
];

export function useEvents(): EventsContextType {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate fetching events from an API
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get events from local storage or use mock data
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          // Convert date strings back to Date objects
          const eventsWithDates = parsedEvents.map((event: any) => ({
            ...event,
            date: new Date(event.date)
          }));
          setEvents(eventsWithDates);
        } else {
          setEvents(MOCK_EVENTS);
        }

        // Get bookings from local storage or use mock data
        const storedBookings = localStorage.getItem('bookings');
        if (storedBookings) {
          const parsedBookings = JSON.parse(storedBookings);
          // Convert date strings back to Date objects
          const bookingsWithDates = parsedBookings.map((booking: any) => ({
            ...booking,
            date: new Date(booking.date)
          }));
          setUserBookings(bookingsWithDates);
        } else {
          setUserBookings(INITIAL_BOOKINGS);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEvent = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const addEvent = useCallback(async (eventData: Omit<Event, "id" | "createdBy">) => {
    try {
      const newEvent: Event = {
        ...eventData,
        id: `event_${Date.now()}`,
        createdBy: user?.id || 'system'
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      
      // Persist to localStorage
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      return newEvent;
    } catch (err) {
      throw err;
    }
  }, [events, user]);

  const updateEvent = useCallback(async (id: string, eventData: Partial<Omit<Event, "id" | "createdBy">>) => {
    try {
      const eventIndex = events.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }

      const updatedEvent: Event = {
        ...events[eventIndex],
        ...eventData,
      };

      const updatedEvents = [
        ...events.slice(0, eventIndex),
        updatedEvent,
        ...events.slice(eventIndex + 1)
      ];

      setEvents(updatedEvents);
      
      // Persist to localStorage
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      return updatedEvent;
    } catch (err) {
      throw err;
    }
  }, [events]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      
      // Persist to localStorage
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      return true;
    } catch (err) {
      return false;
    }
  }, [events]);

  const isEventBooked = useCallback((eventId: string) => {
    return userBookings.some(booking => 
      booking.eventId === eventId && 
      booking.userId === user?.id &&
      booking.status === 'confirmed'
    );
  }, [userBookings, user]);

  const bookEvent = useCallback(async (eventId: string, quantity: number): Promise<Booking> => {
    if (!user) {
      throw new Error('You must be logged in to book an event');
    }

    try {
      const newBooking: Booking = {
        id: `booking_${Date.now()}`,
        eventId,
        userId: user.id,
        quantity,
        date: new Date(),
        status: 'confirmed'
      };

      const updatedBookings = [...userBookings, newBooking];
      setUserBookings(updatedBookings);
      
      // Persist to localStorage
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      
      return newBooking;
    } catch (err) {
      throw err;
    }
  }, [userBookings, user]);

  // Derived data
  const featuredEvents = events.filter(event => event.featured);
  const popularEvents = [...events].sort(() => Math.random() - 0.5).slice(0, 6);
  const upcomingEvents = [...events]
    .filter(event => event.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);

  return {
    events,
    featuredEvents,
    popularEvents,
    upcomingEvents,
    isLoading,
    error,
    getEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    userBookings,
    bookEvent,
    isEventBooked
  };
}
