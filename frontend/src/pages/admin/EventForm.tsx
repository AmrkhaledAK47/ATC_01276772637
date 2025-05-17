
import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { AdminLayout } from "@/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ImagePlus, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Form schema with validation
const eventFormSchema = z.object({
  name: z.string().min(3, { message: "Event name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string().min(1, { message: "Please enter event time." }),
  venue: z.string().min(3, { message: "Venue must be at least 3 characters." }),
  price: z.number().min(0, { message: "Price cannot be negative." }),
  status: z.string(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const EventForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  
  // Find event if in edit mode
  const eventToEdit = isEditMode ? events.find(event => event.id === id) : null
  
  // Initialize the form with default values or existing event data
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: eventToEdit?.name || "",
      description: eventToEdit?.description || "",
      category: eventToEdit?.category || "",
      date: eventToEdit?.date || new Date(),
      time: eventToEdit?.time || "",
      venue: eventToEdit?.venue || "",
      price: eventToEdit?.price || 0,
      status: eventToEdit?.status || "draft",
      tags: eventToEdit?.tags || [],
      imageUrl: eventToEdit?.imageUrl || "",
    },
  });
  
  // Selected tags state
  const [selectedTags, setSelectedTags] = useState<string[]>(eventToEdit?.tags || []);
  
  // Handle form submission
  function onSubmit(data: EventFormValues) {
    // Add tags to form data
    data.tags = selectedTags;
    console.log("Form submitted:", data);
    
    // Here would be the API call to save the event
    // For now just navigate back
    navigate("/admin/events");
  }
  
  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/admin/events">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? "Edit Event" : "Create New Event"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode 
            ? "Update the details of your existing event." 
            : "Fill in the details to create a new event."}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4 p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter event name" className="max-w-2xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter event description"
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Date & Location */}
          <div className="space-y-4 p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Date & Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 7:00 PM - 10:00 PM" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter venue name" className="max-w-2xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-4 p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="space-y-4">
              <Label>Select Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="h-8"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedTags.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Pricing & Media */}
          <div className="space-y-4 p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Pricing & Media</h2>
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input 
                        type="number"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className="pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Enter 0 for free events</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Image</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      {field.value ? (
                        <div className="relative aspect-video max-w-md mx-auto">
                          <img 
                            src={field.value} 
                            alt="Event preview" 
                            className="rounded-md object-cover w-full h-full"
                          />
                          <Button 
                            type="button"
                            variant="secondary" 
                            size="sm" 
                            className="absolute bottom-2 right-2"
                            onClick={() => form.setValue('imageUrl', '')}
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
                            onClick={() => form.setValue('imageUrl', "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop")}
                          >
                            Select Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </Form>
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
    tags: ["Tech", "Business", "Networking"]
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
    tags: ["Festival", "Summer", "Live Music"]
  },
];

// Mock categories and tags for form options
const categories = ["Conference", "Music", "Workshop", "Sports", "Arts", "Entertainment", "Charity"];
const tags = [
  "Tech", "Business", "Networking", "Festival", "Summer", "Live Music", "Marketing", 
  "Digital", "Charity", "Running", "Education", "Art", "Exhibition", "Free", "Comedy", 
  "Nightlife", "Performance", "Fundraising", "Formal", "Dinner", "Film"
];

export default EventForm
