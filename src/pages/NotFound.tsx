
import { Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/events/event-card"
import { useEvents } from "@/hooks/useEvents"

const NotFound = () => {
  const { popularEvents } = useEvents(); // Get some recommended events

  return (
    <MainLayout>
      <div className="container py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">404</h1>
        <p className="text-3xl mb-6">Page not found</p>
        <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Button variant="outline" asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
        
        {popularEvents && popularEvents.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-semibold mb-8">Popular Events You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularEvents.slice(0, 3).map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default NotFound
