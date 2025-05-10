
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { BadgeStatus } from "@/components/ui/badge-status"
import { Link, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { Search, MoreHorizontal, Plus, Filter, Download } from "lucide-react"
import { useEvents } from "@/context/EventContext"
import { useToast } from "@/components/ui/use-toast"

const EventManagement = () => {
  const { events, deleteEvent } = useEvents()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 10
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  
  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteEvent(id)
      toast({
        title: "Event deleted",
        description: `"${title}" has been successfully deleted.`,
      })
    }
  }
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage all your events from this dashboard.
        </p>
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full sm:w-auto sm:min-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button asChild>
            <Link to="/admin/events/create">
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Events Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
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
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{format(new Date(event.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>${typeof event.price === 'number' ? event.price.toFixed(2) : event.price}</TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        event.status === "available" 
                          ? "secondary" 
                          : event.status === "free" 
                          ? "success"
                          : event.status === "few-tickets" 
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {event.status === "available" 
                        ? "Available" 
                        : event.status === "free" 
                        ? "Free" 
                        : event.status === "few-tickets" 
                        ? "Few tickets" 
                        : "Sold out"}
                    </BadgeStatus>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/events/${event.id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/events/edit/${event.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  {filteredEvents.length === 0 && searchQuery 
                    ? "No events found matching your search" 
                    : "No events found. Create your first event!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredEvents.length > eventsPerPage && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default EventManagement
