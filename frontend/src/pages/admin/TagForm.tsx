
import React from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { AdminLayout } from "@/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Form validation schema
const tagFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tag name must be at least 2 characters.",
  }),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

const TagForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Find tag if in edit mode
  const tagToEdit = isEditMode 
    ? mockTags.find(tag => tag.id === id)
    : null;
  
  // Initialize form with default values or existing tag data
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: tagToEdit?.name || "",
    },
  });
  
  // Handle form submission
  function onSubmit(data: TagFormValues) {
    console.log("Form submitted:", data);
    
    // Here would be the API call to save the tag
    // For now just navigate back
    navigate("/admin/tags");
  }
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/admin/tags">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tags
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? "Edit Tag" : "Create Tag"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update the details of an existing tag."
            : "Add a new tag for improved event filtering and discovery."}
        </p>
      </div>
      
      <div className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-6 bg-card rounded-lg border">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter tag name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isEditMode && (
                <div className="pt-4 text-sm text-muted-foreground">
                  <p>This tag is used in {tagToEdit?.eventCount || 0} events.</p>
                  <p>Created: {tagToEdit?.createdAt}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/tags")}
              >
                Cancel
              </Button>
              
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    // Here would be the delete API call
                    navigate("/admin/tags");
                  }}
                >
                  Delete Tag
                </Button>
              )}
              
              <Button type="submit">
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
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

export default TagForm
