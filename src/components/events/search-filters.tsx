
import * as React from "react"
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
import { Search, ArrowRight, Calendar, MapPin, Tag, DollarSign } from "lucide-react"

export function SearchFilters() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [priceRange, setPriceRange] = React.useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      searchTerm,
      category,
      location,
      startDate,
      priceRange
    });
    // Here you would typically call a search function or navigate to results
  };

  return (
    <div className="p-4 md:p-6 bg-card rounded-lg border shadow-sm">
      <form onSubmit={handleSearch}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Category
            </Label>
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
                <SelectItem value="arts">Arts</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="los-angeles">Los Angeles</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="miami">Miami</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
                <SelectItem value="seattle">Seattle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date
            </Label>
            <DatePicker 
              date={startDate}
              setDate={setStartDate}
              placeholder="Select date"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Price Range
            </Label>
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
        
        <div className="mt-6">
          <Button type="submit" className="w-full gap-2">
            Search Events
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
