
import React, { useState } from "react"
import { AdminLayout } from "@/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Search, Plus, Pencil, Trash } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const CategoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories] = useState(mockCategories);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const itemsPerPage = 8;
  
  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  
  // Handle category deletion
  const handleDeleteCategory = () => {
    console.log("Deleting category:", categoryToDelete);
    // Implementation would remove the category
    setCategoryToDelete(null);
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
          <p className="text-muted-foreground">
            Create and manage event categories.
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link to="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" /> New Category
          </Link>
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search categories..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Categories Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCategories.length > 0 ? (
              currentCategories.map(category => (
                <TableRow key={category.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.eventCount}</TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        asChild
                      >
                        <Link to={`/admin/categories/edit/${category.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setCategoryToDelete(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the "{category.name}" category. This action cannot be undone.
                              {category.eventCount > 0 && (
                                <span className="text-destructive font-semibold block mt-2">
                                  Warning: This category is used by {category.eventCount} events.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteCategory}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredCategories.length > itemsPerPage && (
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
    </AdminLayout>
  )
}

// Mock data for categories
const mockCategories = [
  { id: "1", name: "Conference", eventCount: 15, createdAt: "Jan 10, 2025" },
  { id: "2", name: "Music", eventCount: 24, createdAt: "Jan 12, 2025" },
  { id: "3", name: "Workshop", eventCount: 7, createdAt: "Jan 15, 2025" },
  { id: "4", name: "Sports", eventCount: 9, createdAt: "Jan 20, 2025" },
  { id: "5", name: "Arts", eventCount: 12, createdAt: "Feb 05, 2025" },
  { id: "6", name: "Entertainment", eventCount: 18, createdAt: "Feb 10, 2025" },
  { id: "7", name: "Charity", eventCount: 6, createdAt: "Feb 15, 2025" },
  { id: "8", name: "Business", eventCount: 11, createdAt: "Feb 20, 2025" },
  { id: "9", name: "Technology", eventCount: 14, createdAt: "Mar 01, 2025" },
  { id: "10", name: "Health & Wellness", eventCount: 8, createdAt: "Mar 05, 2025" },
  { id: "11", name: "Food & Drink", eventCount: 13, createdAt: "Mar 10, 2025" },
];

export default CategoryManagement
