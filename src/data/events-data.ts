
export interface EventData {
  id: string;
  title: string;
  description: string;
  image: string;
  imageUrl: string;
  date: Date;
  time: string;
  location: string;
  venue: string;
  price: number;
  category: string;
  status?: "available" | "sold-out" | "few-tickets" | "free";
  attendees?: number;
}

// Convert string date formats to Date objects
const createDate = (dateString: string): Date => {
  const date = new Date(dateString);
  return date;
};

export const featuredEvents: EventData[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join industry leaders for insights on emerging technologies",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop",
    date: createDate("2025-06-15"),
    time: "09:00 AM - 05:00 PM",
    location: "New York",
    venue: "Convention Center, New York",
    price: 199,
    category: "conference",
    status: "available",
    attendees: 1200
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "Three days of amazing performances across 5 stages",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    date: createDate("2025-07-08"),
    time: "12:00 PM - 11:00 PM",
    location: "New York",
    venue: "Central Park, New York",
    price: 89,
    category: "festival",
    status: "few-tickets",
    attendees: 5000
  },
  {
    id: "3",
    title: "Design Workshop Series",
    description: "Interactive workshops on UI/UX design principles",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
    date: createDate("2025-05-22"),
    time: "10:00 AM - 04:00 PM",
    location: "Boston",
    venue: "Design Hub, Boston",
    price: 49,
    category: "workshop",
    status: "available",
    attendees: 75
  },
  {
    id: "4",
    title: "Art Exhibition: Future Perspectives",
    description: "Contemporary art exploring themes of technology and nature",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2070&auto=format&fit=crop",
    date: createDate("2025-06-01"),
    time: "11:00 AM - 07:00 PM",
    location: "Chicago",
    venue: "Modern Art Gallery, Chicago",
    price: 0,
    category: "exhibition",
    status: "free",
    attendees: 450
  },
  {
    id: "5",
    title: "Blockchain & AI Summit",
    description: "Exploring the intersection of blockchain and artificial intelligence",
    image: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop",
    date: createDate("2025-05-28"),
    time: "09:00 AM - 06:00 PM",
    location: "San Francisco",
    venue: "Tech Center, San Francisco",
    price: 149,
    category: "conference",
    status: "available",
    attendees: 800
  },
  {
    id: "6",
    title: "Indie Film Festival",
    description: "Showcasing independent films from around the world",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069&auto=format&fit=crop",
    date: createDate("2025-08-05"),
    time: "03:00 PM - 11:00 PM",
    location: "Los Angeles",
    venue: "Cinema Arts Center, Los Angeles",
    price: 35,
    category: "festival",
    status: "few-tickets",
    attendees: 1200
  },
  {
    id: "7",
    title: "Jazz Night Under The Stars",
    description: "An evening of classic and contemporary jazz",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop",
    date: createDate("2025-06-30"),
    time: "07:00 PM - 11:00 PM",
    location: "Chicago",
    venue: "Riverside Park, Chicago",
    price: 25,
    category: "concert",
    status: "available",
    attendees: 350
  },
  {
    id: "8",
    title: "Marathon for Charity",
    description: "Annual charity run supporting education initiatives",
    image: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?q=80&w=2079&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?q=80&w=2079&auto=format&fit=crop",
    date: createDate("2025-04-10"),
    time: "08:00 AM - 12:00 PM",
    location: "Boston",
    venue: "City Park, Boston",
    price: 15,
    category: "sports",
    status: "available",
    attendees: 3000
  }
];

export const trendingEvents = [...featuredEvents];

export const categories = {
  "conference": { name: "Conferences", description: "Professional gatherings focused on specific industries or topics" },
  "workshop": { name: "Workshops", description: "Hands-on learning and skill-building sessions" },
  "festival": { name: "Festivals", description: "Celebrations of music, art, culture, and more" },
  "exhibition": { name: "Exhibitions", description: "Showcases of art, science, history, and other collections" },
  "concert": { name: "Concerts", description: "Live musical performances across all genres" },
  "sports": { name: "Sports", description: "Athletic competitions and sporting events" },
};
