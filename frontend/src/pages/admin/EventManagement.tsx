import React, { useState, useEffect } from "react"
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
import { EventsService } from "@/services/events.service"
import { Event, Category, Tag } from "@/types"

const EventManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const eventsPerPage = 5

  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events, categories and tags
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch events from API
        const eventsData = await EventsService.getEvents()
        setEvents(eventsData)

        // Fetch categories from API
        // This assumes you have a CategoriesService - modify as needed
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // Fetch tags from API
        // This assumes you have a TagsService - modify as needed
        const tagsResponse = await fetch('/api/tags')
        const tagsData = await tagsResponse.json()
        setTags(tagsData)

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await EventsService.deleteEvent(eventId)
        // Remove the event from the state
        setEvents(events.filter(event => event.id !== eventId))
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
  }

  // Filter events based on search query & filters
  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(event => selectedCategory ? event.categoryId === selectedCategory : true)
    .filter(event => {
      if (!selectedTag) return true

      // Check if event has the selected tag
      return event.tags?.some(tag => tag.tagId === selectedTag)
    })

  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedTag("")
  }

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
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent>
              {tags.map(tag => (
                <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
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
            {isLoading ? (
              // Loading state
              Array(eventsPerPage).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="w-16 h-12 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : currentEvents.length > 0 ? (
              currentEvents.map(event => (
                <TableRow key={event.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="w-16 h-12 overflow-hidden rounded-md">
                      <AspectRatio ratio={4 / 3}>
                        <img
                          src={event.image}
                          alt={event.title}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{format(new Date(event.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>${event.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        // Map the available seats to a status
                        event.availableSeats === 0
                          ? "destructive"
                          : event.availableSeats < 10
                            ? "warning"
                            : event.availableSeats === event.capacity
                              ? "default"
                              : "success"
                      }
                    >
                      {event.availableSeats === 0
                        ? "Sold Out"
                        : event.availableSeats < 10
                          ? "Few Seats"
                          : event.availableSeats === event.capacity
                            ? "No Sales"
                            : "Available"}
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
                        onClick={() => handleDeleteEvent(event.id)}
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

export default EventManagement
