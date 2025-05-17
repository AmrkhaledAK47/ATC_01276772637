
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
const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Find category if in edit mode
  const categoryToEdit = isEditMode 
    ? mockCategories.find(category => category.id === id)
    : null;
  
  // Initialize form with default values or existing category data
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: categoryToEdit?.name || "",
    },
  });
  
  // Handle form submission
  function onSubmit(data: CategoryFormValues) {
    console.log("Form submitted:", data);
    
    // Here would be the API call to save the category
    // For now just navigate back
    navigate("/admin/categories");
  }
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/admin/categories">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? "Edit Category" : "Create Category"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update the details of an existing category."
            : "Add a new category for organizing events."}
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
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter category name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isEditMode && (
                <div className="pt-4 text-sm text-muted-foreground">
                  <p>This category is used in {categoryToEdit?.eventCount || 0} events.</p>
                  <p>Created: {categoryToEdit?.createdAt}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/categories")}
              >
                Cancel
              </Button>
              
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    // Here would be the delete API call
                    navigate("/admin/categories");
                  }}
                >
                  Delete Category
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

export default CategoryForm
