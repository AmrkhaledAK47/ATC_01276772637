
import * as React from "react"
import { Link } from "react-router-dom"
import { BadgeStatus } from "@/components/ui/badge-status"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

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
  return (
    <div className={cn(
      "overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="h-48 w-full object-cover"
        />
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
        <div className="absolute top-2 right-2">
          <BadgeStatus variant="outline">
            {category}
          </BadgeStatus>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
        <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
          </div>
          {time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{time}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{venue}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Price:</p>
            <p className="font-semibold text-lg">
              {typeof price === "number" 
                ? price === 0 
                  ? "Free" 
                  : `$${price.toFixed(2)}`
                : price}
            </p>
          </div>
          
          <Link to={`/events/${id}`}>
            <Button className="btn-bounce">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
