
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

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
  createdBy: string;
  featured?: boolean;
}

interface BookingType {
  id: string;
  eventId: string;
  userId: string;
  date: Date;
  quantity: number;
  status: "confirmed" | "cancelled";
}

interface EventContextType {
  events: Event[];
  featuredEvents: Event[];
  bookings: BookingType[];
  isLoading: boolean;
  addEvent: (event: Omit<Event, "id" | "createdBy">) => void;
  updateEvent: (id: string, event: Partial<Omit<Event, "id" | "createdBy">>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => Event | undefined;
  bookEvent: (eventId: string, quantity?: number) => Promise<BookingType | undefined>;
  hasUserBookedEvent: (eventId: string) => boolean;
  getUserBookings: () => BookingType[];
}

// Generate a list of sample events
const generateSampleEvents = (): Event[] => {
  return [
    {
      id: "1",
      title: "Tech Conference 2025",
      description: "Join the biggest tech conference in the city with renowned speakers and networking opportunities. Learn about the latest trends in AI, blockchain, and cloud computing.",
      category: "Conference",
      date: new Date(2025, 5, 15),
      time: "9:00 AM - 5:00 PM",
      venue: "Downtown Convention Center",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      status: "available",
      createdBy: "1", // Admin user id
      featured: true
    },
    {
      id: "2",
      title: "Summer Music Festival",
      description: "A weekend of amazing performances by top artists across multiple genres. Enjoy great food, drinks, and an unforgettable atmosphere in the heart of the city.",
      category: "Music",
      date: new Date(2025, 7, 5),
      time: "12:00 PM - 11:00 PM",
      venue: "Riverside Park",
      price: 89,
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
      status: "few-tickets",
      createdBy: "1", // Admin user id
      featured: true
    },
    {
      id: "3",
      title: "Digital Marketing Workshop",
      description: "Hands-on workshop teaching the latest digital marketing strategies. Learn SEO, social media marketing, and content creation from industry experts.",
      category: "Workshop",
      date: new Date(2025, 4, 22),
      time: "10:00 AM - 3:00 PM",
      venue: "Business Hub",
      price: 49,
      imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2070&auto=format&fit=crop",
      status: "available",
      createdBy: "1", // Admin user id
    },
    {
      id: "4",
      title: "Charity Run for Education",
      description: "Join us for a 5K run to raise funds for local education programs. All proceeds go to providing resources for underprivileged schools in the community.",
      category: "Sports",
      date: new Date(2025, 3, 10),
      time: "7:00 AM",
      venue: "City Park",
      price: 25,
      imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop",
      status: "available",
      createdBy: "1", // Admin user id
    },
    {
      id: "5",
      title: "Art Exhibition: Future Perspectives",
      description: "Explore works from emerging artists that challenge our perception of the future. Interactive installations, paintings, and digital art exploring technology and society.",
      category: "Arts",
      date: new Date(2025, 5, 1),
      time: "10:00 AM - 6:00 PM",
      venue: "Modern Art Gallery",
      price: 0,
      imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
      status: "free",
      createdBy: "1", // Admin user id
      featured: true
    },
    {
      id: "6",
      title: "Comedy Night",
      description: "An evening of laughter with top stand-up comedians. Featuring both established names and rising stars in the comedy scene.",
      category: "Entertainment",
      date: new Date(2025, 2, 25),
      time: "8:00 PM",
      venue: "Laugh Factory",
      price: 35,
      imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2071&auto=format&fit=crop",
      status: "sold-out",
      createdBy: "1", // Admin user id
    },
    {
      id: "7",
      title: "Charity Gala Dinner",
      description: "An elegant evening of dining and fundraising for local charities. Featuring a silent auction, live music, and gourmet cuisine.",
      category: "Charity",
      date: new Date(2025, 6, 12),
      time: "7:00 PM - 11:00 PM",
      venue: "Grand Ballroom",
      price: 150,
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
      status: "available",
      createdBy: "1", // Admin user id
      featured: true
    },
    {
      id: "8",
      title: "Film Festival Opening",
      description: "Opening night of the international film festival featuring an award-winning documentary and Q&A with the director.",
      category: "Entertainment",
      date: new Date(2025, 9, 5),
      time: "6:00 PM - 10:00 PM",
      venue: "Cinema Plaza",
      price: 50,
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
      status: "available",
      createdBy: "1", // Admin user id
    },
  ];
};

// Generate sample bookings
const generateSampleBookings = (): BookingType[] => {
  return [
    {
      id: "booking-1",
      eventId: "2", // Summer Music Festival
      userId: "2", // Regular user
      date: new Date(),
      quantity: 2,
      status: "confirmed"
    },
    {
      id: "booking-2",
      eventId: "5", // Art Exhibition
      userId: "2", // Regular user
      date: new Date(),
      quantity: 1,
      status: "confirmed"
    }
  ];
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load events and bookings from localStorage or use sample data
    const storedEvents = localStorage.getItem("eventHubEvents");
    const storedBookings = localStorage.getItem("eventHubBookings");
    
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })));
      } catch (error) {
        const sampleEvents = generateSampleEvents();
        setEvents(sampleEvents);
        localStorage.setItem("eventHubEvents", JSON.stringify(sampleEvents));
      }
    } else {
      const sampleEvents = generateSampleEvents();
      setEvents(sampleEvents);
      localStorage.setItem("eventHubEvents", JSON.stringify(sampleEvents));
    }
    
    if (storedBookings) {
      try {
        const parsedBookings = JSON.parse(storedBookings);
        setBookings(parsedBookings.map((booking: any) => ({
          ...booking,
          date: new Date(booking.date)
        })));
      } catch (error) {
        const sampleBookings = generateSampleBookings();
        setBookings(sampleBookings);
        localStorage.setItem("eventHubBookings", JSON.stringify(sampleBookings));
      }
    } else {
      const sampleBookings = generateSampleBookings();
      setBookings(sampleBookings);
      localStorage.setItem("eventHubBookings", JSON.stringify(sampleBookings));
    }
    
    setIsLoading(false);
  }, []);

  // Save events and bookings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("eventHubEvents", JSON.stringify(events));
      localStorage.setItem("eventHubBookings", JSON.stringify(bookings));
    }
  }, [events, bookings, isLoading]);

  const addEvent = (event: Omit<Event, "id" | "createdBy">) => {
    if (!user) return;
    
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      createdBy: user.id,
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    toast({
      title: "Event created",
      description: `"${event.title}" has been successfully created.`,
    });
  };

  const updateEvent = (id: string, eventUpdate: Partial<Omit<Event, "id" | "createdBy">>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...eventUpdate } : event
      )
    );
    
    toast({
      title: "Event updated",
      description: "The event has been successfully updated.",
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    
    // Also delete any bookings for this event
    setBookings(prev => prev.filter(booking => booking.eventId !== id));
    
    toast({
      title: "Event deleted",
      description: "The event has been successfully removed.",
    });
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  const bookEvent = async (eventId: string, quantity = 1): Promise<BookingType | undefined> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to book events.",
      });
      return;
    }

    const event = getEvent(eventId);
    if (!event) {
      toast({
        variant: "destructive",
        title: "Event not found",
        description: "The event you're trying to book was not found.",
      });
      return;
    }

    if (event.status === "sold-out") {
      toast({
        variant: "destructive",
        title: "Event sold out",
        description: "Sorry, this event is sold out.",
      });
      return;
    }

    // Create new booking
    const newBooking: BookingType = {
      id: `booking-${Date.now()}`,
      eventId,
      userId: user.id,
      date: new Date(),
      quantity,
      status: "confirmed",
    };

    setBookings(prev => [...prev, newBooking]);

    // Update event status if limited tickets
    if (event.status === "few-tickets") {
      updateEvent(eventId, { status: "sold-out" });
    }

    toast({
      title: "Booking confirmed!",
      description: `You have successfully booked "${event.title}".`,
    });

    return newBooking;
  };

  const hasUserBookedEvent = (eventId: string) => {
    if (!user) return false;
    return bookings.some(booking => 
      booking.eventId === eventId && 
      booking.userId === user.id &&
      booking.status === "confirmed"
    );
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter(booking => booking.userId === user.id);
  };

  return (
    <EventContext.Provider value={{
      events,
      featuredEvents: events.filter(event => event.featured),
      bookings,
      isLoading,
      addEvent,
      updateEvent,
      deleteEvent,
      getEvent,
      bookEvent,
      hasUserBookedEvent,
      getUserBookings,
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
