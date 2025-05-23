import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, Ticket } from "lucide-react"
import { motion } from "framer-motion"
import { EventCard } from "@/components/events/event-card"
import { EventsService } from "@/services/events.service"
import { Event } from "@/types"

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch featured events
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setIsLoading(true)
        const events = await EventsService.getFeaturedEvents()
        setSuggestedEvents(events.slice(0, 4)) // Only take first 4 events
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching featured events:", error)
        setIsLoading(false)
      }
    }

    fetchFeaturedEvents()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Calculate movement for parallax effect
  const calculateMovement = (axis: 'x' | 'y', factor: number = 15) => {
    const windowCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }

    const offset = {
      x: (mousePosition.x - windowCenter.x) / factor,
      y: (mousePosition.y - windowCenter.y) / factor
    }

    return offset[axis]
  }

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute right-[10%] top-[10%] h-64 w-64 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl"
            animate={{
              x: calculateMovement('x', -25),
              y: calculateMovement('y', -25)
            }}
          />
          <motion.div
            className="absolute left-[15%] bottom-[15%] h-48 w-48 rounded-full bg-gradient-to-r from-secondary/20 to-accent/20 blur-3xl"
            animate={{
              x: calculateMovement('x', 25),
              y: calculateMovement('y', 25)
            }}
          />
        </div>

        {/* Content */}
        <motion.div
          className="container max-w-2xl text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="text-[10rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary"
            variants={item}
            animate={{
              x: calculateMovement('x', 5),
              y: calculateMovement('y', 5),
              rotateZ: calculateMovement('x', 100)
            }}
          >
            404
          </motion.div>

          <motion.h1
            className="text-4xl font-bold mb-4"
            variants={item}
          >
            Page Not Found
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground mb-8"
            variants={item}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>

          <motion.div variants={item}>
            <form className="mb-8 relative flex w-full max-w-lg mx-auto">
              <Input
                type="text"
                placeholder="Search for events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-24 h-12"
              />
              <Button
                type="submit"
                className="absolute right-0 top-0 bottom-0 rounded-l-none"
              >
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </form>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go to home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/events">
                <Ticket className="mr-2 h-4 w-4" /> Browse all events
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Suggested Events */}
        <motion.div
          className="container mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Suggested Events</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : suggestedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suggestedEvents.map((event) => (
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
            <p className="text-center text-muted-foreground">No suggested events available at the moment.</p>
          )}
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default NotFound
