
import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminLayout } from "@/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"

const EventForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  
  // Find event if in edit mode
  const eventToEdit = isEditMode ? events.find(event => event.id === id) : null
  
  // Form state
  const [eventData, setEventData] = useState({
    name: eventToEdit?.name || "",
    description: eventToEdit?.description || "",
    category: eventToEdit?.category || "Conference",
    date: eventToEdit?.date || new Date(),
    time: eventToEdit?.time || "",
    venue: eventToEdit?.venue || "",
    price: eventToEdit?.price || 0,
    imageUrl: eventToEdit?.imageUrl || "",
    status: eventToEdit?.status || "draft"
  })
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here would be the API call to save the event
    console.log("Event data:", eventData)
    
    // Redirect back to event management
    navigate("/admin/events")
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
            <Label htmlFor="name">Event Name</Label>
            <Input 
              id="name"
              value={eventData.name}
              onChange={(e) => setEventData({...eventData, name: e.target.value})}
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
                onValueChange={(value) => setEventData({...eventData, status: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
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
                    onClick={() => setEventData({...eventData, imageUrl: ""})}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <ImagePlus className="h-10 w-10 text-muted-foreground/70 mb-2" />
                  <p className="text-muted-foreground mb-1">Drag & drop an image here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Recommended size: 1200 x 600 pixels</p>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="mt-4"
                    onClick={() => setEventData({
                      ...eventData, 
                      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
                    })}
                  >
                    Select Image
                  </Button>
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
          >
            Cancel
          </Button>
          
          {isEditMode && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                // Here would be the delete API call
                navigate("/admin/events")
              }}
            >
              Delete Event
            </Button>
          )}
          
          <Button type="submit">
            {isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}

// Mock data
const events = [
  {
    id: "1",
    name: "Tech Conference 2025",
    description: "Join the biggest tech conference in the city with renowned speakers and networking opportunities.",
    category: "Conference",
    date: new Date(2025, 5, 15),
    time: "9:00 AM - 5:00 PM",
    venue: "Downtown Convention Center",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    status: "published",
  },
  {
    id: "2",
    name: "Summer Music Festival",
    description: "A weekend of amazing performances by top artists across multiple genres.",
    category: "Music",
    date: new Date(2025, 7, 5),
    time: "12:00 PM - 11:00 PM",
    venue: "Riverside Park",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    status: "published",
  },
]

export default EventForm
