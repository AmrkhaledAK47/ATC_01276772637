
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
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
import { format, isPast, isFuture } from "date-fns"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, MoreHorizontal, Plus, Filter, Download, Calendar } from "lucide-react"
import { useEvents } from "@/hooks/useEvents"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"

const EventManagement = () => {
  const { events, deleteEvent } = useEvents()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 10
  
  // Filter events based on search query, status and date
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" || 
      event.status === statusFilter;
      
    let matchesDate = true;
    if (dateFilter === "upcoming") {
      matchesDate = isFuture(event.date);
    } else if (dateFilter === "past") {
      matchesDate = isPast(event.date);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  
  // Handle event deletion
  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        deleteEvent(id);
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted",
        });
      } catch (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error",
          description: "Failed to delete the event",
          variant: "destructive",
        });
      }
    }
  };
  
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
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="few-tickets">Few Tickets</SelectItem>
              <SelectItem value="sold-out">Sold Out</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" title="Export events">
            <Download className="h-4 w-4" />
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
              <TableHead className="w-[250px]">Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" />
                      {format(event.date, "MMM dd, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {event.time}
                    </div>
                  </TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>
                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        event.status === "available" 
                          ? "default" 
                          : event.status === "few-tickets" 
                          ? "warning"
                          : event.status === "sold-out"
                          ? "destructive"
                          : "success"
                      }
                    >
                      {event.status === "available" 
                        ? "Available" 
                        : event.status === "few-tickets" 
                        ? "Few tickets" 
                        : event.status === "sold-out" 
                        ? "Sold out"
                        : "Free"}
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
                          className="text-destructive"
                          onClick={() => handleDeleteEvent(event.id)}
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
                  {searchQuery || statusFilter !== "all" || dateFilter !== "all" ? (
                    <>
                      <div className="font-medium">No matching events found</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Try adjusting your search or filters
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-medium">No events yet</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Create your first event to get started
                      </div>
                    </>
                  )}
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
