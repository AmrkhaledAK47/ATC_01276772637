
import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { useEvents } from "@/hooks/useEvents";

const NotFound = () => {
  const { events } = useEvents();
  // Get a few random events to display as recommendations
  const randomEvents = [...events]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <MainLayout>
      <div className="container py-16">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-7xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
          <p className="mt-4 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-8 space-x-4">
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
        
        {randomEvents.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold mb-6 text-center">
              Or check out these events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {randomEvents.map(event => (
                <EventCard key={event.id} {...event} hideBookButton />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotFound;
