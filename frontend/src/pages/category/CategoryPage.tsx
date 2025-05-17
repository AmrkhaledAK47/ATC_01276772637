import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { EventCard } from "@/components/events/event-card";
import { SearchFilters } from "@/components/events/search-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { EventsService } from "@/services/events.service";
import { Event } from "@/types";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch all events and then filter by category name
        const allEvents = await EventsService.getEvents();
        const filtered = allEvents.filter(
          event => event.category?.name.toLowerCase() === categoryName?.toLowerCase()
        );
        setEvents(filtered);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryName]);

  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : '';

  return (
    <MainLayout>
      <div className="container-wide py-8">
        <h1 className="text-3xl font-bold mb-6">{formattedCategoryName} Events</h1>
        <div className="mb-8">
          <SearchFilters />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse"></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((event) => (
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
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No events found"
            description="There are currently no events in this category. Check back later or browse other categories."
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
