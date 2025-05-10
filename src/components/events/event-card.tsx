
import * as React from "react"
import { Link } from "react-router-dom"
import { BadgeStatus } from "@/components/ui/badge-status"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Star, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { motion } from "framer-motion"

export interface EventCardProps {
  id: string
  title: string
  description: string
  category: string
  date: Date
  time?: string
  venue: string
  price: number | string
  imageUrl: string
  status?: "available" | "sold-out" | "few-tickets" | "free"
  className?: string
}

export function EventCard({
  id,
  title,
  description,
  category,
  date,
  time,
  venue,
  price,
  imageUrl,
  status = "available",
  className,
}: EventCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFavorite, setIsFavorite] = React.useState(false)
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  
  return (
    <motion.div
      className={cn(
        "rounded-lg border border-border/40 bg-card overflow-hidden transition-all duration-300",
        isHovered ? "shadow-glow scale-[1.02] z-10" : "shadow-sm",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imageUrl}
          alt={title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70" />
        
        <div className="absolute top-2 left-2">
          <BadgeStatus 
            variant={
              status === "free" 
                ? "success" 
                : status === "few-tickets" 
                ? "warning" 
                : status === "sold-out" 
                ? "destructive"
                : "secondary"
            }
          >
            {status === "available" 
              ? "Available" 
              : status === "few-tickets" 
              ? "Few tickets left" 
              : status === "sold-out" 
              ? "Sold out"
              : "Free"}
          </BadgeStatus>
        </div>
        
        <button
          className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all",
              isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
            )}
          />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
          
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i}
                className={`h-3 w-3 ${i < 4 ? "text-accent fill-accent" : "text-muted"}`}
              />
            ))}
            <span className="text-xs ml-1 text-white/80">(42)</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-muted-foreground mt-1 text-sm line-clamp-2">{description}</div>
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
          </div>
          {time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{time}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{venue}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <div>
            <p className="text-xs text-muted-foreground">Price:</p>
            <p className="font-semibold text-lg">
              {typeof price === "number" 
                ? price === 0 
                  ? "Free" 
                  : `$${price.toFixed(2)}`
                : price}
            </p>
          </div>
          
          <Link to={`/events/${id}`}>
            <Button 
              className="shadow-sm hover:shadow-glow-accent transition-shadow"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
