
import React, { useState } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

const categories = [
  { label: "All Categories", value: "all" },
  { label: "Conferences", value: "Conference" },
  { label: "Music", value: "Music" },
  { label: "Workshops", value: "Workshop" },
  { label: "Sports", value: "Sports" },
  { label: "Arts", value: "Arts" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Charity", value: "Charity" },
  { label: "Food", value: "Food" },
  { label: "Health", value: "Health" },
  { label: "Business", value: "Business" }
]

export interface SearchFiltersProps {
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

export function SearchFilters({ onCategoryChange, selectedCategory = "all" }: SearchFiltersProps) {
  const [category, setCategory] = useState(selectedCategory)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [freebiesOnly, setFreebiesOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [popularOnly, setPopularOnly] = useState(false)

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.value} className="flex items-center">
              <Checkbox 
                id={`category-${cat.value}`}
                checked={cat.value === category}
                onCheckedChange={() => handleCategoryChange(cat.value)}
                className="mr-2"
              />
              <label 
                htmlFor={`category-${cat.value}`}
                className="text-sm cursor-pointer w-full"
              >
                {cat.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 500]}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">${priceRange[0]}</span>
            <span className="text-sm">${priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      <Separator />

      <div>
        <h3 className="font-medium mb-4">Date</h3>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Separator />
        
      <div>
        <h3 className="font-medium mb-4">Additional Filters</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="freebies-only" className="flex-grow">Free events only</Label>
            <Switch 
              id="freebies-only" 
              checked={freebiesOnly}
              onCheckedChange={setFreebiesOnly}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="available-only" className="flex-grow">Available tickets only</Label>
            <Switch 
              id="available-only" 
              checked={availableOnly}
              onCheckedChange={setAvailableOnly}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="popular-only" className="flex-grow">Popular events only</Label>
            <Switch 
              id="popular-only" 
              checked={popularOnly}
              onCheckedChange={setPopularOnly}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Button className="w-full">Apply Filters</Button>
      <Button variant="outline" className="w-full">Reset Filters</Button>
    </div>
  )
}
