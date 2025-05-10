
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EventCard, EventCardProps } from "@/components/events/event-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FeaturedCarouselProps {
  events: EventCardProps[]
}

export function FeaturedCarousel({ events }: FeaturedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const maxSlide = Math.max(0, Math.ceil(events.length / 3) - 1)
  const slideRef = useRef<HTMLDivElement>(null)
  
  const scrollToSlide = (slideIndex: number) => {
    if (isAnimating || !slideRef.current) return
    
    setIsAnimating(true)
    setCurrentSlide(slideIndex)
    
    const slideWidth = slideRef.current.clientWidth
    slideRef.current.scrollTo({
      left: slideWidth * slideIndex,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }
  
  const nextSlide = () => {
    const nextIndex = currentSlide === maxSlide ? 0 : currentSlide + 1
    scrollToSlide(nextIndex)
  }
  
  const prevSlide = () => {
    const prevIndex = currentSlide === 0 ? maxSlide : currentSlide - 1
    scrollToSlide(prevIndex)
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)
    
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide])

  if (!events || events.length === 0) {
    return <div className="text-center py-8">No trending events available</div>
  }
  
  return (
    <div className="relative">
      {/* Carousel Container */}
      <div 
        className="overflow-hidden relative"
        ref={slideRef}
      >
        <div className="flex">
          {Array.from({ length: maxSlide + 1 }).map((_, slideIndex) => (
            <div 
              key={slideIndex}
              className="min-w-full flex flex-wrap justify-center gap-6 px-4"
              style={{ flexShrink: 0 }}
            >
              {events.slice(slideIndex * 3, slideIndex * 3 + 3).map((event) => (
                <div key={event.id} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] max-w-md">
                  <EventCard {...event} className="h-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 rounded-full h-10 w-10 z-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 rounded-full h-10 w-10 z-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>
      
      {/* Dots Indicator */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: maxSlide + 1 }).map((_, index) => (
          <button
            key={index}
            className={`h-2 mx-1 rounded-full transition-all ${
              index === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-primary/30'
            }`}
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
