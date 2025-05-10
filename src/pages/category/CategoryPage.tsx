
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { EventCard } from "@/components/events/event-card";
import { SearchFilters } from "@/components/events/search-filters";
import { featuredEvents, categories } from "@/pages/Index";
import { EmptyState } from "@/components/ui/empty-state";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [events, setEvents] = useState([...featuredEvents]);
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("");
  
  useEffect(() => {
    // Find the current category from our categories list
    const currentCategory = categories.find(
      cat => cat.name.toLowerCase() === categoryName?.toLowerCase()
    );
    
    setCategoryTitle(currentCategory?.name || categoryName || "");
    
    // Filter events by category
    const filtered = featuredEvents.filter(
      event => event.category.toLowerCase() === categoryName?.toLowerCase()
    );
    
    setEvents(filtered);
    setLoading(false);
  }, [categoryName]);

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{categoryTitle} Events</h1>
        <div className="mb-8">
          <SearchFilters />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
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
