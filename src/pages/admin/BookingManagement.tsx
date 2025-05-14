
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
import { BadgeStatus } from "@/components/ui/badge-status"
import { format } from "date-fns"
import { Search, Filter, Calendar, Eye } from "lucide-react"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const BookingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const bookingsPerPage = 8
  
  // Filter bookings based on search query & status filter
  const filteredBookings = bookings
    .filter(booking => 
      booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(booking => statusFilter ? booking.status === statusFilter : true)
  
  // Calculate pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)
  
  // Handle status change
  const handleStatusChange = (bookingId: string, status: string) => {
    console.log(`Changing status of booking ${bookingId} to ${status}`);
    // Here would be the API call to update the booking status
  }
  
  // View booking details
  const viewBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">All Bookings</h1>
        <p className="text-muted-foreground">
          Manage and update booking statuses for all events.
        </p>
      </div>
      
      {/* Filter & Search Controls */}
      <div className="bg-card p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by user or event..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
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
          <Button variant="link" onClick={() => { 
            setSearchQuery(""); 
            setStatusFilter("");
          }} className="text-sm p-0">
            Reset Filters
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> More Filters
          </Button>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBookings.length > 0 ? (
              currentBookings.map(booking => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.event}</TableCell>
                  <TableCell>{format(booking.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{booking.tickets}</TableCell>
                  <TableCell>${booking.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        booking.status === "confirmed" 
                          ? "success" 
                          : booking.status === "pending" 
                          ? "warning"
                          : booking.status === "refunded"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </BadgeStatus>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewBookingDetails(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">Change Status</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            disabled={booking.status === "confirmed"}
                          >
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            disabled={booking.status === "cancelled"}
                          >
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, "refunded")}
                            disabled={booking.status === "refunded"}
                          >
                            Refund
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredBookings.length > bookingsPerPage && (
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
      
      {/* Booking Details Dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p>{selectedBooking.user}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <BadgeStatus
                    variant={
                      selectedBooking.status === "confirmed" 
                        ? "success" 
                        : selectedBooking.status === "pending" 
                        ? "warning"
                        : selectedBooking.status === "refunded"
                        ? "secondary"
                        : "destructive"
                    }
                    className="mt-1"
                  >
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </BadgeStatus>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Event Details</p>
                <p className="font-medium">{selectedBooking.event}</p>
                <p>{format(selectedBooking.date, "EEEE, MMMM dd, yyyy")}</p>
                <p>{selectedBooking.venue}</p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Ticket Details</p>
                <div className="flex justify-between items-center">
                  <p>Tickets:</p>
                  <p>{selectedBooking.tickets} x ${(selectedBooking.amount / selectedBooking.tickets).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <p>Total:</p>
                  <p>${selectedBooking.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Payment Information</p>
                <div className="flex justify-between items-center">
                  <p>Payment Method:</p>
                  <p>{selectedBooking.paymentMethod}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Transaction ID:</p>
                  <p className="font-mono text-sm">{selectedBooking.transactionId}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

// Mock data for bookings
const bookings = [
  {
    id: "B12345",
    user: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 123-4567",
    event: "Tech Conference 2025",
    venue: "Downtown Convention Center",
    date: new Date(2025, 3, 18),
    tickets: 2,
    amount: 398,
    status: "confirmed",
    paymentMethod: "Credit Card",
    transactionId: "TXN789012345"
  },
  {
    id: "B12346",
    user: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 987-6543",
    event: "Summer Music Festival",
    venue: "Riverside Park",
    date: new Date(2025, 3, 17),
    tickets: 4,
    amount: 356,
    status: "confirmed",
    paymentMethod: "PayPal",
    transactionId: "TXN789012346"
  },
  {
    id: "B12347",
    user: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 456-7890",
    event: "Digital Marketing Workshop",
    venue: "Business Hub",
    date: new Date(2025, 3, 16),
    tickets: 1,
    amount: 49,
    status: "pending",
    paymentMethod: "Credit Card",
    transactionId: "TXN789012347"
  },
  {
    id: "B12348",
    user: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 222-3333",
    event: "Charity Run for Education",
    venue: "City Park",
    date: new Date(2025, 3, 15),
    tickets: 3,
    amount: 75,
    status: "confirmed",
    paymentMethod: "Credit Card",
    transactionId: "TXN789012348"
  },
  {
    id: "B12349",
    user: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 444-5555",
    event: "Art Exhibition",
    venue: "Modern Art Gallery",
    date: new Date(2025, 3, 14),
    tickets: 2,
    amount: 0,
    status: "confirmed",
    paymentMethod: "Free Event",
    transactionId: "TXN789012349"
  },
  {
    id: "B12350",
    user: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 666-7777",
    event: "Comedy Night",
    venue: "Laugh Factory",
    date: new Date(2025, 3, 13),
    tickets: 2,
    amount: 70,
    status: "cancelled",
    paymentMethod: "Credit Card",
    transactionId: "TXN789012350"
  },
  {
    id: "B12351",
    user: "Robert Wilson",
    email: "robert@example.com",
    phone: "+1 (555) 888-9999",
    event: "Film Festival Opening",
    venue: "Cinema Plaza",
    date: new Date(2025, 3, 12),
    tickets: 3,
    amount: 150,
    status: "refunded",
    paymentMethod: "Credit Card",
    transactionId: "TXN789012351"
  },
  {
    id: "B12352",
    user: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "+1 (555) 111-2222",
    event: "Tech Conference 2025",
    venue: "Downtown Convention Center",
    date: new Date(2025, 3, 11),
    tickets: 1,
    amount: 199,
    status: "confirmed",
    paymentMethod: "PayPal",
    transactionId: "TXN789012352"
  },
  {
    id: "B12353",
    user: "David Thomas",
    email: "david@example.com",
    phone: "+1 (555) 333-4444",
    event: "Summer Music Festival",
    venue: "Riverside Park",
    date: new Date(2025, 3, 10),
    tickets: 2,
    amount: 178,
    status: "pending",
    paymentMethod: "Credit Card",
    transactionId: "TXN789012353"
  },
  {
    id: "B12354",
    user: "Susan Miller",
    email: "susan@example.com",
    phone: "+1 (555) 555-6666",
    event: "Digital Marketing Workshop",
    venue: "Business Hub",
    date: new Date(2025, 3, 9),
    tickets: 1,
    amount: 49,
    status: "confirmed",
    paymentMethod: "Credit Card",
    transactionId: "TXN789012354"
  },
  {
    id: "B12355",
    user: "Kevin Harris",
    email: "kevin@example.com",
    phone: "+1 (555) 777-8888",
    event: "Charity Run for Education",
    venue: "City Park",
    date: new Date(2025, 3, 8),
    tickets: 4,
    amount: 100,
    status: "confirmed",
    paymentMethod: "PayPal",
    transactionId: "TXN789012355"
  },
  {
    id: "B12356",
    user: "Jennifer Lee",
    email: "jennifer@example.com",
    phone: "+1 (555) 999-0000",
    event: "Art Exhibition",
    venue: "Modern Art Gallery",
    date: new Date(2025, 3, 7),
    tickets: 1,
    amount: 0,
    status: "cancelled",
    paymentMethod: "Free Event",
    transactionId: "TXN789012356"
  },
];

export default BookingManagement
