import React, { useState } from "react"
import { Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/events/event-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { CalendarDays, Clock, MapPin, Star, Ticket, Heart, Search } from "lucide-react"

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    joinedDate: new Date(2023, 5, 15),
    upcomingEvents: 3,
    pastEvents: 8,
    savedEvents: 5,
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        {/* User Profile Section */}
        <div className="flex flex-col md:flex-row items-start mb-12 gap-6">
          <div className="w-full md:w-1/4">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {format(user.joinedDate, "MMMM yyyy")}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="w-full md:w-3/4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Upcoming Events</p>
                    <h3 className="text-2xl font-bold">{user.upcomingEvents}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4">
                    <Ticket className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Past Events</p>
                    <h3 className="text-2xl font-bold">{user.pastEvents}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="bg-accent/10 p-3 rounded-full mr-4">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Saved Events</p>
                    <h3 className="text-2xl font-bold">{user.savedEvents}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Events Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-card/50 backdrop-blur">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
                <TabsTrigger value="saved">Saved Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-6">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(booking => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto relative">
                            <img 
                              src={booking.event.imageUrl} 
                              alt={booking.event.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-3/4 flex flex-col">
                            <div className="flex-1">
                              <Link to={`/events/${booking.event.id}`} className="hover:underline">
                                <h3 className="text-xl font-bold mb-2">{booking.event.name}</h3>
                              </Link>
                              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1" />
                                  {format(booking.event.date, "EEEE, MMMM dd, yyyy")}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {booking.event.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.event.venue}
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-4">Booking #{booking.id}</p>
                              <p className="mb-4">
                                <span className="font-semibold">Tickets:</span> {booking.ticketCount}
                                {booking.ticketCount > 1 ? " tickets" : " ticket"}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button asChild size="sm">
                                <Link to={`/booking/confirmation/${booking.id}`}>
                                  View Ticket
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                Add to Calendar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <Ticket className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
                      <p className="text-muted-foreground mb-6">
                        You don't have any upcoming event bookings.
                      </p>
                      <Button asChild>
                        <Link to="/events">
                          <Search className="h-4 w-4 mr-2" /> Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="space-y-6">
                  {pastEvents.length > 0 ? (
                    pastEvents.map(booking => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto relative">
                            <img 
                              src={booking.event.imageUrl} 
                              alt={booking.event.name}
                              className="w-full h-full object-cover grayscale opacity-80"
                            />
                          </div>
                          <div className="p-6 md:w-3/4 flex flex-col">
                            <div className="flex-1">
                              <Link to={`/events/${booking.event.id}`} className="hover:underline">
                                <h3 className="text-xl font-bold mb-2">{booking.event.name}</h3>
                              </Link>
                              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1" />
                                  {format(booking.event.date, "EEEE, MMMM dd, yyyy")}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {booking.event.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.event.venue}
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-4">Booking #{booking.id}</p>
                              <p className="mb-4">
                                <span className="font-semibold">Tickets:</span> {booking.ticketCount}
                                {booking.ticketCount > 1 ? " tickets" : " ticket"}
                              </p>
                            </div>
                            
                            {!booking.rated ? (
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium mr-2">Rate this event:</p>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Button 
                                    key={star} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-1 h-auto"
                                  >
                                    <Star className="h-5 w-5 text-muted-foreground hover:text-yellow-400" />
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <p className="text-sm font-medium mr-2">Your rating:</p>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${
                                        i < booking.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <Ticket className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Past Events</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't attended any events yet.
                      </p>
                      <Button asChild>
                        <Link to="/events">
                          <Search className="h-4 w-4 mr-2" /> Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="saved">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedEvents.length > 0 ? (
                    savedEvents.map(event => (
                      <EventCard key={event.id} {...event} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <Heart className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Saved Events</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't saved any events yet.
                      </p>
                      <Button asChild>
                        <Link to="/events">
                          <Search className="h-4 w-4 mr-2" /> Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// Mock data
const upcomingEvents = [
  {
    id: "B12345",
    event: {
      id: "1",
      name: "Tech Conference 2025",
      date: new Date(2025, 5, 15),
      time: "9:00 AM - 5:00 PM",
      venue: "Downtown Convention Center",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    },
    ticketCount: 1,
  },
  {
    id: "B12346",
    event: {
      id: "2",
      name: "Summer Music Festival",
      date: new Date(2025, 7, 5),
      time: "12:00 PM - 11:00 PM",
      venue: "Riverside Park",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    },
    ticketCount: 2,
  },
  {
    id: "B12347",
    event: {
      id: "3",
      name: "Digital Marketing Workshop",
      date: new Date(2025, 4, 22),
      time: "10:00 AM - 3:00 PM",
      venue: "Business Hub",
      imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
    },
    ticketCount: 1,
  },
]

const pastEvents = [
  {
    id: "B12340",
    event: {
      id: "5",
      name: "Art Exhibition: Future Perspectives",
      date: new Date(2024, 2, 1),
      time: "10:00 AM - 6:00 PM",
      venue: "Modern Art Gallery",
      imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    },
    ticketCount: 1,
    rated: true,
    rating: 4,
  },
  {
    id: "B12341",
    event: {
      id: "6",
      name: "Comedy Night",
      date: new Date(2024, 1, 25),
      time: "8:00 PM",
      venue: "Laugh Factory",
      imageUrl: "https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop",
    },
    ticketCount: 2,
    rated: true,
    rating: 5,
  },
  {
    id: "B12342",
    event: {
      id: "4",
      name: "Charity Run for Education",
      date: new Date(2024, 0, 10),
      time: "7:00 AM",
      venue: "City Park",
      imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074&auto=format&fit=crop",
    },
    ticketCount: 1,
    rated: false,
  },
]

const savedEvents = [
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
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop", // Add this line
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
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop", // Add this line
    status: "few-tickets" as const,
  },
]

export default UserDashboard
