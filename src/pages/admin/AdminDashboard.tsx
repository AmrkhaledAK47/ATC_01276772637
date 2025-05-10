
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

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all events, bookings, and user activities.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success-500">↑ 12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,642</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success-500">↑ 8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48,294</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success-500">↑ 16%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,841</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success-500">↑ 4%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Events Table */}
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
      
      {/* Recent Bookings */}
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

// Mock data
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

export default AdminDashboard
