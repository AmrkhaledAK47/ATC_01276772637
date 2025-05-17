
import React from "react"
import { AdminLayout } from "@/layouts/admin-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BadgeStatus } from "@/components/ui/badge-status"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { 
  Calendar, 
  Users, 
  Ticket, 
  Upload
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const activitiesPerPage = 5;
  
  // Calculate pagination for activities
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = recentActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(recentActivities.length / activitiesPerPage);
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of system metrics, recent activities, and pending actions.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,841</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success-500">↑ 4%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success-500">↑ 12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Bookings
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success-500">↑ 8%</span> last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Actions
            </CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Image uploads to review
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <Card className="mb-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{format(activity.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{activity.event}</TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        activity.action === "Booked" 
                          ? "success" 
                          : activity.action === "Created" 
                          ? "secondary"
                          : "warning"
                      }
                    >
                      {activity.action}
                    </BadgeStatus>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-end p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === i + 1} 
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Events & Bookings - kept from original for reference */}
      <h2 className="text-xl font-bold mb-4">Recent Events</h2>
      <Card className="mb-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{format(event.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        event.status === "Published" 
                          ? "secondary" 
                          : event.status === "Draft" 
                          ? "default"
                          : "warning"
                      }
                    >
                      {event.status}
                    </BadgeStatus>
                  </TableCell>
                  <TableCell>{event.sales}</TableCell>
                  <TableCell>${event.revenue}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.event}</TableCell>
                  <TableCell>{format(booking.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{booking.tickets}</TableCell>
                  <TableCell>${booking.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

// Mock data for events and bookings - kept from original
const recentEvents = [
  {
    id: "1",
    name: "Tech Conference 2025",
    date: new Date(2025, 5, 15),
    status: "Published",
    sales: 342,
    revenue: 68400,
  },
  {
    id: "2",
    name: "Summer Music Festival",
    date: new Date(2025, 7, 5),
    status: "Published",
    sales: 1245,
    revenue: 110805,
  },
  {
    id: "3",
    name: "Digital Marketing Workshop",
    date: new Date(2025, 4, 22),
    status: "Draft",
    sales: 0,
    revenue: 0,
  },
  {
    id: "4",
    name: "Charity Run for Education",
    date: new Date(2025, 3, 10),
    status: "Published",
    sales: 156,
    revenue: 3900,
  },
  {
    id: "5",
    name: "Art Exhibition",
    date: new Date(2025, 5, 1),
    status: "Cancelled",
    sales: 52,
    revenue: 1040,
  }
];

const recentBookings = [
  {
    id: "B12345",
    user: "Jane Smith",
    event: "Tech Conference 2025",
    date: new Date(2025, 3, 18),
    tickets: 2,
    amount: 398,
  },
  {
    id: "B12346",
    user: "John Doe",
    event: "Summer Music Festival",
    date: new Date(2025, 3, 17),
    tickets: 4,
    amount: 356,
  },
  {
    id: "B12347",
    user: "Alex Johnson",
    event: "Digital Marketing Workshop",
    date: new Date(2025, 3, 16),
    tickets: 1,
    amount: 49,
  },
  {
    id: "B12348",
    user: "Sarah Williams",
    event: "Charity Run for Education",
    date: new Date(2025, 3, 15),
    tickets: 3,
    amount: 75,
  },
  {
    id: "B12349",
    user: "Michael Brown",
    event: "Art Exhibition",
    date: new Date(2025, 3, 14),
    tickets: 2,
    amount: 0,
  },
];

// New mock data for activities
const recentActivities = [
  {
    id: "A1",
    date: new Date(2025, 3, 19),
    user: "Jane Smith",
    event: "Tech Conference 2025",
    action: "Booked"
  },
  {
    id: "A2",
    date: new Date(2025, 3, 18),
    user: "John Doe",
    event: "Summer Music Festival",
    action: "Booked"
  },
  {
    id: "A3",
    date: new Date(2025, 3, 18),
    user: "Admin User",
    event: "Digital Marketing Workshop",
    action: "Created"
  },
  {
    id: "A4",
    date: new Date(2025, 3, 17),
    user: "Michael Brown",
    event: "Charity Run for Education",
    action: "Cancelled"
  },
  {
    id: "A5",
    date: new Date(2025, 3, 17),
    user: "Sarah Williams",
    event: "Art Exhibition",
    action: "Booked"
  },
  {
    id: "A6",
    date: new Date(2025, 3, 16),
    user: "Alex Johnson",
    event: "Tech Conference 2025",
    action: "Booked"
  },
  {
    id: "A7",
    date: new Date(2025, 3, 16),
    user: "Admin User",
    event: "Summer Music Festival",
    action: "Updated"
  },
  {
    id: "A8",
    date: new Date(2025, 3, 15),
    user: "Lisa Brown",
    event: "Digital Marketing Workshop",
    action: "Booked"
  },
  {
    id: "A9",
    date: new Date(2025, 3, 15),
    user: "Tom Wilson",
    event: "Tech Conference 2025",
    action: "Cancelled"
  },
  {
    id: "A10",
    date: new Date(2025, 3, 14),
    user: "Admin User",
    event: "Charity Run for Education",
    action: "Created"
  },
  {
    id: "A11",
    date: new Date(2025, 3, 14),
    user: "Emily Davis",
    event: "Art Exhibition",
    action: "Booked"
  },
  {
    id: "A12",
    date: new Date(2025, 3, 13),
    user: "James Wilson",
    event: "Tech Conference 2025",
    action: "Booked"
  }
];

export default AdminDashboard
