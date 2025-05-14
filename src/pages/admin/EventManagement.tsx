
import React, { useState } from "react"
import { AdminLayout } from "@/layouts/admin-layout"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { BadgeStatus } from "@/components/ui/badge-status"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { Search, Filter, Download, Plus, Pencil, Trash, Calendar, Tag } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const EventManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const eventsPerPage = 5
  
  // Filter events based on search query & filters
  const filteredEvents = events
    .filter(event => 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(event => selectedCategory ? event.category === selectedCategory : true)
    .filter(event => selectedTag ? event.tags.includes(selectedTag) : true);
  
  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all your events from this dashboard.
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link to="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" /> Create Event
          </Link>
        </Button>
      </div>
      
      {/* Filter & Search Controls */}
      <div className="bg-card p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent>
              {tags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" /> Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">Start Date</div>
                  <Input type="date" id="start-date" />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">End Date</div>
                  <Input type="date" id="end-date" />
                </div>
                <Button className="w-full">Apply Filter</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button variant="link" onClick={handleResetFilters} className="text-sm p-0">
            Reset Filters
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> More Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>
      </div>
      
      {/* Events Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEvents.length > 0 ? (
              currentEvents.map(event => (
                <TableRow key={event.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="w-16 h-12 overflow-hidden rounded-md">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={event.imageUrl} 
                          alt={event.name}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{format(event.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>${event.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        event.status === "published" 
                          ? "success" 
                          : event.status === "draft" 
                          ? "default"
                          : "warning"
                      }
                    >
                      {event.status}
                    </BadgeStatus>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        asChild
                      >
                        <Link to={`/admin/events/edit/${event.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredEvents.length > eventsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Calculate page numbers to display with ellipsis for many pages
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                    if (i === 4) pageNum = totalPages;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                    if (i === 0) pageNum = 1;
                    if (i === 4) pageNum = totalPages;
                  }
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === pageNum} 
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </AdminLayout>
  )
}

// Mock data for events
const events = [
  {
    id: "1",
    name: "Tech Conference 2025",
    date: new Date(2025, 5, 15),
    time: "9:00 AM - 5:00 PM",
    venue: "Downtown Convention Center",
    price: 199,
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    category: "Conference",
    tags: ["Tech", "Business", "Networking"]
  },
  {
    id: "2",
    name: "Summer Music Festival",
    date: new Date(2025, 7, 5),
    time: "12:00 PM - 11:00 PM",
    venue: "Riverside Park",
    price: 89,
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    category: "Music",
    tags: ["Festival", "Summer", "Live Music"]
  },
  {
    id: "3",
    name: "Digital Marketing Workshop",
    date: new Date(2025, 4, 22),
    time: "10:00 AM - 3:00 PM",
    venue: "Business Hub",
    price: 49,
    status: "draft",
    imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
    category: "Workshop",
    tags: ["Marketing", "Business", "Digital"]
  },
  {
    id: "4",
    name: "Charity Run for Education",
    date: new Date(2025, 3, 10),
    time: "7:00 AM",
    venue: "City Park",
    price: 25,
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1509609701515-c7a0bf99a2a8?q=80&w=2069&auto=format&fit=crop",
    category: "Sports",
    tags: ["Charity", "Running", "Education"]
  },
  {
    id: "5",
    name: "Art Exhibition: Future Perspectives",
    date: new Date(2025, 5, 1),
    time: "10:00 AM - 6:00 PM",
    venue: "Modern Art Gallery",
    price: 0,
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    category: "Arts",
    tags: ["Art", "Exhibition", "Free"]
  },
  {
    id: "6",
    name: "Comedy Night",
    date: new Date(2025, 2, 25),
    time: "8:00 PM",
    venue: "Laugh Factory",
    price: 35,
    status: "cancelled",
    imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2071&auto=format&fit=crop",
    category: "Entertainment",
    tags: ["Comedy", "Nightlife", "Performance"]
  },
  {
    id: "7",
    name: "Charity Gala Dinner",
    date: new Date(2025, 6, 12),
    time: "7:00 PM - 11:00 PM",
    venue: "Grand Ballroom",
    price: 150,
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1466276535569-9a6fdfe6c22c?q=80&w=2070&auto=format&fit=crop",
    category: "Charity",
    tags: ["Fundraising", "Formal", "Dinner"]
  },
  {
    id: "8",
    name: "Film Festival Opening",
    date: new Date(2025, 9, 5),
    time: "6:00 PM - 10:00 PM",
    venue: "Cinema Plaza",
    price: 50,
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
    category: "Entertainment",
    tags: ["Film", "Festival", "Arts"]
  },
];

// Mock categories and tags for filters
const categories = ["Conference", "Music", "Workshop", "Sports", "Arts", "Entertainment", "Charity"];
const tags = ["Tech", "Business", "Networking", "Festival", "Summer", "Live Music", "Marketing", 
              "Digital", "Charity", "Running", "Education", "Art", "Exhibition", "Free", "Comedy", 
              "Nightlife", "Performance", "Fundraising", "Formal", "Dinner", "Film"];

export default EventManagement
