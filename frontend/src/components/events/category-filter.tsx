
import { Calendar, Music, Video, Users, BookOpen, Trophy, HeartHandshake, Paintbrush } from "lucide-react"

interface CategoryFilterProps {
  onSelect: (categoryId: string) => void
  selectedCategory: string
}

export function CategoryFilter({ onSelect, selectedCategory }: CategoryFilterProps) {
  const categories = [
    { id: "all", name: "All Events", icon: <Calendar className="h-5 w-5" /> },
    { id: "music", name: "Music", icon: <Music className="h-5 w-5" /> },
    { id: "conference", name: "Conferences", icon: <Users className="h-5 w-5" /> },
    { id: "workshop", name: "Workshops", icon: <BookOpen className="h-5 w-5" /> },
    { id: "sports", name: "Sports", icon: <Trophy className="h-5 w-5" /> },
    { id: "charity", name: "Charity", icon: <HeartHandshake className="h-5 w-5" /> },
    { id: "arts", name: "Arts", icon: <Paintbrush className="h-5 w-5" /> },
    { id: "entertainment", name: "Entertainment", icon: <Video className="h-5 w-5" /> },
  ]

  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4">
      <div className="flex gap-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
              selectedCategory === category.id 
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-card/80'
            }`}
          >
            <div className="relative z-10">
              {category.icon}
            </div>
            <span className="text-sm whitespace-nowrap relative z-10">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
