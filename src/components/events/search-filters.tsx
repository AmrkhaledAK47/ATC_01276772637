
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Search, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SearchFilters() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [priceRange, setPriceRange] = React.useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters for search
    const params = new URLSearchParams();
    if (searchTerm) params.append("q", searchTerm);
    if (category && category !== "all") params.append("category", category);
    if (startDate) params.append("date", startDate.toISOString());
    if (priceRange && priceRange !== "any") params.append("price", priceRange);
    
    // In a real app, this would navigate to the search results page with query params
    console.log({
      searchTerm,
      category,
      startDate,
      priceRange
    });
    
    // For now, just navigate to events page
    navigate(`/events${params.toString() ? `?${params.toString()}` : ''}`);
    
    toast({
      title: "Search filters applied",
      description: "Events have been filtered based on your criteria."
    });
  };

  return (
    <div className="p-4 md:p-6 bg-card rounded-lg border shadow-sm">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search events..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="conference">Conferences</SelectItem>
                <SelectItem value="concert">Concerts</SelectItem>
                <SelectItem value="workshop">Workshops</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="arts">Arts & Culture</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <DatePicker 
              date={startDate}
              setDate={setStartDate}
              placeholder="Select date"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price Range</Label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger id="price">
                <SelectValue placeholder="Any price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="1-50">$1 - $50</SelectItem>
                <SelectItem value="51-100">$51 - $100</SelectItem>
                <SelectItem value="101-500">$101 - $500</SelectItem>
                <SelectItem value="500+">$500+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button type="submit" className="gap-1">
            Search Events
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
