
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminLayout } from "@/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ImagePlus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvents } from "@/context/EventContext"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const EventForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, addEvent, updateEvent, events } = useEvents()
  const { toast } = useToast()
  const isEditMode = !!id
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "Conference",
    date: new Date(),
    time: "",
    venue: "",
    price: 0,
    imageUrl: "",
    status: "available",
    featured: false
  })
  
  // Load event data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const event = getEvent(id)
      if (event) {
        setEventData({
          title: event.title,
          description: event.description,
          category: event.category,
          date: new Date(event.date),
          time: event.time,
          venue: event.venue,
          price: event.price,
          imageUrl: event.imageUrl,
          status: event.status,
          featured: event.featured || false
        })
      }
    }
  }, [isEditMode, id, getEvent])
  
  // Sample image options
  const sampleImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2070&auto=format&fit=crop",
  ]
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Additional validation
      if (!eventData.title) throw new Error("Event title is required")
      if (!eventData.description) throw new Error("Event description is required")
      if (!eventData.venue) throw new Error("Event venue is required")
      if (!eventData.time) throw new Error("Event time is required")
      if (!eventData.imageUrl) throw new Error("Event image is required")
      
      if (isEditMode && id) {
        // Update existing event
        updateEvent(id, eventData)
        toast({
          title: "Event updated",
          description: `"${eventData.title}" has been successfully updated.`,
        })
      } else {
        // Create new event
        addEvent(eventData)
        toast({
          title: "Event created",
          description: `"${eventData.title}" has been successfully created.`,
        })
      }
      
      // Redirect back to event management
      navigate("/admin/events")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleSelectSampleImage = (url: string) => {
    setEventData({...eventData, imageUrl: url})
  }
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? "Edit Event" : "Create New Event"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode 
            ? "Update the details of your existing event." 
            : "Fill in the details to create a new event."}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">Event Name</Label>
            <Input 
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              placeholder="Enter event name"
              required
              className="max-w-2xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
              placeholder="Enter event description"
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={eventData.category}
                onValueChange={(value) => setEventData({...eventData, category: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Charity">Charity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={eventData.status}
                onValueChange={(value: "available" | "sold-out" | "few-tickets" | "free") => setEventData({...eventData, status: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="few-tickets">Few Tickets Left</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                  <SelectItem value="free">Free Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="featured" 
              checked={eventData.featured}
              onCheckedChange={(checked) => 
                setEventData({...eventData, featured: checked === true})
              }
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Feature this event on homepage
            </label>
          </div>
        </div>
        
        {/* Date & Location */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Date & Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventData.date ? format(eventData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={eventData.date}
                    onSelect={(date) => date && setEventData({...eventData, date})}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Event Time</Label>
              <Input 
                id="time"
                value={eventData.time}
                onChange={(e) => setEventData({...eventData, time: e.target.value})}
                placeholder="e.g., 7:00 PM - 10:00 PM"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input 
              id="venue"
              value={eventData.venue}
              onChange={(e) => setEventData({...eventData, venue: e.target.value})}
              placeholder="Enter venue name"
              required
              className="max-w-2xl"
            />
          </div>
        </div>
        
        {/* Pricing & Media */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Pricing & Media</h2>
          
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="price">Price (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input 
                id="price"
                type="number" 
                min="0"
                value={eventData.price}
                onChange={(e) => setEventData({...eventData, price: Number(e.target.value)})}
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">Enter 0 for free events</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              {eventData.imageUrl ? (
                <div className="relative max-w-md mx-auto">
                  <img 
                    src={eventData.imageUrl} 
                    alt="Event preview" 
                    className="rounded-md object-cover w-full aspect-video"
                  />
                  <Button 
                    type="button"
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-2 right-2"
                    onClick={() => setEventData({...eventData, imageUrl: ""})}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <ImagePlus className="h-10 w-10 text-muted-foreground/70 mb-2" />
                  <p className="text-muted-foreground mb-1">Select an image for your event</p>
                  <p className="text-xs text-muted-foreground mb-4">Recommended size: 1200 x 600 pixels</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mt-4">
                    {sampleImages.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        className="aspect-video rounded-md overflow-hidden border hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => handleSelectSampleImage(url)}
                      >
                        <img src={url} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/admin/events")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          {isEditMode && id && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${eventData.title}"?`)) {
                  navigate("/admin/events")
                }
              }}
              disabled={isSubmitting}
            >
              Delete Event
            </Button>
          )}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditMode ? "Update Event" : "Create Event"}</>
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default EventForm
