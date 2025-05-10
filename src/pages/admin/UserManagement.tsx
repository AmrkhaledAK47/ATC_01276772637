
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
import { format } from "date-fns"
import { Search, MoreHorizontal, Filter, Download, Plus, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions.
        </p>
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full sm:w-auto sm:min-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
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
            <Mail className="h-4 w-4 mr-2" /> Email
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground hidden md:block">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.bookingsCount}</TableCell>
                  <TableCell>{format(user.joinedDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <BadgeStatus
                      variant={
                        user.status === "active" 
                          ? "success" 
                          : user.status === "inactive" 
                          ? "default"
                          : "warning"
                      }
                    >
                      {user.status}
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
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

// Mock data
const users = [
  {
    id: "U12345",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    role: "Admin",
    bookingsCount: 12,
    joinedDate: new Date(2024, 2, 15),
    status: "active",
  },
  {
    id: "U12346",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "",
    role: "User",
    bookingsCount: 8,
    joinedDate: new Date(2024, 3, 5),
    status: "active",
  },
  {
    id: "U12347",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "",
    role: "User",
    bookingsCount: 3,
    joinedDate: new Date(2024, 4, 20),
    status: "active",
  },
  {
    id: "U12348",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    avatar: "",
    role: "User",
    bookingsCount: 0,
    joinedDate: new Date(2024, 4, 25),
    status: "inactive",
  },
  {
    id: "U12349",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    avatar: "",
    role: "Organizer",
    bookingsCount: 15,
    joinedDate: new Date(2024, 1, 10),
    status: "active",
  },
  {
    id: "U12350",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "",
    role: "User",
    bookingsCount: 6,
    joinedDate: new Date(2024, 3, 12),
    status: "suspended",
  },
  {
    id: "U12351",
    name: "David Wilson",
    email: "david.wilson@example.com",
    avatar: "",
    role: "Organizer",
    bookingsCount: 4,
    joinedDate: new Date(2024, 2, 22),
    status: "active",
  },
  {
    id: "U12352",
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    avatar: "",
    role: "User",
    bookingsCount: 2,
    joinedDate: new Date(2024, 4, 8),
    status: "active",
  },
]

export default UserManagement
