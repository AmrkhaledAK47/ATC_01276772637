import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { EventCard } from "@/components/events/event-card";
import { SearchFilters } from "@/components/events/search-filters";
import { CategoryFilter } from "@/components/events/category-filter";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Grid3X3Icon, LayoutListIcon } from "lucide-react";
import { EventsService } from "@/services/events.service";
import { Event } from "@/types";

const EventsDiscovery = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all events on initial load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await EventsService.getEvents();
        setEvents(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  React.useEffect(() => {
    // Apply filters based on search params and selected category
    const category = searchParams.get("category") || selectedCategory;
    setSelectedCategory(category);

    let filtered = [...events];

    // Filter by category if not "all"
    if (category !== "all") {
      filtered = filtered.filter(
        event => event.category?.name.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term if present
    const searchTerm = searchParams.get("q");
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date if present
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const date = new Date(dateParam);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });
    }

    // Filter by price range if present
    const priceRange = searchParams.get("price");
    if (priceRange) {
      switch (priceRange) {
        case "free":
          filtered = filtered.filter(event => event.price === 0);
          break;
        case "1-50":
          filtered = filtered.filter(event => event.price > 0 && event.price <= 50);
          break;
        case "51-100":
          filtered = filtered.filter(event => event.price > 50 && event.price <= 100);
          break;
        case "101-500":
          filtered = filtered.filter(event => event.price > 100 && event.price <= 500);
          break;
        case "500+":
          filtered = filtered.filter(event => event.price > 500);
          break;
      }
    }

    setFilteredEvents(filtered);
  }, [searchParams, selectedCategory, events]);

  const renderEventCards = () => {
    if (isLoading) {
      return (
        <div className={`
          ${view === "grid" ?
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" :
            "flex flex-col gap-6"
          }
        `}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`h-[400px] rounded-lg bg-muted animate-pulse ${view === "list" ? "w-full" : ""}`}></div>
          ))}
        </div>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search filters or browsing all events.
          </p>
          <Button onClick={() => setSelectedCategory("all")}>
            View All Events
          </Button>
        </div>
      );
    }

    return (
      <div className={`
        ${view === "grid" ?
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" :
          "flex flex-col gap-6"
        }
      `}>
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description}
            category={event.category?.name || ""}
            date={new Date(event.date)}
            time={event.time}
            venue={event.location}
            price={event.price}
            imageUrl={event.image}
            status={event.availableSeats === 0 ? "sold-out" :
              event.availableSeats < 10 ? "few-tickets" :
                event.price === 0 ? "free" : "available"}
            className={view === "list" ? "flex flex-col md:flex-row" : ""}
          />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container-wide py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Discover Events</h1>
          <SearchFilters />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid3X3Icon className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
            >
              <LayoutListIcon className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>

        {renderEventCards()}
      </div>
    </MainLayout>
  );
};

export default EventsDiscovery;
