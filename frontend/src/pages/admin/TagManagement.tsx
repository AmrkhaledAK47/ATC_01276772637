
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

const TagManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tags] = useState(mockTags);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const itemsPerPage = 8;
  
  // Filter tags based on search
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  
  // Handle tag deletion
  const handleDeleteTag = () => {
    console.log("Deleting tag:", tagToDelete);
    // Implementation would remove the tag
    setTagToDelete(null);
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Tags</h1>
          <p className="text-muted-foreground">
            Create and manage event tags for better organization and discoverability.
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link to="/admin/tags/new">
            <Plus className="h-4 w-4 mr-2" /> New Tag
          </Link>
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tags..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Tags Table */}
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
            {currentTags.length > 0 ? (
              currentTags.map(tag => (
                <TableRow key={tag.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell>{tag.eventCount}</TableCell>
                  <TableCell>{tag.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        asChild
                      >
                        <Link to={`/admin/tags/edit/${tag.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setTagToDelete(tag.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the "{tag.name}" tag. This action cannot be undone.
                              {tag.eventCount > 0 && (
                                <span className="text-destructive font-semibold block mt-2">
                                  Warning: This tag is used by {tag.eventCount} events.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteTag}>
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
                  No tags found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredTags.length > itemsPerPage && (
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

// Mock data for tags
const mockTags = [
  { id: "1", name: "Tech", eventCount: 8, createdAt: "Jan 10, 2025" },
  { id: "2", name: "Business", eventCount: 12, createdAt: "Jan 12, 2025" },
  { id: "3", name: "Networking", eventCount: 5, createdAt: "Jan 15, 2025" },
  { id: "4", name: "Festival", eventCount: 7, createdAt: "Jan 20, 2025" },
  { id: "5", name: "Summer", eventCount: 4, createdAt: "Feb 05, 2025" },
  { id: "6", name: "Live Music", eventCount: 9, createdAt: "Feb 10, 2025" },
  { id: "7", name: "Marketing", eventCount: 6, createdAt: "Feb 15, 2025" },
  { id: "8", name: "Digital", eventCount: 8, createdAt: "Feb 20, 2025" },
  { id: "9", name: "Charity", eventCount: 3, createdAt: "Mar 01, 2025" },
  { id: "10", name: "Running", eventCount: 2, createdAt: "Mar 05, 2025" },
  { id: "11", name: "Education", eventCount: 5, createdAt: "Mar 10, 2025" },
  { id: "12", name: "Art", eventCount: 6, createdAt: "Mar 15, 2025" },
  { id: "13", name: "Exhibition", eventCount: 4, createdAt: "Mar 20, 2025" },
  { id: "14", name: "Free", eventCount: 3, createdAt: "Apr 01, 2025" },
  { id: "15", name: "Comedy", eventCount: 5, createdAt: "Apr 05, 2025" },
];

export default TagManagement
