
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminLayout } from "@/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { CalendarIcon, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvents, Event } from "@/hooks/useEvents"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"

const EventForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, addEvent, updateEvent, deleteEvent } = useEvents()
  const { user } = useAuth()
  const isEditMode = !!id
  
  // Find event if in edit mode
  const eventToEdit = isEditMode ? getEvent(id) : null
  
  // Form state
  const [eventData, setEventData] = useState({
    title: eventToEdit?.title || "",
    description: eventToEdit?.description || "",
    category: eventToEdit?.category || "Conference",
    date: eventToEdit?.date || new Date(),
    time: eventToEdit?.time || "",
    venue: eventToEdit?.venue || "",
    price: eventToEdit?.price || 0,
    imageUrl: eventToEdit?.imageUrl || "",
    status: eventToEdit?.status || "available",
    featured: eventToEdit?.featured || false,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Validate the data
      if (!eventData.title || !eventData.description || !eventData.venue) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        setIsSubmitting(false)
        return
      }

      // Handle event creation/update
      if (isEditMode && id) {
        updateEvent(id, eventData)
        toast({
          title: "Event updated",
          description: "The event has been updated successfully",
        })
      } else {
        addEvent({
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          date: eventData.date,
          time: eventData.time,
          venue: eventData.venue,
          price: eventData.price,
          imageUrl: eventData.imageUrl,
          status: eventData.status as "available" | "sold-out" | "few-tickets" | "free",
          featured: eventData.featured
        }, user.id)
        
        toast({
          title: "Event created",
          description: "The event has been created successfully",
        })
      }
      
      // Redirect back to event management
      navigate("/admin/events")
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "There was an error saving the event",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle event deletion
  const handleDelete = async () => {
    if (!id) return
    
    setIsDeleting(true)
    
    try {
      deleteEvent(id)
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully",
      })
      navigate("/admin/events")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the event",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }
  
  // Sample image options for the demo
  const sampleImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop",
  ]
  
  const [showImageSelector, setShowImageSelector] = useState(false)
  
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
            <Label htmlFor="title">Event Title</Label>
            <Input 
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              placeholder="Enter event title"
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
                onValueChange={(value) => setEventData({
                  ...eventData, 
                  status: value as "available" | "sold-out" | "few-tickets" | "free"
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="few-tickets">Few Tickets Left</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={eventData.featured}
                onCheckedChange={(checked) => setEventData({...eventData, featured: checked})}
              />
              <Label htmlFor="featured">Feature this event on the homepage</Label>
            </div>
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
                  <Calendar
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
                step="0.01"
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
                <div className="relative aspect-video max-w-md mx-auto">
                  <img 
                    src={eventData.imageUrl} 
                    alt="Event preview" 
                    className="rounded-md object-cover w-full h-full"
                  />
                  <Button 
                    type="button"
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-2 right-2"
                    onClick={() => setShowImageSelector(true)}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <ImagePlus className="h-10 w-10 text-muted-foreground/70 mb-2" />
                  <p className="text-muted-foreground mb-1">Select an image for your event</p>
                  <p className="text-xs text-muted-foreground">Recommended size: 1200 x 600 pixels</p>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="mt-4"
                    onClick={() => setShowImageSelector(true)}
                  >
                    Select Image
                  </Button>
                </div>
              )}
            </div>
            
            {/* Image Selector */}
            {showImageSelector && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Select an image:</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((image, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "border-2 rounded-md overflow-hidden cursor-pointer aspect-video",
                        eventData.imageUrl === image 
                          ? "border-primary" 
                          : "border-transparent hover:border-border"
                      )}
                      onClick={() => {
                        setEventData({...eventData, imageUrl: image});
                        setShowImageSelector(false);
                      }}
                    >
                      <img src={image} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/admin/events")}
          >
            Cancel
          </Button>
          
          {isEditMode && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </Button>
          )}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditMode ? "Update Event" : "Create Event"
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default EventForm;
